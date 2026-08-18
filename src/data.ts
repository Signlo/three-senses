// GENERATED FILE — do not edit. Run `npm run embed` to regenerate from
// vocabulary.json and conformance/vectors.json, the normative artifacts.
export const VOCABULARY_DATA = {
  "standard": "Three Senses Alerting Standard",
  "version": "0.8.0",
  "publisher": "International Deaf Emergency (ideafe.org)",
  "published": "2026-08-17",
  "license": "Apache-2.0",
  "units": "milliseconds",
  "principles": {
    "envelopeIsTheRhythm": "Every channel (touch, light, tone) renders the identical envelope. What the hand feels, the eye sees and the ear hears.",
    "severityIsIntensity": "Severity never changes a rhythm. Touch grades it in four distinct strengths so DeafBlind users read the level by hand; marks and color count the step for the eye; light and sound deliver at full power from DANGER COMING upward, because they exist to reach.",
    "allClearIsSilence": "The all-clear plays nothing on any channel. A quiet device means safe.",
    "mimetic": "Every rhythm is the hazard's own temporal signature, converging with the iconicity of sign languages. Future patterns MUST be mimetic.",
    "photosensitivity": "Light renderers never exceed 3 flashes per second (WCAG 2.3.1) or 6 state transitions per second, and MUST offer a steady-light path for users who identify as photosensitive.",
    "repetition": "Urgent alerts repeat the full pattern back to back, with no pause, until the person acknowledges.",
    "fallback": "A device that cannot render a pattern falls back to its platform's common cadence, never to silence.",
    "loopSeamlessness": "Urgent alerts repeat with no pause, so every family except GROUND ends in a trailing quiet, part of the pattern and counted in its total, sized so the looped stream keeps the family's cadence exactly. A repeat begins at t0 + total; pulses never fuse across the loop boundary. GROUND is the deliberate exception: looped, it fuses into one continuous unbroken hold, which is its mimesis."
  },
  "families": {
    "GROUND": {
      "meaning": "earthquake, landslide",
      "mimesis": "The ground does not pause: one long unbroken hold, like the sustained-shaking signs for earthquake. Looped, it fuses into one continuous shake. Nothing else is unbroken.",
      "edge": "hard",
      "pulses": [
        [
          4000,
          0
        ]
      ]
    },
    "WATER": {
      "meaning": "flood, tsunami, storm surge",
      "mimesis": "Waves keep coming: long soft rolls, a breath apart, like the rolling hand motion of the signs for waves. The cadence is steady under looping.",
      "edge": "soft",
      "pulses": [
        [
          2000,
          1000
        ],
        [
          2000,
          1000
        ]
      ]
    },
    "STORM": {
      "meaning": "cyclone, typhoon, tornado, severe storm",
      "mimesis": "Wind arrives in gusts that slam: a sharp knock every one and a half seconds, steady under looping.",
      "edge": "hard",
      "pulses": [
        [
          500,
          1000
        ],
        [
          500,
          1000
        ],
        [
          500,
          1000
        ]
      ]
    },
    "FIRE": {
      "meaning": "fire, wildfire",
      "mimesis": "Flames flicker fast: ten rapid pulses, like the fingers of the sign for fire flickering upward. Nothing else is this fast. 2.5 flashes per second, inside the 3 per second bound, and the flicker stays exactly 2.5 per second across the loop boundary.",
      "edge": "hard",
      "pulses": [
        [
          200,
          200
        ],
        [
          200,
          200
        ],
        [
          200,
          200
        ],
        [
          200,
          200
        ],
        [
          200,
          200
        ],
        [
          200,
          200
        ],
        [
          200,
          200
        ],
        [
          200,
          200
        ],
        [
          200,
          200
        ],
        [
          200,
          200
        ]
      ]
    },
    "THREAT": {
      "meaning": "danger from people (attack, active threat, missing child)",
      "mimesis": "A human threat announces itself: one hard knock at the door, one long push, five rapid fires, then a full stop. The stop is long enough that the next knock lands out of real silence. A sequence nothing natural makes.",
      "edge": "soft",
      "pulseEdgeOverrides": {
        "0": "hard"
      },
      "pulses": [
        [
          500,
          500
        ],
        [
          2000,
          500
        ],
        [
          200,
          200
        ],
        [
          200,
          200
        ],
        [
          200,
          200
        ],
        [
          200,
          200
        ],
        [
          200,
          1000
        ]
      ]
    },
    "TEST": {
      "meaning": "test or drill, never a real emergency",
      "mimesis": "A quick gentle double tap, a long quiet, then the double tap again: checking, not warning. A drill must never feel like an emergency.",
      "edge": "soft",
      "fixedLevel": 0.3,
      "pulses": [
        [
          200,
          200
        ],
        [
          200,
          3500
        ],
        [
          200,
          200
        ],
        [
          200,
          3500
        ]
      ]
    },
    "OTHER": {
      "meaning": "any hazard outside the named families (health, chemical, infrastructure)",
      "mimesis": "Three steady calls, evenly spaced, then a clean breath: attention without imitation, reserved for what has no shape of its own.",
      "edge": "hard",
      "pulses": [
        [
          1000,
          2000
        ],
        [
          1000,
          2000
        ],
        [
          1000,
          2000
        ]
      ]
    },
    "ALL_CLEAR": {
      "meaning": "the danger has ended (an affirmative, authenticated update)",
      "mimesis": "The release: one long soft press easing away, a real breath, a short settling press. Like a breath out, easing pressure meaning done (protactile-native). A hypothesis under human testing, like all mimesis claims.",
      "pulses": [
        [
          1200,
          800
        ],
        [
          400,
          0
        ]
      ],
      "edge": "soft",
      "fixedLevel": 0.25,
      "presentation": "once",
      "rule": "Self-terminating and never escalating: the release is presented at most three times (at 0, 45 and 120 seconds), never louder, and any user interaction cancels the rest; danger insists until acknowledged, safety lets go on its own. Inside each press the intensity FALLS (25 to 15 percent; two steps where hardware cannot ramp; floor 15 percent, below which bed shakers and bedding-damped actuators go dead). The cue accompanies, never replaces, the affirmative words naming what ended. The absence of an alert is never evidence of safety.",
      "character": {
        "principle": "Identity lives in the timing alone and must be decodable on a pitchless piezo. Spectral and intensity character is channel-idiomatic, encodes valence (falling means over), never identity, and may never add onsets.",
        "touch": "Intensity falls inside each press, 25 to 15 percent (two steps where no ramp; floor 15). On-body replay: if the device detects wrist-don, wake, or unlock within 10 minutes of an undelivered release, replay once.",
        "light": "A ramped swell (about 300 ms ease-in, 400 ms ease-out), never a square flash. AFTERGLOW: after the cue, light holds steady calm green at the same gentle level for 10 minutes, then fades over a minute; a held state is not repetition. Phone: the calm wash holds until dismissed. Building: the beacons that strobed hold steady green, and room lighting returns to full.",
        "sound": "A falling chime, not the alert voice: the long press glides about 880 to 660 Hz, the settle rests at 440 Hz, intensity decaying inside each unit; never the flat alert carrier. Phones: the cue once, then speech (for example FLOOD WARNING ENDED) starting about 1.5 s after, never overlapping. Voice-capable building systems: cue then spoken all-clear, at most three times at 60 s spacing. Tone-only outdoor sirens MUST NOT sound the release at all: a siren speaking means danger; route the all-clear to other channels."
      }
    }
  },
  "severity": {
    "ladder": [
      "SAFE NOW (all clear)",
      "BE CAREFUL (Minor/Unknown)",
      "DANGER COMING (Moderate/Amber)",
      "ACT NOW (Severe/Extreme/Presidential)"
    ],
    "touchLevels": {
      "allClear": 0.25,
      "Minor": 0.25,
      "Unknown": 0.25,
      "Moderate": 0.5,
      "Amber": 0.5,
      "Severe": 0.75,
      "Extreme": 1,
      "Presidential": 1
    },
    "reachLevels": {
      "allClear": 0.25,
      "Minor": 0.25,
      "Unknown": 0.25,
      "Moderate": 1,
      "Amber": 1,
      "Severe": 1,
      "Extreme": 1,
      "Presidential": 1
    },
    "marks": {
      "allClear": 0,
      "Minor": 1,
      "Unknown": 1,
      "Moderate": 2,
      "Amber": 2,
      "Severe": 3,
      "Extreme": 3,
      "Presidential": 3
    },
    "rule": "Touch grades severity in four distinct strengths (25, 50, 75, 100 percent), so a DeafBlind user reads the level by touch alone. Light and sound exist to reach: from DANGER COMING (Moderate) upward they deliver at full power, and only BE CAREFUL stays gentle. The filled-mark count (one to three) and the color say the same thing for the eye; color never carries severity alone. The rhythm never changes."
  },
  "lightBounds": {
    "maxFlashesPerSecond": 3,
    "maxTransitionsPerSecond": 6
  },
  "rules": {
    "longUnitExclusive": "No pattern other than GROUND and ALL_CLEAR may contain a unit of 1000 ms or longer, and no future pattern may gain one: the release's long-then-short skeleton stays truncation-proof."
  }
} as const;

