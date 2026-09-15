/**
 * The product's transparency badge vocabulary — defined once.
 *
 * Raw verification strings from the interim layer (`verified_primary`,
 * `secondary_copy_requires_official_confirmation`, `official_exact`, …) are
 * mapped here onto a small fixed set of badges. Without a single mapping the
 * same underlying state would get worded differently on different screens, and
 * the vocabulary would grow a synonym per page.
 */
import type { BadgeTone } from "@/components/ui/Badge";

export type TransparencyBadgeKey =
  | "verified_primary"
  | "verified_secondary"
  | "external_manual_verification"
  | "historical"
  | "provisional_proxy"
  | "pending_verification"
  | "missing_data";

export interface TransparencyBadge {
  readonly key: TransparencyBadgeKey;
  readonly label: string;
  readonly tone: BadgeTone;
  readonly meaning: string;
}

export const TRANSPARENCY_BADGES: Readonly<
  Record<TransparencyBadgeKey, TransparencyBadge>
> = {
  verified_primary: {
    key: "verified_primary",
    label: "Verified Primary",
    tone: "success",
    meaning: "Diverifikasi terhadap sumber primer resmi.",
  },
  verified_secondary: {
    key: "verified_secondary",
    label: "Verified Secondary",
    tone: "info",
    meaning: "Diverifikasi terhadap sumber sekunder yang kredibel.",
  },
  external_manual_verification: {
    key: "external_manual_verification",
    label: "External Manual Verification",
    tone: "info",
    meaning:
      "Diverifikasi secara manual di luar environment ini, lalu diserahkan sebagai handoff.",
  },
  historical: {
    key: "historical",
    label: "Historical Data",
    tone: "warning",
    meaning:
      "Menggambarkan keadaan masa lalu, bukan keadaan sekarang: tahun rujukannya lebih lama dari data terbaru situs ini.",
  },
  provisional_proxy: {
    key: "provisional_proxy",
    label: "Provisional Proxy",
    tone: "unverified",
    meaning:
      "Tidak menggambarkan situs ini sendiri, melainkan angka kecamatan atau kabupaten yang berdiri sebagai penggantinya.",
  },
  pending_verification: {
    key: "pending_verification",
    label: "Pending Verification",
    tone: "neutral",
    meaning: "Sumbernya ada, tetapi nilainya belum diambil atau belum dikonfirmasi.",
  },
  missing_data: {
    key: "missing_data",
    label: "Missing Data",
    tone: "neutral",
    meaning: "Nilainya belum diperoleh sama sekali. Tidak pernah dinilai 0.",
  },
};

/**
 * Maps a raw verification status onto the badge vocabulary.
 *
 * Returns `null` for a status that carries no transparency claim (for example
 * a coordinate quality such as `official_exact`, which is reported in its own
 * field rather than as a verification badge).
 */
export function badgeForVerificationStatus(
  status: string,
): TransparencyBadge | null {
  const value = status.trim();
  if (value.length === 0) return TRANSPARENCY_BADGES.missing_data;
  if (value === "verified_primary") return TRANSPARENCY_BADGES.verified_primary;
  if (value === "verified_secondary") return TRANSPARENCY_BADGES.verified_secondary;
  if (value === "external_manual_verification") {
    return TRANSPARENCY_BADGES.external_manual_verification;
  }
  // Both "requires_point_extraction" and
  // "secondary_copy_requires_official_confirmation" mean the same thing to a
  // reader: the value is not confirmed yet.
  if (value.includes("requires")) return TRANSPARENCY_BADGES.pending_verification;
  if (value === "not_available") return TRANSPARENCY_BADGES.missing_data;
  return null;
}
