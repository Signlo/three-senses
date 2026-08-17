/**
 * @ideafe/three-senses — SDK for the Three Senses Alerting Standard.
 *
 * The standard's rule set, in code:
 *  - ENVELOPE IS THE RHYTHM: one timeline of absolute on/off offsets renders
 *    on every channel (touch, light, tone) from one shared clock.
 *  - SEVERITY IS INTENSITY: severity scales strength/brightness/volume and
 *    never alters a rhythm. `timeline()` therefore takes no severity.
 *  - THE ALL-CLEAR IS SILENCE: ALL_CLEAR's timeline is empty.
 *  - TESTS ARE GENTLE: the TEST family's channel level is capped (R6).
 *  - LOOPS ARE SEAMLESS (R8): a repeat begins at exactly t0 + totalMs; the
 *    trailing quiet is part of the pattern. Use `cycleStart()`.
 *  - PHOTOSENSITIVITY IS A FLOOR (R5): light rhythms never exceed the
 *    published flash and transition bounds; `lightIsSafe()` checks any
 *    timeline against them.
 *
 * Normative sources: vocabulary.json and conformance/vectors.json in this
 * package. `conformance()` proves this SDK against the published vectors.
 */
import { VOCABULARY_DATA, VECTORS_DATA } from "./data.js";
export const VOCABULARY = VOCABULARY_DATA;
export const VECTORS = VECTORS_DATA;
export const STANDARD_VERSION = VOCABULARY_DATA.version;
export const LIGHT_BOUNDS = VOCABULARY_DATA.lightBounds;
export const SEVERITY_LEVELS = VOCABULARY_DATA.severity.levels;
export const SEVERITY_MARKS = VOCABULARY_DATA.severity.marks;
const FAMILY_NAMES = Object.keys(VOCABULARY_DATA.families);
/** Every family name in the vocabulary, ALL_CLEAR included. */
export function families() {
    return [...FAMILY_NAMES];
}
/** The family's normative definition. Throws on an unknown name (R7). */
export function family(name) {
    const f = VOCABULARY_DATA.families[name];
    if (!f)
        throw new Error(`Unknown family "${name}" (R7: no dialects)`);
    return { name, ...f };
}
/**
 * The family's chronometer timeline: absolute on/off offsets from t0.
 * Severity is deliberately not a parameter — it never changes a rhythm.
 */
export function timeline(name) {
    const f = family(name);
    const steps = [];
    let at = 0;
    for (const [on, gap] of f.pulses) {
        steps.push({ at, event: "on" });
        at += on;
        steps.push({ at, event: "off" });
        at += gap;
    }
    return { family: name, steps, totalMs: at };
}
/** The normative repeat interval (R8): timeline length, trailing quiet included. */
export function cycleMs(name) {
    return timeline(name).totalMs;
}
/** When cycle n (0-based) starts, for a loop anchored at t0 (R8). */
export function cycleStart(t0, n, name) {
    return t0 + n * cycleMs(name);
}
/** The severity ladder's flat level for a severity name, or a clamped number. */
export function severityLevel(severity) {
    if (typeof severity === "number")
        return Math.min(1, Math.max(0, severity));
    const level = SEVERITY_LEVELS[severity];
    if (level === undefined)
        throw new Error(`Unknown severity "${severity}"`);
    return level;
}
/** The color-independent mark count for a severity (0 to 3). */
export function severityMarks(severity) {
    const marks = SEVERITY_MARKS[severity];
    if (marks === undefined)
        throw new Error(`Unknown severity "${severity}"`);
    return marks;
}
/**
 * The ONE flat level every channel plays this alert at: the severity level,
 * capped by the family's fixedLevel (R6: TEST never exceeds 0.3).
 */
export function channelLevel(name, severity) {
    const f = family(name);
    const level = severityLevel(severity);
    return f.fixedLevel !== undefined ? Math.min(f.fixedLevel, level) : level;
}
/**
 * The pattern as a Vibration-API / Android style array:
 * [vibrate, pause, vibrate, ...], trailing quiet omitted (a one-shot call
 * needs no final pause; a LOOPING renderer must schedule the next call at
 * cycleStart(), which restores the trailing quiet exactly — R8).
 */
export function vibratePattern(name) {
    const f = family(name);
    const out = [];
    f.pulses.forEach(([on, gap], i) => {
        out.push(on);
        if (i < f.pulses.length - 1)
            out.push(gap);
    });
    return out;
}
/** Max flashes (on-events) in any sliding 1000 ms window of one cycle. */
export function flashesPerSecond(t) {
    const ons = t.steps.filter((s) => s.event === "on").map((s) => s.at);
    let worst = 0;
    for (const start of ons) {
        const inWindow = ons.filter((a) => a >= start && a < start + 1000).length;
        if (inWindow > worst)
            worst = inWindow;
    }
    return worst;
}
/** Max state transitions (on or off) in any sliding 1000 ms window. */
export function transitionsPerSecond(t) {
    const all = t.steps.map((s) => s.at);
    let worst = 0;
    for (const start of all) {
        const inWindow = all.filter((a) => a >= start && a < start + 1000).length;
        if (inWindow > worst)
            worst = inWindow;
    }
    return worst;
}
/** R5: true when a timeline sits inside the published photosensitivity bounds. */
export function lightIsSafe(t) {
    return (flashesPerSecond(t) <= LIGHT_BOUNDS.maxFlashesPerSecond &&
        transitionsPerSecond(t) <= LIGHT_BOUNDS.maxTransitionsPerSecond);
}
/** A render log in the format conformance/validate.mjs checks (R1 + R8). */
export function renderLog(name) {
    const t = timeline(name);
    return { family: name, events: [...t.steps], cycleMs: t.totalMs };
}
/**
 * Prove this SDK against the PUBLISHED conformance vectors: R1 rhythm
 * identity, R3 all-clear silence, R5 photosensitivity, R6 test gentleness,
 * R8 loop seamlessness. Returns every check; `pass` is the conjunction.
 */
export function conformance() {
    const results = [];
    const vectors = VECTORS_DATA.vectors;
    for (const name of FAMILY_NAMES) {
        const t = timeline(name);
        const v = vectors[name];
        const got = t.steps.map((s) => `${s.at}:${s.event}`).join(" ");
        const want = v.steps.map((s) => `${s.at}:${s.event}`).join(" ");
        results.push({
            family: name,
            requirement: "R1 rhythm-identity",
            pass: got === want,
            detail: got === want ? undefined : `rendered "${got}" expected "${want}"`,
        });
        results.push({
            family: name,
            requirement: "R8 loop-seamlessness",
            pass: t.totalMs === v.totalMs,
            detail: t.totalMs === v.totalMs ? undefined : `cycle ${t.totalMs} expected ${v.totalMs}`,
        });
        results.push({ family: name, requirement: "R5 photosensitivity", pass: lightIsSafe(t) });
    }
    results.push({
        family: "ALL_CLEAR",
        requirement: "R3 all-clear-silence",
        pass: timeline("ALL_CLEAR").steps.length === 0,
    });
    results.push({
        family: "TEST",
        requirement: "R6 test-gentleness",
        pass: channelLevel("TEST", "Extreme") <= 0.3,
    });
    return { pass: results.every((r) => r.pass), results };
}
