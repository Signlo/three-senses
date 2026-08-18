// The web renderer's promise: every edge on the shared clock, cycles at
// exactly t0 + n * cycleMs (R8), severity as level only, silence for
// ALL_CLEAR, and a stop() that actually stops.
import { test } from "node:test";
import assert from "node:assert/strict";
import { startAlert } from "../dist/web.js";
import { cycleMs, timeline } from "../dist/index.js";

test("STORM edges fire on the published offsets across the loop boundary", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const edges = [];
  const alert = startAlert("STORM", {
    severity: "Severe",
    vibrate: false,
    onFlash: (on) => edges.push(on),
  });
  assert.equal(alert.level, 1); // light+sound REACH: full from Moderate up
  let now = 0;
  const advance = (to) => {
    t.mock.timers.tick(to - now);
    now = to;
  };
  advance(1);
  assert.deepEqual(edges, [true]); // knock 1 lands at t0
  advance(499);
  assert.equal(edges.length, 1); // nothing before its off-edge
  advance(501);
  assert.deepEqual(edges, [true, false]);
  advance(3501);
  assert.equal(edges.length, 6); // the full cycle body: 3 knocks on/off
  advance(4499);
  assert.equal(edges.length, 6); // THE TRAILING QUIET: nothing may fire here (R8)
  advance(4501);
  assert.equal(edges.length, 7); // cycle 2's knock at exactly t0 + cycleMs
  assert.equal(edges.at(-1), true);
  assert.equal(cycleMs("STORM"), 4500);
  alert.stop();
});

test("stop() ends the loop and turns the light off", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const edges = [];
  const alert = startAlert("FIRE", { vibrate: false, onFlash: (on) => edges.push(on) });
  t.mock.timers.tick(700); // a few beeps in
  alert.stop();
  const after = edges.length;
  assert.equal(edges[after - 1], false); // the stop turned it off
  t.mock.timers.tick(10_000);
  assert.equal(edges.length, after); // nothing fired after stop
});

test("loop: false plays exactly one cycle", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const edges = [];
  const alert = startAlert("TEST", { loop: false, vibrate: false, onFlash: (on) => edges.push(on) });
  assert.equal(alert.level, 0.3); // R6 cap applied by default Extreme
  t.mock.timers.tick(cycleMs("TEST") * 3);
  assert.equal(edges.length, timeline("TEST").steps.length);
  alert.stop();
});

test("ALL_CLEAR plays the release exactly once and never loops (R3)", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const edges = [];
  const levels = [];
  const alert = startAlert("ALL_CLEAR", {
    vibrate: false,
    loop: true, // even asked to loop, a play-once family refuses
    onFlash: (on, level) => { edges.push(on); levels.push(level); },
  });
  t.mock.timers.tick(60_000);
  // One cycle only: two on-edges (the long press and the settling press).
  assert.equal(edges.filter((on) => on === true).length, 2);
  // At the fixed gentle level: relief must never blast.
  assert.ok(levels.every((l) => l === 0.25));
  alert.stop();
});
