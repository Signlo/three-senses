export declare const VOCABULARY_DATA: {
    readonly standard: "Three Senses Alerting Standard";
    readonly version: "0.6.0";
    readonly publisher: "International Deaf Emergency (ideafe.org)";
    readonly published: "2026-08-17";
    readonly license: "Apache-2.0";
    readonly units: "milliseconds";
    readonly principles: {
        readonly envelopeIsTheRhythm: "Every channel (touch, light, tone) renders the identical envelope. What the hand feels, the eye sees and the ear hears.";
        readonly severityIsIntensity: "Severity never changes a rhythm. Touch grades it in four distinct strengths so DeafBlind users read the level by hand; marks and color count the step for the eye; light and sound deliver at full power from DANGER COMING upward, because they exist to reach.";
        readonly allClearIsSilence: "The all-clear plays nothing on any channel. A quiet device means safe.";
        readonly mimetic: "Every rhythm is the hazard's own temporal signature, converging with the iconicity of sign languages. Future patterns MUST be mimetic.";
        readonly photosensitivity: "Light renderers never exceed 3 flashes per second (WCAG 2.3.1) or 6 state transitions per second, and MUST offer a steady-light path for users who identify as photosensitive.";
        readonly repetition: "Urgent alerts repeat the full pattern back to back, with no pause, until the person acknowledges.";
        readonly fallback: "A device that cannot render a pattern falls back to its platform's common cadence, never to silence.";
        readonly loopSeamlessness: "Urgent alerts repeat with no pause, so every family except GROUND ends in a trailing quiet, part of the pattern and counted in its total, sized so the looped stream keeps the family's cadence exactly. A repeat begins at t0 + total; pulses never fuse across the loop boundary. GROUND is the deliberate exception: looped, it fuses into one continuous unbroken hold, which is its mimesis.";
    };
    readonly families: {
        readonly GROUND: {
            readonly meaning: "earthquake, landslide";
            readonly mimesis: "The ground does not pause: one long unbroken hold, like the sustained-shaking signs for earthquake. Looped, it fuses into one continuous shake. Nothing else is unbroken.";
            readonly edge: "hard";
            readonly pulses: readonly [readonly [4000, 0]];
        };
        readonly WATER: {
            readonly meaning: "flood, tsunami, storm surge";
            readonly mimesis: "Waves keep coming: long soft rolls, a breath apart, like the rolling hand motion of the signs for waves. The cadence is steady under looping.";
            readonly edge: "soft";
            readonly pulses: readonly [readonly [2000, 1000], readonly [2000, 1000]];
        };
        readonly STORM: {
            readonly meaning: "cyclone, typhoon, tornado, severe storm";
            readonly mimesis: "Wind arrives in gusts that slam: a sharp knock every one and a half seconds, steady under looping.";
            readonly edge: "hard";
            readonly pulses: readonly [readonly [500, 1000], readonly [500, 1000], readonly [500, 1000]];
        };
        readonly FIRE: {
            readonly meaning: "fire, wildfire";
            readonly mimesis: "Flames flicker fast: ten rapid pulses, like the fingers of the sign for fire flickering upward. Nothing else is this fast. 2.5 flashes per second, inside the 3 per second bound, and the flicker stays exactly 2.5 per second across the loop boundary.";
            readonly edge: "hard";
            readonly pulses: readonly [readonly [200, 200], readonly [200, 200], readonly [200, 200], readonly [200, 200], readonly [200, 200], readonly [200, 200], readonly [200, 200], readonly [200, 200], readonly [200, 200], readonly [200, 200]];
        };
        readonly THREAT: {
            readonly meaning: "danger from people (attack, active threat, missing child)";
            readonly mimesis: "A human threat announces itself: one hard knock at the door, one long push, five rapid fires, then a full stop. The stop is long enough that the next knock lands out of real silence. A sequence nothing natural makes.";
            readonly edge: "soft";
            readonly pulseEdgeOverrides: {
                readonly "0": "hard";
            };
            readonly pulses: readonly [readonly [500, 500], readonly [2000, 500], readonly [200, 200], readonly [200, 200], readonly [200, 200], readonly [200, 200], readonly [200, 1000]];
        };
        readonly TEST: {
            readonly meaning: "test or drill, never a real emergency";
            readonly mimesis: "A quick gentle double tap, a long quiet, then the double tap again: checking, not warning. A drill must never feel like an emergency.";
            readonly edge: "soft";
            readonly fixedLevel: 0.3;
            readonly pulses: readonly [readonly [200, 200], readonly [200, 3500], readonly [200, 200], readonly [200, 3500]];
        };
        readonly OTHER: {
            readonly meaning: "any hazard outside the named families (health, chemical, infrastructure)";
            readonly mimesis: "Three steady calls, evenly spaced, then a clean breath: attention without imitation, reserved for what has no shape of its own.";
            readonly edge: "hard";
            readonly pulses: readonly [readonly [1000, 2000], readonly [1000, 2000], readonly [1000, 2000]];
        };
        readonly ALL_CLEAR: {
            readonly meaning: "the danger has ended (an affirmative, authenticated update)";
            readonly mimesis: "Calm. An affirmative message that names what ended, presented without any alarm rhythm. The absence of an alert is never evidence of safety.";
            readonly pulses: readonly [];
        };
    };
    readonly severity: {
        readonly ladder: readonly ["SAFE NOW (all clear)", "BE CAREFUL (Minor/Unknown)", "DANGER COMING (Moderate/Amber)", "ACT NOW (Severe/Extreme/Presidential)"];
        readonly touchLevels: {
            readonly allClear: 0;
            readonly Minor: 0.25;
            readonly Unknown: 0.25;
            readonly Moderate: 0.5;
            readonly Amber: 0.5;
            readonly Severe: 0.75;
            readonly Extreme: 1;
            readonly Presidential: 1;
        };
        readonly reachLevels: {
            readonly allClear: 0;
            readonly Minor: 0.25;
            readonly Unknown: 0.25;
            readonly Moderate: 1;
            readonly Amber: 1;
            readonly Severe: 1;
            readonly Extreme: 1;
            readonly Presidential: 1;
        };
        readonly marks: {
            readonly allClear: 0;
            readonly Minor: 1;
            readonly Unknown: 1;
            readonly Moderate: 2;
            readonly Amber: 2;
            readonly Severe: 3;
            readonly Extreme: 3;
            readonly Presidential: 3;
        };
        readonly rule: "Touch grades severity in four distinct strengths (25, 50, 75, 100 percent), so a DeafBlind user reads the level by touch alone. Light and sound exist to reach: from DANGER COMING (Moderate) upward they deliver at full power, and only BE CAREFUL stays gentle. The filled-mark count (one to three) and the color say the same thing for the eye; color never carries severity alone. The rhythm never changes.";
    };
    readonly lightBounds: {
        readonly maxFlashesPerSecond: 3;
        readonly maxTransitionsPerSecond: 6;
    };
};
export declare const VECTORS_DATA: {
    readonly standardVersion: "0.4.0";
    readonly description: "Machine-checkable conformance vectors. A conformant renderer executes exactly these on/off events, at these offsets from a single shared clock (t0), on every channel it renders. Tolerance: an event may fire late by scheduling jitter but its SCHEDULED time must equal the vector; a renderer must never reorder, merge, or drop events, and a late start must join mid-pattern in phase at t0 + offset, not shifted.";
    readonly requirements: readonly ["R1 rhythm-identity: for each family, rendered on/off offsets equal the vector exactly.", "R2 severity-invariance: the vector is identical at every severity; only intensity changes.", "R3 all-clear-silence: ALL_CLEAR renders zero events on every channel.", "R4 one-clock: all channels schedule from one shared t0; a late channel joins in phase.", "R5 photosensitivity: no light renderer exceeds 3 flashes/second or 6 transitions/second, and a steady-light path exists.", "R6 test-gentleness: the TEST family never exceeds intensity level 0.3 on any channel at any severity.", "R7 no-dialects: implementations must not add, remove, or alter family patterns and still claim conformance.", "R8 loop-seamlessness: totalMs includes the family's trailing quiet and is normative; a repeating renderer schedules the next cycle's first event at exactly t0 + totalMs, never earlier, so pulses never fuse across the loop boundary."];
    readonly vectors: {
        readonly GROUND: {
            readonly steps: readonly [{
                readonly at: 0;
                readonly event: "on";
            }, {
                readonly at: 4000;
                readonly event: "off";
            }];
            readonly totalMs: 4000;
        };
        readonly WATER: {
            readonly steps: readonly [{
                readonly at: 0;
                readonly event: "on";
            }, {
                readonly at: 2000;
                readonly event: "off";
            }, {
                readonly at: 3000;
                readonly event: "on";
            }, {
                readonly at: 5000;
                readonly event: "off";
            }];
            readonly totalMs: 6000;
        };
        readonly STORM: {
            readonly steps: readonly [{
                readonly at: 0;
                readonly event: "on";
            }, {
                readonly at: 500;
                readonly event: "off";
            }, {
                readonly at: 1500;
                readonly event: "on";
            }, {
                readonly at: 2000;
                readonly event: "off";
            }, {
                readonly at: 3000;
                readonly event: "on";
            }, {
                readonly at: 3500;
                readonly event: "off";
            }];
            readonly totalMs: 4500;
        };
        readonly FIRE: {
            readonly steps: readonly [{
                readonly at: 0;
                readonly event: "on";
            }, {
                readonly at: 200;
                readonly event: "off";
            }, {
                readonly at: 400;
                readonly event: "on";
            }, {
                readonly at: 600;
                readonly event: "off";
            }, {
                readonly at: 800;
                readonly event: "on";
            }, {
                readonly at: 1000;
                readonly event: "off";
            }, {
                readonly at: 1200;
                readonly event: "on";
            }, {
                readonly at: 1400;
                readonly event: "off";
            }, {
                readonly at: 1600;
                readonly event: "on";
            }, {
                readonly at: 1800;
                readonly event: "off";
            }, {
                readonly at: 2000;
                readonly event: "on";
            }, {
                readonly at: 2200;
                readonly event: "off";
            }, {
                readonly at: 2400;
                readonly event: "on";
            }, {
                readonly at: 2600;
                readonly event: "off";
            }, {
                readonly at: 2800;
                readonly event: "on";
            }, {
                readonly at: 3000;
                readonly event: "off";
            }, {
                readonly at: 3200;
                readonly event: "on";
            }, {
                readonly at: 3400;
                readonly event: "off";
            }, {
                readonly at: 3600;
                readonly event: "on";
            }, {
                readonly at: 3800;
                readonly event: "off";
            }];
            readonly totalMs: 4000;
        };
        readonly THREAT: {
            readonly steps: readonly [{
                readonly at: 0;
                readonly event: "on";
            }, {
                readonly at: 500;
                readonly event: "off";
            }, {
                readonly at: 1000;
                readonly event: "on";
            }, {
                readonly at: 3000;
                readonly event: "off";
            }, {
                readonly at: 3500;
                readonly event: "on";
            }, {
                readonly at: 3700;
                readonly event: "off";
            }, {
                readonly at: 3900;
                readonly event: "on";
            }, {
                readonly at: 4100;
                readonly event: "off";
            }, {
                readonly at: 4300;
                readonly event: "on";
            }, {
                readonly at: 4500;
                readonly event: "off";
            }, {
                readonly at: 4700;
                readonly event: "on";
            }, {
                readonly at: 4900;
                readonly event: "off";
            }, {
                readonly at: 5100;
                readonly event: "on";
            }, {
                readonly at: 5300;
                readonly event: "off";
            }];
            readonly totalMs: 6300;
        };
        readonly TEST: {
            readonly steps: readonly [{
                readonly at: 0;
                readonly event: "on";
            }, {
                readonly at: 200;
                readonly event: "off";
            }, {
                readonly at: 400;
                readonly event: "on";
            }, {
                readonly at: 600;
                readonly event: "off";
            }, {
                readonly at: 4100;
                readonly event: "on";
            }, {
                readonly at: 4300;
                readonly event: "off";
            }, {
                readonly at: 4500;
                readonly event: "on";
            }, {
                readonly at: 4700;
                readonly event: "off";
            }];
            readonly totalMs: 8200;
        };
        readonly OTHER: {
            readonly steps: readonly [{
                readonly at: 0;
                readonly event: "on";
            }, {
                readonly at: 1000;
                readonly event: "off";
            }, {
                readonly at: 3000;
                readonly event: "on";
            }, {
                readonly at: 4000;
                readonly event: "off";
            }, {
                readonly at: 6000;
                readonly event: "on";
            }, {
                readonly at: 7000;
                readonly event: "off";
            }];
            readonly totalMs: 9000;
        };
        readonly ALL_CLEAR: {
            readonly steps: readonly [];
            readonly totalMs: 0;
        };
    };
};
