/**
 * Browser renderers for the Three Senses vocabulary.
 *
 * Design: the SDK owns the CLOCK and the RHYTHM; you own the surface. Every
 * renderer schedules against one absolute origin (spec: one clock, R4) with
 * drift correction — never `setTimeout(previousGap)` chains — and repeats at
 * exactly `cycleStart(t0, n)` so pulses never fuse across the loop boundary
 * (R8). Severity arrives only as the one flat level (R2), already capped for
 * TEST (R6). ALL_CLEAR renders nothing on any channel (R3).
 */
import { timeline, cycleMs, channelLevel, vibratePattern, } from "./index.js";
function scheduleTimeline(name, t0, loop, onEdge, onCycleStart) {
    const t = timeline(name);
    const cycle = cycleMs(name);
    const state = { timer: null };
    if (t.steps.length === 0)
        return state; // ALL_CLEAR: silence (R3)
    let cycleIndex = 0;
    let stepIndex = 0;
    const fire = () => {
        if (stepIndex === 0)
            onCycleStart(cycleIndex);
        const step = t.steps[stepIndex];
        onEdge(step.event === "on");
        stepIndex += 1;
        if (stepIndex >= t.steps.length) {
            stepIndex = 0;
            cycleIndex += 1;
            if (!loop)
                return;
        }
        // Absolute offset from the shared origin — drift cannot accumulate (R4),
        // and cycle n begins at exactly t0 + n * cycle (R8).
        const nextAt = t0 + cycleIndex * cycle + t.steps[stepIndex].at;
        state.timer = setTimeout(fire, Math.max(0, nextAt - Date.now()));
    };
    state.timer = setTimeout(fire, Math.max(0, t0 - Date.now()));
    return state;
}
/**
 * Play a family on up to three channels from ONE clock. Returns a handle;
 * call stop() on acknowledgment — repetition until acknowledgment is the
 * standard's rule, so `loop` defaults to true.
 *
 *   const alert = startAlert("FIRE", {
 *     severity: "Extreme",
 *     onFlash: (on) => el.classList.toggle("lit", on),
 *     tone: true,
 *   });
 *   button.onclick = () => alert.stop(); // I UNDERSTAND
 */
export function startAlert(name, options = {}) {
    const level = channelLevel(name, options.severity ?? "Extreme");
    const loop = options.loop !== false;
    const t0 = Date.now();
    const pattern = vibratePattern(name);
    const canVibrate = options.vibrate !== false &&
        typeof navigator !== "undefined" &&
        typeof navigator.vibrate === "function";
    // TONE: one oscillator, gain gated on the envelope at the flat level.
    let audio = null;
    if (options.tone && typeof AudioContext !== "undefined") {
        const ctx = options.audioContext ?? new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = options.frequency ?? 520;
        gain.gain.value = 0;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        audio = { ctx, gain, owned: !options.audioContext };
    }
    const scheduled = scheduleTimeline(name, t0, loop, (on) => {
        options.onFlash?.(on, level);
        if (audio)
            audio.gain.gain.value = on ? level : 0;
    }, () => {
        // The Vibration API takes the whole cycle in one call; re-issue it at
        // each cycle start so the hand stays on the shared clock.
        if (canVibrate && pattern.length > 0)
            navigator.vibrate(pattern);
    });
    let stopped = false;
    return {
        family: name,
        level,
        t0,
        stop() {
            if (stopped)
                return;
            stopped = true;
            if (scheduled.timer)
                clearTimeout(scheduled.timer);
            if (canVibrate)
                navigator.vibrate(0);
            options.onFlash?.(false, level);
            if (audio) {
                audio.gain.gain.value = 0;
                if (audio.owned)
                    void audio.ctx.close();
            }
        },
    };
}
