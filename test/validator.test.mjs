// Integration: the SDK's render logs must satisfy the repository's own
// validator — the same tool any third-party implementation is checked with.
// A test that cannot fail proves nothing, so a corrupted log must FAIL.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { families, renderLog } from "../dist/index.js";

const validator = new URL("../conformance/validate.mjs", import.meta.url).pathname;
const dir = mkdtempSync(join(tmpdir(), "three-senses-"));

function run(file) {
  try {
    return { code: 0, out: execFileSync("node", [validator, file], { encoding: "utf8" }) };
  } catch (error) {
    return { code: error.status, out: `${error.stdout}${error.stderr}` };
  }
}

test("every SDK render log PASSES the published validator (R1 + R8)", () => {
  const file = join(dir, "good.json");
  writeFileSync(file, JSON.stringify(families().map((f) => renderLog(f))));
  const { code, out } = run(file);
  assert.equal(code, 0, out);
  for (const f of families()) assert.match(out, new RegExp(`PASS ${f}`));
});

test("NEGATIVE CONTROL: a fused-loop log FAILS R8", () => {
  const bad = renderLog("WATER");
  bad.cycleMs -= 1000; // trims the trailing quiet: the fusion bug
  const file = join(dir, "bad-cycle.json");
  writeFileSync(file, JSON.stringify([bad]));
  const { code, out } = run(file);
  assert.equal(code, 1);
  assert.match(out, /R8 loop-seamlessness/);
});

test("NEGATIVE CONTROL: a wrong rhythm FAILS R1", () => {
  const bad = renderLog("FIRE");
  bad.events = renderLog("STORM").events;
  const file = join(dir, "bad-rhythm.json");
  writeFileSync(file, JSON.stringify([bad]));
  const { code, out } = run(file);
  assert.equal(code, 1);
  assert.match(out, /R1 rhythm-identity/);
});
