#!/usr/bin/env python3
"""Build the SURYA-SIAGA master dataset from interim observation layers.

Implements the methodology documented in docs/DECISION_METHODOLOGY.md,
docs/SCORING_FORMULA.md, docs/DATA_CONFIDENCE_METHOD.md and
docs/RECOMMENDATION_LOGIC.md. Every constant here is a documented MVP design
assumption, not an expert-validated value.

Absolute rule enforced throughout: a missing value is NEVER scored as 0. A
missing criterion is dropped from the weighted sum and from its denominator.
"""
import csv, json, math, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INTERIM, PROCESSED = ROOT / "data/interim", ROOT / "data/processed"

# --- MVP design assumptions (configurable) ------------------------------------
BASELINE_WEIGHTS = {"solar": 30.0, "social": 25.0, "criticality": 20.0, "resilience": 25.0}

# Rule-based criticality. Health services carry a higher baseline because loss of
# power interrupts continuity of essential care. Not an expert consensus value.
CRITICALITY_BY_TYPE = {"Puskesmas": 100.0, "Sekolah": 70.0}

# Ordinal mapping for categorical hazard classes.
HAZARD_CLASS_SCORE = {"Rendah": 33.0, "Sedang": 67.0, "Tinggi": 100.0}

# Social normalisation: log10 then min-max onto [FLOOR, 100]. The floor keeps the
# smallest school from contributing exactly 0, which in a weighted sum would be
# indistinguishable from "no data" — the very confusion the NULL-never-zero rule exists to prevent.
SOCIAL_FLOOR = 10.0

# A facility's link to an existing PLTS asset counts as ESTABLISHED only when
# the interim record states so positively with this marker. The default is "not
# established": a shared village name is not evidence of a physical or
# operational link, and the absence of a statement is not a verification.
# No row carries the marker today, so the EXPANSION_ASSESSMENT branch is
# implemented but unreachable until a human verifies a link and records it.
LINK_ESTABLISHED_MARKER = "hubungan_terverifikasi"

# Karhutla structural proxy: area-weighted share of a district's area in each
# hazard class, on 0-100. This is a DISTRICT-LEVEL STRUCTURAL PROXY, not a fire
# probability, not a site-specific risk, not a prediction, and not a live
# hotspot score. It is published for transparency and comparison; the
# Resilience dimension still scores the ordinal raw class, because adopting the
# proxy as the scoring input changes rankings substantially
# (research/SCORING_SENSITIVITY_ANALYSIS.md) and that is a methodology change
# requiring human approval under PROJECT_CONTEXT.md 17.1.
KARHUTLA_PROXY_CLASS_WEIGHTS = {"low": 0.0, "medium": 0.5, "high": 1.0}

# Minimum coverage before a numeric Priority Score may be emitted.
MIN_DIMENSIONS = 2
REQUIRED_DIMENSION = "criticality"


def first_year(text):
    """Extract the earliest 4-digit year stated in a free-text date field.

    Source date fields are not machine-uniform: karhutla carries
    "Hasil pengolahan data 2023; published 2024", where the data year is 2023
    and 2024 is only the publication year. Reading the first four characters
    turned that into the literal string "Hasi", which then propagated into
    every published record. Returns "" when no year is stated rather than
    substituting a default — an unknown year is not the current year.
    """
    m = re.search(r"(19|20)\d{2}", text or "")
    return m.group(0) if m else ""


