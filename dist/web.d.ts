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
import { type FamilyName, type SeverityName } from "./index.js";
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
export declare function startAlert(name: FamilyName, options?: StartOptions): AlertHandle;
