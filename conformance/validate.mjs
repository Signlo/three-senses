#!/usr/bin/env node
// Conformance validator for the Three Senses Alerting Standard.
// Usage: node conformance/validate.mjs <render-log.json>
// The log: {"family": "FIRE", "events": [{"at": 0, "event": "on"}, ...]}
// or an array of such objects. Offsets are scheduled times in ms from t0.
// Optional per-log "cycleMs": the interval at which the renderer repeats the
// pattern. Checked against the vector's normative totalMs (R8: the trailing
// quiet is part of the pattern; repeating earlier fuses pulses across the
// loop boundary).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const { vectors } = JSON.parse(
  readFileSync(join(here, "vectors.json"), "utf8"),
);

const logPath = process.argv[2];
if (!logPath) {
  console.error("usage: node conformance/validate.mjs <render-log.json>");
  process.exit(2);
}
const input = JSON.parse(readFileSync(logPath, "utf8"));
const logs = Array.isArray(input) ? input : [input];

let failures = 0;
for (const log of logs) {
  const expected = vectors[log.family];
  if (!expected) {
    console.error(`FAIL ${log.family}: unknown family (R7: no dialects)`);
    failures++;
    continue;
  }
  const got = (log.events ?? []).map((e) => `${e.at}:${e.event}`).join(" ");
  const want = expected.steps.map((e) => `${e.at}:${e.event}`).join(" ");
  if (got !== want) {
    console.error(`FAIL ${log.family} (R1 rhythm-identity)`);
    console.error(`  expected: ${want || "(silence)"}`);
    console.error(`  rendered: ${got || "(silence)"}`);
    failures++;
  } else if (log.cycleMs !== undefined && log.cycleMs !== expected.totalMs) {
    console.error(`FAIL ${log.family} (R8 loop-seamlessness)`);
    console.error(
      `  expected cycle: ${expected.totalMs} ms (trailing quiet included)`,
    );
    console.error(`  rendered cycle: ${log.cycleMs} ms`);
    failures++;
  } else {
    console.log(`PASS ${log.family}`);
  }
}
process.exit(failures ? 1 : 0);