def read(name):
    with open(INTERIM / name, encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def num(s):
    try:
        return float(s)
    except (TypeError, ValueError):
        return None


def load_sites():
    sites = {}
    for src in ("education_facilities.csv", "health_facilities.csv"):
        for r in read(src):
            if not r.get("latitude", "").strip() or r.get("coordinate_quality") not in (
                "official_exact", "derived_confirmed"):
                continue
            sites[r["record_id"]] = {
                "record_id": r["record_id"], "facility_name": r["facility_name"],
                "facility_type": r["facility_type"], "district": r["district"],
                "latitude": float(r["latitude"]), "longitude": float(r["longitude"]),
                "coordinate_quality": r["coordinate_quality"],
                "coordinate_source_data_year": r.get("coordinate_source_data_year", ""),
                "electricity_source": r.get("electricity_source", ""),
                "coordinate_source_name": r.get("coordinate_source_name", ""),
                "coordinate_source_url": r.get("coordinate_source_url", ""),
                "identity_source_name": r.get("source_name", ""),
                "identity_source_url": r.get("source_url", ""),
                "identity_verification_status": r.get("verification_status", ""),
            }
    return sites


def social_scores(beneficiary):
    """log10 + min-max onto [SOCIAL_FLOOR, 100] over canonical values only."""
    vals = {k: v for k, v in beneficiary.items() if v is not None}
    if len(vals) < 2:
        return {k: 100.0 for k in vals}
    logs = {k: math.log10(v) for k, v in vals.items()}
    lo, hi = min(logs.values()), max(logs.values())
    span = hi - lo
    if span == 0:
        return {k: 100.0 for k in vals}
    return {k: SOCIAL_FLOOR + (lg - lo) / span * (100.0 - SOCIAL_FLOOR) for k, lg in logs.items()}


def karhutla_structural_proxy(kar):
    """Area-weighted district hazard proxy on 0-100, or None when areas are absent.

    Returns None rather than 0 when any component is missing: a district with
    no area breakdown is unknown, not hazard-free.
    """
    areas = {k: num(kar.get(f"{k}_area_ha", "")) for k in KARHUTLA_PROXY_CLASS_WEIGHTS}
    total = num(kar.get("total_area_ha", ""))
    if total is None or total <= 0 or any(v is None for v in areas.values()):
        return None
    weighted = sum(KARHUTLA_PROXY_CLASS_WEIGHTS[k] * areas[k] for k in areas)
    return round(weighted / total * 100, 2)


def priority(dim_scores, weights):
    """Weighted sum over available dimensions only; denominator excludes missing."""
    present = {k: v for k, v in dim_scores.items() if v is not None}
    if REQUIRED_DIMENSION not in present or len(present) < MIN_DIMENSIONS:
        return None, 0.0, present
    wsum = sum(weights[k] for k in present)
    score = sum(present[k] * weights[k] for k in present) / wsum
    return round(score, 2), wsum / sum(weights.values()), present


def confidence(site, ben_obs, missing, karhutla_scope):
    """Six scored dimensions -> category. Never feeds back into Priority Score.

    Each dimension can add points; spatial specificity can also cap the result.
    """
    pts, reasons = 0, []

    pts += 2; reasons.append("otoritas sumber: portal pemerintah/teknis resmi")            # 1 authority
    if site["coordinate_source_data_year"] == "2021":
        reasons.append("koordinat berasal dari dataset 2021, bukan lokasi terverifikasi terkini")
    else:
        pts += 1; reasons.append("koordinat dari profil resmi terkini")                    # 2 recency
    if not missing:
        pts += 2
    elif len(missing) == 1:
        pts += 1
    reasons.append(f"kelengkapan: {4 - len(missing)}/4 dimensi tersedia")                   # 3 completeness
    if ben_obs and ben_obs.get("verification_status") == "verified_primary":
        pts += 1; reasons.append("beneficiary terverifikasi primer dan bertanggal")         # 4 verification

    # 5 spatial specificity — a scored dimension, and a ceiling. No site may reach
    # HIGH while its hazard input is a district proxy rather than a site value:
    # the evidence simply is not site-specific, however good the other dimensions are.
    spatial_capped = karhutla_scope is None or "kecamatan" in (karhutla_scope or "")
    if spatial_capped:
        reasons.append("spesifisitas spasial: bahaya hanya proksi kecamatan, bukan piksel situs")
    else:
        pts += 1; reasons.append("spesifisitas spasial: nilai bahaya per titik situs")

    if ben_obs and ben_obs.get("variance_classification"):                                  # 6 conflict/variance
        reasons.append("terdapat variansi antar-view sumber beneficiary (tercatat, bukan konflik)")
    else:
        pts += 1

    cat = "HIGH" if pts >= 6 else ("MEDIUM" if pts >= 4 else "NEEDS_VERIFICATION")
    if spatial_capped and cat == "HIGH":
        cat = "MEDIUM"
        reasons.append("dibatasi ke MEDIUM karena evidence bahaya belum site-specific")
    return cat, pts, "; ".join(reasons)


def source_row(layer, label, rec, name_key, url_key, ref_key, vstatus_key, scope, eligibility=""):
    """One traceability row, copied verbatim from an interim observation.

    Never fabricates a source: a layer with no interim record, or one with no
    stated source name, yields no row at all rather than a row with blank
    provenance that would read as though a source existed.
    """
    if not rec:
        return None
    name = (rec.get(name_key) or "").strip()
    if not name:
        return None
    return {
        "layer": layer,
        "label": label,
        "source_name": name,
        "source_url": (rec.get(url_key) or "").strip(),
        "reference": (rec.get(ref_key) or "").strip(),
        "reference_year": first_year(rec.get(ref_key, "")),
        "verification_status": (rec.get(vstatus_key) or "").strip(),
        "scope": scope,
        "scoring_eligibility": eligibility,
    }


def build():
    sites = load_sites()

    ben_canon, ben_raw = {}, {}
    for r in read("beneficiary_observations.csv"):
        if r["observation_role"] != "canonical":
            continue
        ben_raw[r["record_id"]] = r
        ben_canon[r["record_id"]] = num(r["beneficiary_value"])

    haz = {}
    for r in read("hazard_observations.csv"):
        haz.setdefault(r["record_id"], {})[r["hazard_type"]] = r

    solar = {r["record_id"]: r for r in read("solar_observations.csv")}

    assets = read("existing_energy_assets.csv")
    asset_districts = {a["district"] for a in assets}
    linked = {}
    for a in assets:
        for rid in filter(None, a["linked_record_ids"].split(";")):
            linked[rid] = a

    soc = social_scores(ben_canon)
    out = []
    for rid, s in sorted(sites.items()):
        s_src = dict(s, identity_source_year=s["coordinate_source_data_year"])
        kar = haz.get(rid, {}).get("karhutla", {})
        drt = haz.get(rid, {}).get("kekeringan", {})
        ghi = num(solar.get(rid, {}).get("ghi_value", ""))

        # Drought is regency-wide and identical for every site: zero discriminating
        # power, so it is carried as context and excluded from the resilience score.
        kar_eligible = kar.get("scoring_eligibility", "").startswith("provisional")
        dims = {
            "solar": None if ghi is None else ghi,
            "social": soc.get(rid),
            "criticality": CRITICALITY_BY_TYPE.get(s["facility_type"]),
            "resilience": HAZARD_CLASS_SCORE.get(kar.get("raw_class")) if kar_eligible else None,
        }
        missing = [k for k, v in dims.items() if v is None]
        score, cov, present = priority(dims, BASELINE_WEIGHTS)

        if score is None:
            status = "INSUFFICIENT_DATA"
        elif "solar" in missing and "social" in missing:
            status = "NEEDS_DATA_VERIFICATION"
        elif "solar" in missing:
            status = "PROVISIONAL_MISSING_SOLAR"
        elif "social" in missing:
            status = "PROVISIONAL_MISSING_SOCIAL"
        else:
            status = "PROVISIONAL_LIMITED_HAZARD"

        conf, conf_pts, conf_reason = confidence(s, ben_raw.get(rid), missing, kar.get("value_scope"))

        # Recommendation. No positive deployment call while the primary solar
        # dimension is unavailable for the site.
        asset = linked.get(rid)
        link_established = LINK_ESTABLISHED_MARKER in (asset or {}).get("link_basis", "")
        if asset and link_established:
            rec = "EXPANSION_ASSESSMENT"
            rec_reason = (f"Terdapat PLTS eksisting di desa {asset['village']} yang keterkaitannya dengan fasilitas ini "
                          "telah ditetapkan. Kajian diarahkan pada penguatan/ekspansi, bukan deployment baru.")
        elif asset:
            rec = "NEEDS_DATA_VERIFICATION"
            rec_reason = (f"Desa fasilitas ini ({asset['village']}) bernama sama dengan desa penerima hibah PLTS 2021; "
                          "hubungan fisik/operasional belum diverifikasi, sehingga jalur ekspansi maupun deployment "
                          "baru belum dapat ditentukan.")
        elif "solar" in missing:
            rec = "NEEDS_DATA_VERIFICATION"
            rec_reason = ("GHI site-level belum tersedia, sehingga dimensi Solar Suitability (bobot terbesar) tidak "
                          "dapat dinilai. Rekomendasi deployment belum dapat diberikan.")
        else:
            rec = "NEW_DEPLOYMENT_ASSESSMENT"
            rec_reason = "Seluruh dimensi utama tersedia dan tidak ada PLTS eksisting yang terkait dengan fasilitas ini."

        pos = []
        if dims["criticality"] and dims["criticality"] >= 100:
            pos.append("fasilitas layanan kesehatan dengan criticality baseline tertinggi")
        if dims["resilience"] and dims["resilience"] >= 100:
            pos.append("kecamatan berkelas bahaya karhutla Tinggi")
        if soc.get(rid) and soc[rid] >= 67:
            pos.append(f"jumlah peserta didik relatif besar ({int(ben_canon[rid])})")
        lim = ["bahaya karhutla hanya proksi kecamatan, bukan nilai piksel situs",
               "kekeringan hanya konteks kabupaten sehingga dikeluarkan dari skor"]
        if s["coordinate_source_data_year"] == "2021":
            lim.append("koordinat berasal dari dataset 2021")
        if s["district"] in asset_districts:
            lim.append("kecamatan memiliki PLTS historis 2021, tetapi keterkaitan dengan fasilitas ini tidak ditetapkan")

        years = [y for y in [first_year(kar.get("dataset_year", "")),
                             first_year((ben_raw.get(rid) or {}).get("data_reference_date", "")),
                             first_year(s["coordinate_source_data_year"])] if y]

        sources = [row for row in [
            source_row("facility", "Identitas fasilitas", s_src, "identity_source_name",
                       "identity_source_url", "identity_source_year",
                       "identity_verification_status", "site_point"),
            source_row("coordinate", "Koordinat", s_src, "coordinate_source_name",
                       "coordinate_source_url", "coordinate_source_data_year",
                       "coordinate_quality", "site_point"),
            source_row("beneficiary", "Penerima manfaat", ben_raw.get(rid), "source_name",
                       "source_url", "data_reference_date", "verification_status", "site_point"),
            source_row("solar", "Iradiasi surya (GHI)", solar.get(rid), "source_name",
                       "source_url", "dataset_year", "verification_status", "site_point"),
            source_row("karhutla", "Bahaya karhutla", kar, "source_name", "source_url",
                       "dataset_year", "verification_status", kar.get("value_scope", ""),
                       kar.get("scoring_eligibility", "")),
            source_row("kekeringan", "Bahaya kekeringan", drt, "source_name", "source_url",
                       "dataset_year", "verification_status", drt.get("value_scope", ""),
                       drt.get("scoring_eligibility", "")),
        ] if row]

        out.append({
            "record_id": rid, "facility_name": s["facility_name"], "facility_type": s["facility_type"],
            "district": s["district"], "latitude": s["latitude"], "longitude": s["longitude"],
            "beneficiary_value": ben_canon.get(rid),
            "beneficiary_status": "canonical_verified" if ben_canon.get(rid) is not None else "not_available",
            "ghi_value": ghi, "ghi_status": solar.get(rid, {}).get("verification_status", ""),
            "karhutla_class": kar.get("raw_class"), "karhutla_scope": kar.get("value_scope"),
            "karhutla_high_area_fraction": num(kar.get("high_area_fraction", "")),
            "drought_class": drt.get("raw_class"), "drought_scope": drt.get("value_scope"),
            "existing_plts_context": (asset["notes"] if asset else
                                      ("Kecamatan memiliki PLTS historis 2021; tidak ada keterkaitan dengan fasilitas ini."
                                       if s["district"] in asset_districts else "")),
            "solar_score": dims["solar"], "social_score": None if soc.get(rid) is None else round(soc[rid], 2),
            "criticality_score": dims["criticality"], "resilience_score": dims["resilience"],
            "priority_score": score, "score_status": status,
            "available_weight_fraction": round(cov, 3),
            "data_confidence": conf, "data_confidence_reason": conf_reason,
            "recommendation_type": rec, "recommendation_reason": rec_reason,
            "top_positive_factors": "; ".join(pos), "limitations": "; ".join(lim),
            "missing_data": "; ".join(missing),
            # Counts the rows actually published in "sources", so the summary
            # figure on a site page can never disagree with the list beside it.
            "source_count": len(sources),
            "latest_data_year": max(years) if years else "",
            # --- confidence inputs, surfaced verbatim -------------------------
            # Emitted so the TypeScript engine can recompute confidence from the
            # same facts this script used, and a parity test can prove the two
            # implementations agree. No new values: each is copied from interim.
            "coordinate_quality": s["coordinate_quality"],
            "coordinate_source_data_year": s["coordinate_source_data_year"],
            "beneficiary_verification_status": (ben_raw.get(rid) or {}).get("verification_status", ""),
            "beneficiary_variance_recorded": bool((ben_raw.get(rid) or {}).get("variance_classification")),
            "karhutla_scoring_eligibility": kar.get("scoring_eligibility", ""),
            "existing_asset_linked": asset is not None,
            "existing_asset_village": (asset or {}).get("village", ""),
            "existing_asset_link_established": bool(asset) and link_established,
            "confidence_points": conf_pts,
            # --- comparability -----------------------------------------------
            # Two sites are directly comparable only when their scores rest on
            # the same set of dimensions. `coverage_profile` names that set, so
            # a reader can see at a glance which comparisons are like-for-like.
            "available_dimension_count": len(present),
            "coverage_profile": "+".join(sorted(present)) if present else "none",
            # A single global ranking across the whole set is only defensible
            # when every site is scored on the full baseline. Nothing here is
            # rank-eligible while any dimension is missing.
            "global_rank_eligible": round(cov, 6) >= 1.0,
            "karhutla_structural_proxy": karhutla_structural_proxy(kar),
            "karhutla_low_area_ha": num(kar.get("low_area_ha", "")),
            "karhutla_medium_area_ha": num(kar.get("medium_area_ha", "")),
            "karhutla_high_area_ha": num(kar.get("high_area_ha", "")),
            "karhutla_total_area_ha": num(kar.get("total_area_ha", "")),
            "sources": sources,
        })
    return out


def main():
    rows = build()
    PROCESSED.mkdir(parents=True, exist_ok=True)
    cols = list(rows[0].keys())
    with open(PROCESSED / "site_master_dataset.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows([{k: ("" if v is None else v) for k, v in r.items()} for r in rows])
    with open(PROCESSED / "site_master_dataset.json", "w") as f:
        json.dump({"methodology": "Weighted Multi-Criteria Decision Analysis (Weighted Sum Model)",
                   "weights_are": "MVP design assumption, not expert-validated AHP",
                   "baseline_weights": BASELINE_WEIGHTS, "criticality_by_type": CRITICALITY_BY_TYPE,
                   "hazard_class_score": HAZARD_CLASS_SCORE, "social_normalisation":
                   f"log10 + min-max onto [{SOCIAL_FLOOR}, 100]",
                   "missing_value_policy": "NULL never scored as 0; missing criteria excluded from numerator and denominator",
                   "sites": rows}, f, indent=2, ensure_ascii=False)
    print(f"wrote {len(rows)} sites")


if __name__ == "__main__":
    main()
