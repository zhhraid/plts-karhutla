#!/usr/bin/env node
/**
 * Copies the validated build artefact into public/data/ for the web app.
 *
 * Deliberately a copy, not a symlink or a direct import from data/processed:
 * the app must only ever serve a dataset that has passed
 * scripts/validate_master_dataset.py, and `npm run data:build` runs the
 * validator immediately before this step.
 */
import { copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "data", "processed", "site_master_dataset.json");
const destDir = path.join(root, "public", "data");
const dest = path.join(destDir, "site_master_dataset.json");

const parsed = JSON.parse(await readFile(src, "utf-8"));
if (!Array.isArray(parsed.sites) || parsed.sites.length === 0) {
  throw new Error("refusing to publish an empty dataset");
}

await mkdir(destDir, { recursive: true });
await copyFile(src, dest);
console.log(`synced ${parsed.sites.length} sites -> public/data/site_master_dataset.json`);
