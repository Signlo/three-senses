// The SMS-profile annex's parser: one regex, no AI — held by tests.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSmsCode, channelLevel, timeline } from "../dist/index.js";

test("parses real annex examples", () => {
  assert.deepEqual(
    parseSmsCode(
      "Tsunami warning for the coast. Move to high ground now. 3S:W4",
    ),
    { family: "WATER", severity: "Extreme" },
  );
  assert.deepEqual(
    parseSmsCode("Monthly siren test today at noon. No action needed. [3S:T1]"),
    { family: "TEST", severity: "Minor" },
  );
  assert.deepEqual(parseSmsCode("The flood danger has ended. 3S:A0"), {
    family: "ALL_CLEAR",
    severity: "allClear",
  });
});

test("case-insensitive, first match wins, position-independent", () => {
  assert.deepEqual(parseSmsCode("3s:f3 evacuate now"), {
    family: "FIRE",
    severity: "Severe",
  });
  assert.deepEqual(parseSmsCode("3S:G2 then later 3S:F4"), {
    family: "GROUND",
    severity: "Moderate",
  });
});

test("rule 4: malformed or absent codes are null, never a guess", () => {
  assert.equal(parseSmsCode("No code here at all"), null);
  assert.equal(parseSmsCode("3S:X4"), null); // unknown family letter
  assert.equal(parseSmsCode("3S:W9"), null); // digit out of range
  assert.equal(parseSmsCode("W4"), null); // prefix required
  assert.equal(parseSmsCode("A3S:W4"), null); // word boundary required
});

test("rules 2 and 3 hold at the renderer: TEST stays gentle, ALL_CLEAR plays the release once", () => {
  const drill = parseSmsCode("Drill message 3S:T4");
  assert.equal(channelLevel(drill.family, drill.severity), 0.3);
  const clear = parseSmsCode("Danger over 3S:A0");
  // The all-clear renders its gentle release cue (once), never an alarm loop.
  assert.equal(timeline(clear.family).totalMs, 2400);
  assert.equal(channelLevel(clear.family, "Extreme"), 0.25);
});
