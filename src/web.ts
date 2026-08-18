/**
 * Browser renderers for the Three Senses vocabulary.
 *
 * Design: the SDK owns the CLOCK and the RHYTHM; you own the surface. Every
 * renderer schedules against one absolute origin (spec: one clock, R4) with
 * drift correction — never `setTimeout(previousGap)` chains — and repeats at
 * exactly `cycleStart(t0, n)` so pulses never fuse across the loop boundary
 * (R8). Severity arrives only as the one flat level (R2), already capped for
 * TEST (R6). ALL_CLEAR plays its release cue exactly once and never loops,
 * whatever `loop` says (R3): repetition is reserved for danger.
 */
import {
  type FamilyName,
  type SeverityName,
  family,
  timeline,
  cycleMs,
  channelLevel,
  lightSoundLevel,
  vibratePattern,
} from "./index.js";

export interface StartOptions {
  /** Severity name or 0..1 level. Default "Extreme". Sets intensity only. */
  severity?: SeverityName | number;
  /** Repeat until stop() (default true). One cycle only when false. */
  loop?: boolean;
  /**
   * LIGHT surface: called with `true` on every on-edge and `false` on every
   * off-edge, plus the flat level — wire it to a DOM element, a torch, a
   * smart bulb, anything. Photosensitivity note: the vocabulary is inside
   * WCAG 2.3.1 bounds by construction, but a steady-light path for users who
   * identify as photosensitive is YOUR obligation as the implementer.
   */
  onFlash?: (on: boolean, level: number) => void;
  /** TOUCH surface: use the Vibration API when available (default true). */
  vibrate?: boolean;
  /** SOUND surface: a 520 Hz tone gated on the envelope (default false). */
  tone?: boolean;
  /** Web Audio context to reuse; one is created (and closed) otherwise. */
  audioContext?: AudioContext;
  /** Tone frequency in Hz. */
  frequency?: number;
}

export interface AlertHandle {
  readonly family: FamilyName;
  /** The one flat level every channel is playing at. */
  readonly level: number;
  /** The shared t0 (ms epoch) every channel is scheduled against. */
  readonly t0: number;
  stop(): void;
}

interface Scheduled {
  timer: ReturnType<typeof setTimeout> | null;
}

function scheduleTimeline(
  name: FamilyName,
  t0: number,
  loop: boolean,
  onEdge: (on: boolean) => void,
  onCycleStart: (cycle: number) => void,
): Scheduled {
  const t = timeline(name);
  const cycle = cycleMs(name);
  const state: Scheduled = { timer: null };
  if (t.steps.length === 0) return state; // ALL_CLEAR: silence (R3)

  let cycleIndex = 0;
  let stepIndex = 0;
  const fire = (): void => {
    if (stepIndex === 0) onCycleStart(cycleIndex);
    const step = t.steps[stepIndex];
    onEdge(step.event === "on");
    stepIndex += 1;
    if (stepIndex >= t.steps.length) {
      stepIndex = 0;
      cycleIndex += 1;
      if (!loop) return;
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
export function startAlert(name: FamilyName, options: StartOptions = {}): AlertHandle {
  // Light and sound render at the REACH level (full from DANGER COMING up);
  // the Vibration API is binary, so the touch grading lives on real haptic
  // hardware via the vocabulary's touchLevels.
  const level = lightSoundLevel(name, options.severity ?? "Extreme");
  // R3: a play-once family never loops, whatever the caller asked for.
  const loop = options.loop !== false && family(name).presentation !== "once";
  const t0 = Date.now();
  const pattern = vibratePattern(name);
  const canVibrate =
    options.vibrate !== false &&
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function";

  // TONE: one oscillator, gain gated on the envelope at the flat level.
  let audio: { ctx: AudioContext; gain: GainNode; owned: boolean } | null = null;
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

  const scheduled = scheduleTimeline(
    name,
    t0,
    loop,
    (on) => {
      options.onFlash?.(on, level);
      if (audio) audio.gain.gain.value = on ? level : 0;
    },
    () => {
      // The Vibration API takes the whole cycle in one call; re-issue it at
      // each cycle start so the hand stays on the shared clock.
      if (canVibrate && pattern.length > 0) navigator.vibrate(pattern);
    },
  );

  let stopped = false;
  return {
    family: name,
    level,
    t0,
    stop() {
      if (stopped) return;
      stopped = true;
      if (scheduled.timer) clearTimeout(scheduled.timer);
      if (canVibrate) navigator.vibrate(0);
      options.onFlash?.(false, level);
      if (audio) {
        audio.gain.gain.value = 0;
        if (audio.owned) void audio.ctx.close();
      }
    },
  };
}
