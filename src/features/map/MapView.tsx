"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";
import { createRoot, type Root } from "react-dom/client";

import { FALLBACK_CENTER, FALLBACK_ZOOM, OSM_STYLE } from "@/features/map/basemap";
import { SiteMarker } from "@/features/map/SiteMarker";
import type { Site } from "@/types";

import "maplibre-gl/dist/maplibre-gl.css";

/** Approximate popup geometry, kept in step with SitePopup's classes. */
const POPUP_WIDTH = 320;
const POPUP_HEIGHT = 320;
const POPUP_SHEET_HEIGHT = 300;

/**
 * The map canvas and its markers.
 *
 * Markers are React components mounted into DOM elements handed to MapLibre,
 * rather than canvas symbols, so each one is a real focusable button with an
 * accessible name. A map whose only affordance is a mouse click on a painted
 * dot is unusable for part of the audience.
 */
export function MapView({
  sites,
  selectedId,
  onSelect,
}: {
  readonly sites: readonly Site[];
  readonly selectedId: string | null;
  readonly onSelect: (site: Site) => void;
}) {
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef<Map<string, { marker: maplibregl.Marker; root: Root }>>(
    new Map(),
  );
  const [tilesFailed, setTilesFailed] = useState(false);
  // Bumped when the map reports the style is ready, to re-fit the view.
  const [loadTick, setLoadTick] = useState(0);

  // Keep the newest handler and selection reachable from the marker roots
  // without tearing every marker down on each render.
  const handler = useRef(onSelect);
  handler.current = onSelect;
  const currentSelection = useRef(selectedId);
  currentSelection.current = selectedId;

  useEffect(() => {
    if (container.current === null || map.current !== null) return;

    // The Map object itself is never reassigned, only mutated, so capturing it
    // here gives the cleanup the same collection later effects populate.
    const registry = markers.current;
    const instance = new maplibregl.Map({
      container: container.current,
      style: OSM_STYLE,
      center: FALLBACK_CENTER,
      zoom: FALLBACK_ZOOM,
      attributionControl: { compact: true },
    });
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    instance.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

    // A tile failure is reported, not hidden. The markers remain accurate on
    // the blank ground, so the view stays usable and the reader knows why it
    // looks bare.
    instance.on("error", (event) => {
      const source = (event as { sourceId?: string }).sourceId;
      if (source === "osm") setTilesFailed(true);
    });

    // `styledata` fires as soon as the style is parsed and needs no tile to
    // have arrived, so the view is framed correctly even when the basemap is
    // unreachable. `load` additionally covers the normal path.
    const refit = () => {
      instance.resize();
      setLoadTick((tick) => tick + 1);
    };
    instance.once("styledata", refit);
    instance.once("load", refit);

    map.current = instance;
    return () => {
      for (const { marker, root } of registry.values()) {
        marker.remove();
        queueMicrotask(() => root.unmount());
      }
      registry.clear();
      instance.remove();
      map.current = null;
    };
  }, []);

  // Sync markers with the filtered set.
  useEffect(() => {
    const instance = map.current;
    if (instance === null) return;

    const wanted = new Set(sites.map((site) => site.recordId));
    for (const [id, entry] of markers.current) {
      if (!wanted.has(id)) {
        entry.marker.remove();
        const { root } = entry;
        queueMicrotask(() => root.unmount());
        markers.current.delete(id);
      }
    }

    for (const site of sites) {
      const existing = markers.current.get(site.recordId);
      if (existing !== undefined) {
        existing.root.render(
          <SiteMarker
            site={site}
            selected={currentSelection.current === site.recordId}
            onSelect={(value) => handler.current(value)}
          />,
        );
        continue;
      }
      const element = document.createElement("div");
      const root = createRoot(element);
      root.render(
        <SiteMarker
          site={site}
          selected={currentSelection.current === site.recordId}
          onSelect={(value) => handler.current(value)}
        />,
      );
      const marker = new maplibregl.Marker({ element })
        .setLngLat([site.longitude, site.latitude])
        .addTo(instance);
      markers.current.set(site.recordId, { marker, root });
    }

    if (sites.length === 0) return;
    // Resize first: fitting against a stale container size computes the wrong
    // zoom and pushes edge markers out of view.
    instance.resize();
    const bounds = new maplibregl.LngLatBounds();
    for (const site of sites) bounds.extend([site.longitude, site.latitude]);
    instance.fitBounds(bounds, {
      // Asymmetric padding leaves room for the popup card, which docks to the
      // top-right on wide screens and the bottom on narrow ones.
      padding: { top: 56, right: 56, bottom: 72, left: 56 },
      maxZoom: 12,
      duration: 0,
    });
  }, [sites, loadTick]);

  // Re-render markers when the selection changes, so the active one is marked.
  useEffect(() => {
    for (const site of sites) {
      const entry = markers.current.get(site.recordId);
      entry?.root.render(
        <SiteMarker
          site={site}
          selected={selectedId === site.recordId}
          onSelect={(value) => handler.current(value)}
        />,
      );
    }
  }, [selectedId, sites]);

  // Nudge a selected marker out from behind the popup.
  //
  // Without this, clicking a marker near where the card docks makes the card
  // cover the very marker that opened it. The map pans only when the marker is
  // actually occluded, so an ordinary selection does not move the view.
  useEffect(() => {
    const instance = map.current;
    if (instance === null || selectedId === null) return;
    const site = sites.find((candidate) => candidate.recordId === selectedId);
    if (site === undefined) return;

    const { width, height } = instance.getCanvas().getBoundingClientRect();
    const point = instance.project([site.longitude, site.latitude]);

    // Mirrors the docking rules in SitePopup: bottom sheet under Tailwind's
    // `sm` breakpoint, top-right card at or above it.
    const occluded =
      width >= 640
        ? point.x > width - POPUP_WIDTH - 24 && point.y < POPUP_HEIGHT + 24
        : point.y > height - POPUP_SHEET_HEIGHT;
    if (!occluded) return;

    instance.panBy(
      width >= 640 ? [POPUP_WIDTH * 0.7, 0] : [0, POPUP_SHEET_HEIGHT * 0.6],
      { duration: 250 },
    );
  }, [selectedId, sites]);

  return (
    <>
      <div
        ref={container}
        role="application"
        aria-label="Peta sebaran situs kandidat PLTS"
        className="h-full w-full"
      />
      {tilesFailed ? (
        <p className="pointer-events-none absolute left-3 top-3 z-10 max-w-[16rem] rounded-md border border-warning bg-warning-subtle px-3 py-2 text-xs leading-snug text-warning">
          Peta dasar tidak dapat dimuat (jaringan). Posisi penanda tetap akurat.
        </p>
      ) : null}
    </>
  );
}
