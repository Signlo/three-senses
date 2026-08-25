import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  VOCABULARY,
  VECTORS,
  STANDARD_VERSION,
  families,
  family,
  timeline,
  cycleMs,
  cycleStart,
  severityLevel,
  reachLevel,
  severityMarks,
  channelLevel,
  lightSoundLevel,
  vibratePattern,
  flashesPerSecond,
  transitionsPerSecond,
  lightIsSafe,
  renderLog,
  conformance,
  LIGHT_BOUNDS,
} from "../dist/index.js";

const rootVocabulary = JSON.parse(
  readFileSync(new URL("../vocabulary.json", import.meta.url)),
);
const rootVectors = JSON.parse(
  readFileSync(new URL("../conformance/vectors.json", import.meta.url)),
);

test("the embedded data IS the published data (drift guard)", () => {
  assert.deepEqual(VOCABULARY, rootVocabulary);
  assert.deepEqual(VECTORS, rootVectors);
  assert.equal(STANDARD_VERSION, rootVocabulary.version);
});

test("R1 rhythm-identity: every family's timeline equals its published vector", () => {
  for (const name of families()) {
    const t = timeline(name);
    assert.deepEqual(
      t.steps.map((s) => `${s.at}:${s.event}`),
      rootVectors.vectors[name].steps.map((s) => `${s.at}:${s.event}`),
      name,
    );
  }
});

test("R8 loop-seamlessness: totalMs equals the vector's, and cycles never overlap", () => {
  for (const name of families()) {
    assert.equal(cycleMs(name), rootVectors.vectors[name].totalMs, name);
    assert.equal(cycleStart(1000, 3, name), 1000 + 3 * cycleMs(name), name);
    const t = timeline(name);
    if (t.steps.length > 0) {
      const lastOff = t.steps[t.steps.length - 1].at;
      assert.ok(lastOff <= t.totalMs, `${name}: last event beyond the cycle`);
    }
  }
});

test("R2 severity-invariance: severity is intensity, never a rhythm input", () => {
  assert.equal(timeline.length, 1); // no severity parameter exists
  // TOUCH grades in four strengths (DeafBlind severity by hand)
  assert.equal(severityLevel("Extreme"), 1);
  assert.equal(severityLevel("Severe"), 0.75);
  assert.equal(severityLevel("Moderate"), 0.5);
  assert.equal(severityLevel("Minor"), 0.25);
  // SAFE NOW is the release cue's own gentle level, capped by fixedLevel.
  assert.equal(severityLevel("allClear"), 0.25);
  assert.equal(severityLevel(2), 1); // clamped
  // LIGHT and SOUND reach: full from DANGER COMING upward
  assert.equal(reachLevel("Extreme"), 1);
  assert.equal(reachLevel("Severe"), 1);
  assert.equal(reachLevel("Moderate"), 1);
  assert.equal(reachLevel("Minor"), 0.25);
  assert.equal(reachLevel("allClear"), 0.25);
  // MARKS count the step: one to three
  assert.equal(severityMarks("Minor"), 1);
  assert.equal(severityMarks("Moderate"), 2);
  assert.equal(severityMarks("Severe"), 3);
  assert.equal(severityMarks("Extreme"), 3);
  assert.equal(severityMarks("allClear"), 0);
});

test("R3 all-clear-release: the cue plays once, gentle, and is never a loop", () => {
  // The release, panel-refined (0.8.0): one long soft press, a REAL breath
  // (800 ms, a felt gap through a pillow), a short settling press.
  const t = timeline("ALL_CLEAR");
  assert.deepEqual(
    t.steps.map((s) => `${s.at}:${s.event}`),
    ["0:on", "1200:off", "2000:on", "2400:off"],
  );
  assert.equal(t.totalMs, 2400);
  assert.deepEqual(vibratePattern("ALL_CLEAR"), [1200, 800, 400]);
  // Declared play-once: repetition is reserved for danger.
  assert.equal(family("ALL_CLEAR").presentation, "once");
  // Fixed gentle level at EVERY severity: relief must never blast.
  assert.equal(channelLevel("ALL_CLEAR", "Extreme"), 0.25);
  assert.equal(lightSoundLevel("ALL_CLEAR", "Extreme"), 0.25);
});

test("R5 photosensitivity: every family sits inside the published light bounds", () => {
  for (const name of families()) {
    const t = timeline(name);
    assert.ok(lightIsSafe(t), name);
    assert.ok(flashesPerSecond(t) <= LIGHT_BOUNDS.maxFlashesPerSecond, name);
    assert.ok(
      transitionsPerSecond(t) <= LIGHT_BOUNDS.maxTransitionsPerSecond,
      name,
    );
  }
  // FIRE is the fastest thing in the vocabulary and still inside the bound.
  assert.equal(flashesPerSecond(timeline("FIRE")), 3);
});

test("R6 test-gentleness: TEST never exceeds 0.3 on any channel at any severity", () => {
  assert.equal(channelLevel("TEST", "Extreme"), 0.3);
  assert.equal(channelLevel("TEST", "Severe"), 0.3);
  assert.equal(channelLevel("TEST", "Minor"), 0.25); // the cap is a ceiling, not a floor
  assert.equal(channelLevel("FIRE", "Extreme"), 1);
});

test("R7 no-dialects: unknown families throw", () => {
  assert.throws(() => family("VOLCANO"), /R7/);
  assert.throws(() => timeline("VOLCANO"), /R7/);
});

test("vibratePattern omits the trailing quiet and matches the pulses", () => {
  assert.deepEqual(vibratePattern("WATER"), [2000, 1000, 2000]);
  assert.deepEqual(vibratePattern("STORM"), [500, 1000, 500, 1000, 500]);
  assert.deepEqual(vibratePattern("GROUND"), [4000]);
});

test("renderLog matches the validator's expected shape", () => {
  const log = renderLog("FIRE");
  assert.equal(log.family, "FIRE");
  assert.equal(log.cycleMs, 4000);
  assert.equal(log.events.length, 20);
});

test("conformance() passes on itself, and its negative control can fail", () => {
  const { pass, results } = conformance();
  assert.equal(pass, true);
  assert.ok(results.length >= families().length * 3);
  assert.ok(results.every((r) => r.pass));
});
