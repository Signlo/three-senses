// The alignment gate (born of the 2026-08-18 FCC review round 2).
// Scans EVERY tracked file, including machine-readable JSON keys and the
// generated SDK data, for banned claims and version drift. The lesson it
// encodes: prose greps miss JSON keys, and corrections must DELETE the old
// sentence, not merely add a new one beside it.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BANNED = [
  /quiet (means|device means) (you are )?safe/i,
  /a quiet device means safe/i,
  /allClearIsSilence/,
  /each be answerable through sight alone/i,
  /MUST each be answerable through sight/i,
  /each channel enough to act on/i,
  /field.tested/i,
  /readable by sight, touch, or hearing alone, each/i,
];
const root = process.cwd();
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (["node_modules", ".git", "dist"].includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith("check-consistency.mjs")) continue;
    else if (/\.(md|json|ts|mjs|txt|cff)$/.test(name)) files.push(p);
  }
})(root);

let failures = 0;
for (const f of files) {
  const text = readFileSync(f, "utf8");
  for (const re of BANNED) {
    const m = text.match(re);
    if (m) { console.error(`BANNED ${f}: "${m[0]}"`); failures++; }
  }
}

// Version agreement: every version-bearing artifact must match vocabulary.json.
const vocab = JSON.parse(readFileSync("vocabulary.json", "utf8"));
const v = vocab.version;
const pkg = JSON.parse(readFileSync("package.json", "utf8")).version;
if (pkg !== v) { console.error(`VERSION package.json ${pkg} != vocabulary ${v}`); failures++; }
const std = readFileSync("THE-STANDARD.md", "utf8");
if (!std.includes(`Draft ${v}`)) { console.error(`VERSION THE-STANDARD.md missing Draft ${v}`); failures++; }
const readme = readFileSync("README.md", "utf8");
if (!readme.includes(`draft ${v}`) && !readme.includes(`Draft ${v}`)) { console.error(`VERSION README missing ${v}`); failures++; }
const vectors = JSON.parse(readFileSync("conformance/vectors.json", "utf8"));
if (vectors.standardVersion !== v) { console.error(`VERSION vectors ${vectors.standardVersion} != ${v}`); failures++; }
const cff = readFileSync("CITATION.cff", "utf8");
if (!cff.includes("cff-version: 1.2.0")) { console.error("CITATION.cff cff-version corrupted"); failures++; }
if (!cff.includes(`version: ${v}`)) { console.error(`CITATION.cff software version != ${v}`); failures++; }
const data = readFileSync("src/data.ts", "utf8");
if (!data.includes(`"version": "${v}"`)) { console.error(`VERSION src/data.ts stale (run npm run embed)`); failures++; }

// Unknown must be Severe-equivalent (presumed dangerous): touch .75, reach 1, marks 3.
const s = vocab.severity;
if (s.touchLevels.Unknown !== s.touchLevels.Severe) { console.error(`UNKNOWN touch ${s.touchLevels.Unknown} != Severe ${s.touchLevels.Severe}`); failures++; }
if (s.reachLevels.Unknown !== s.reachLevels.Severe) { console.error(`UNKNOWN reach ${s.reachLevels.Unknown} != Severe ${s.reachLevels.Severe}`); failures++; }
if (s.marks.Unknown !== s.marks.Severe) { console.error(`UNKNOWN marks ${s.marks.Unknown} != Severe ${s.marks.Severe}`); failures++; }

if (failures) { console.error(`\n${failures} consistency failure(s).`); process.exit(1); }
console.log(`consistency OK: ${files.length} files clean, version ${v} everywhere, Unknown = Severe-equivalent`);
