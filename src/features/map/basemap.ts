import type { StyleSpecification } from "maplibre-gl";

/**
 * Raster basemap.
 *
 * OpenStreetMap standard tiles, with the ODbL attribution the licence requires
 * rendered by the map's attribution control. Tiles are the product's only
 * runtime network dependency; everything else is preprocessed and bundled.
 *
 * The map is built so that losing the tiles degrades rather than breaks: the
 * markers are DOM elements positioned by the map's own projection, so they
 * stay correct on a blank ground. That matters for a tool aimed at Kubu Raya,
 * where connectivity is exactly what is not guaranteed.
 */
export const OSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "#eef2f6" },
    },
    { id: "osm", type: "raster", source: "osm" },
  ],
};

/** Kubu Raya. Used only when no site has coordinates to fit to. */
export const FALLBACK_CENTER: [number, number] = [109.35, -0.35];
export const FALLBACK_ZOOM = 8.5;