export const VECTORS_DATA = {
  "standardVersion": "0.8.0",
  "description": "Machine-checkable conformance vectors. A conformant renderer executes exactly these on/off events, at these offsets from a single shared clock (t0), on every channel it renders. Tolerance: an event may fire late by scheduling jitter but its SCHEDULED time must equal the vector; a renderer must never reorder, merge, or drop events, and a late start must join mid-pattern in phase at t0 + offset, not shifted.",
  "requirements": [
    "R1 rhythm-identity: for each family, rendered on/off offsets equal the vector exactly.",
    "R2 severity-invariance: the vector is identical at every severity; only intensity changes.",
    "R3 all-clear-release: ALL_CLEAR renders its release cue self-terminating and never escalating (at most three presentations at 0, 45 and 120 seconds, never louder, canceled by any interaction; never repeat-until-acknowledged), at its fixed gentle level with falling intensity, alongside affirmative words naming what ended; tone-only sirens never sound it; silence alone is never presented as an all-clear.",
    "R4 one-clock: all channels schedule from one shared t0; a late channel joins in phase.",
    "R5 photosensitivity: no light renderer exceeds 3 flashes/second or 6 transitions/second, and a steady-light path exists.",
    "R6 test-gentleness: the TEST family never exceeds intensity level 0.3 on any channel at any severity.",
    "R7 no-dialects: implementations must not add, remove, or alter family patterns and still claim conformance.",
    "R8 loop-seamlessness: totalMs includes the family's trailing quiet and is normative; a repeating renderer schedules the next cycle's first event at exactly t0 + totalMs, never earlier, so pulses never fuse across the loop boundary."
  ],
  "vectors": {
    "GROUND": {
      "steps": [
        {
          "at": 0,
          "event": "on"
        },
        {
          "at": 4000,
          "event": "off"
        }
      ],
      "totalMs": 4000
    },
    "WATER": {
      "steps": [
        {
          "at": 0,
          "event": "on"
        },
        {
          "at": 2000,
          "event": "off"
        },
        {
          "at": 3000,
          "event": "on"
        },
        {
          "at": 5000,
          "event": "off"
        }
      ],
      "totalMs": 6000
    },
    "STORM": {
      "steps": [
        {
          "at": 0,
          "event": "on"
        },
        {
          "at": 500,
          "event": "off"
        },
        {
          "at": 1500,
          "event": "on"
        },
        {
          "at": 2000,
          "event": "off"
        },
        {
          "at": 3000,
          "event": "on"
        },
        {
          "at": 3500,
          "event": "off"
        }
      ],
      "totalMs": 4500
    },
    "FIRE": {
      "steps": [
        {
          "at": 0,
          "event": "on"
        },
        {
          "at": 200,
          "event": "off"
        },
        {
          "at": 400,
          "event": "on"
        },
        {
          "at": 600,
          "event": "off"
        },
        {
          "at": 800,
          "event": "on"
        },
        {
          "at": 1000,
          "event": "off"
        },
        {
          "at": 1200,
          "event": "on"
        },
        {
          "at": 1400,
          "event": "off"
        },
        {
          "at": 1600,
          "event": "on"
        },
        {
          "at": 1800,
          "event": "off"
        },
        {
          "at": 2000,
          "event": "on"
        },
        {
          "at": 2200,
          "event": "off"
        },
        {
          "at": 2400,
          "event": "on"
        },
        {
          "at": 2600,
          "event": "off"
        },
        {
          "at": 2800,
          "event": "on"
        },
        {
          "at": 3000,
          "event": "off"
        },
        {
          "at": 3200,
          "event": "on"
        },
        {
          "at": 3400,
          "event": "off"
        },
        {
          "at": 3600,
          "event": "on"
        },
        {
          "at": 3800,
          "event": "off"
        }
      ],
      "totalMs": 4000
    },
    "THREAT": {
      "steps": [
        {
          "at": 0,
          "event": "on"
        },
        {
          "at": 500,
          "event": "off"
        },
        {
          "at": 1000,
          "event": "on"
        },
        {
          "at": 3000,
          "event": "off"
        },
        {
          "at": 3500,
          "event": "on"
        },
        {
          "at": 3700,
          "event": "off"
        },
        {
          "at": 3900,
          "event": "on"
        },
        {
          "at": 4100,
          "event": "off"
        },
        {
          "at": 4300,
          "event": "on"
        },
        {
          "at": 4500,
          "event": "off"
        },
        {
          "at": 4700,
          "event": "on"
        },
        {
          "at": 4900,
          "event": "off"
        },
        {
          "at": 5100,
          "event": "on"
        },
        {
          "at": 5300,
          "event": "off"
        }
      ],
      "totalMs": 6300
    },
    "TEST": {
      "steps": [
        {
          "at": 0,
          "event": "on"
        },
        {
          "at": 200,
          "event": "off"
        },
        {
          "at": 400,
          "event": "on"
        },
        {
          "at": 600,
          "event": "off"
        },
        {
          "at": 4100,
          "event": "on"
        },
        {
          "at": 4300,
          "event": "off"
        },
        {
          "at": 4500,
          "event": "on"
        },
        {
          "at": 4700,
          "event": "off"
        }
      ],
      "totalMs": 8200
    },
    "OTHER": {
      "steps": [
        {
          "at": 0,
          "event": "on"
        },
        {
          "at": 1000,
          "event": "off"
        },
        {
          "at": 3000,
          "event": "on"
        },
        {
          "at": 4000,
          "event": "off"
        },
        {
          "at": 6000,
          "event": "on"
        },
        {
          "at": 7000,
          "event": "off"
        }
      ],
      "totalMs": 9000
    },
    "ALL_CLEAR": {
      "steps": [
        {
          "at": 0,
          "event": "on"
        },
        {
          "at": 1200,
          "event": "off"
        },
        {
          "at": 2000,
          "event": "on"
        },
        {
          "at": 2400,
          "event": "off"
        }
      ],
      "totalMs": 2400
    }
  }
} as const;
