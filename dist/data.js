// GENERATED FILE — do not edit. Run `npm run embed` to regenerate from
// vocabulary.json, conformance/vectors.json, and wea-asl-templates.json, the
// normative artifacts.
export const VOCABULARY_DATA = {
    "standard": "Three Senses Alerting Standard",
    "version": "0.10.0",
    "publisher": "International Deaf Emergency (ideafe.org)",
    "published": "2026-08-17",
    "license": "Apache-2.0",
    "units": "milliseconds",
    "principles": {
        "envelopeIsTheRhythm": "Every channel (touch, light, tone) renders the identical envelope. What the hand feels, the eye sees and the ear hears.",
        "severityIsIntensity": "Severity never changes a rhythm. Where the device has validated amplitude control, touch grades the level in four distinct strengths so DeafBlind users read it by hand; marks and color count the step for the eye; light and sound deliver at full power from DANGER COMING upward, because they exist to reach. A device without amplitude control renders the rhythm unchanged and lets marks, color and words carry the level.",
        "unknownPresumedDangerous": "A warning whose severity cannot be read is presumed dangerous: Unknown is stated as unknown in language and presented at Severe-equivalent intensity, never gentle.",
        "allClearIsAffirmativeRelease": "The all-clear is an affirmative, authenticated message naming what ended, presented calmly with the gentle self-terminating release cue. The absence of an alert is never evidence of safety: silence can equally mean a dead battery, no coverage, or a failed device.",
        "mimetic": "WATER, GROUND, STORM and FIRE are drawn from the hazard's own temporal signature, converging with the iconicity of sign languages; THREAT, TEST and OTHER are deliberately abstract. Mimesis is a design hypothesis under human testing. Future patterns MUST differ from every existing pattern on at least two axes and SHOULD be mimetic where the hazard offers a signature.",
        "photosensitivity": "Light renderers never exceed 3 flashes per second or 6 state transitions per second (bounds drawn from WCAG 2.3.1, whose full thresholds also cover area, luminance and red flash), and MUST offer a steady-light path for users who identify as photosensitive.",
        "repetition": "Urgent alerts repeat the full pattern back to back for a bounded, human-factors-validated interval or until acknowledged, whichever comes first, subject to alert-originator suppression instructions, the user's accessibility settings and device safety limits; the alert then persists as an accessible status with periodic reminders at validated intervals. Presentation is never indefinite. The all-clear release is the inverse carrier: it self-terminates on its own.",
        "fallback": "A device that cannot render a pattern falls back to its platform's common cadence, never to silence, except where the alert originator has validly suppressed that modality.",
        "loopSeamlessness": "Within the bounded presentation window, repeats begin at t0 plus the pattern's total; every family except GROUND ends in a trailing quiet sized so the looped stream keeps the family's cadence exactly, and pulses never fuse across the loop boundary. GROUND is the deliberate exception: within its window it fuses into one continuous hold, which is its mimesis; the window's bound is what keeps that hold finite."
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
            "Unknown": 0.75,
            "Moderate": 0.5,
            "Amber": 0.5,
            "Severe": 0.75,
            "Extreme": 1,
            "Presidential": 1
        },
        "reachLevels": {
            "allClear": 0.25,
            "Minor": 0.25,
            "Unknown": 1,
            "Moderate": 1,
            "Amber": 1,
            "Severe": 1,
            "Extreme": 1,
            "Presidential": 1
        },
        "marks": {
            "allClear": 0,
            "Minor": 1,
            "Unknown": 3,
            "Moderate": 2,
            "Amber": 2,
            "Severe": 3,
            "Extreme": 3,
            "Presidential": 3
        },
        "rule": "Touch grades severity in four distinct strengths (25, 50, 75, 100 percent), so a DeafBlind user reads the level by touch alone. Light and sound exist to reach: from DANGER COMING (Moderate) upward they deliver at full power, and only BE CAREFUL stays gentle. The filled-mark count (one to three) and the color say the same thing for the eye; color never carries severity alone. The rhythm never changes. A warning whose severity cannot be read is presumed dangerous: Unknown is stated as unknown in language and presented at Severe-equivalent intensity."
    },
    "lightBounds": {
        "maxFlashesPerSecond": 3,
        "maxTransitionsPerSecond": 6
    },
    "rules": {
        "longUnitExclusive": "No pattern other than GROUND and ALL_CLEAR may contain a unit of 1000 ms or longer, and no future pattern may gain one: the release's long-then-short skeleton stays truncation-proof."
    }
};
export const VECTORS_DATA = {
    "standardVersion": "0.10.0",
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
};
export const WEA_ASL_DATA = {
    "name": "FCC WEA template and ASL video map",
    "version": "0.10.2",
    "publisher": "International Deaf Emergency (ideafe.org)",
    "license": "Apache-2.0",
    "compiled": "2026-08-25",
    "sources": {
        "templateTexts": "FCC DA 25-12, Appendix C (adopted English WEA template messages; United States government work). https://docs.fcc.gov/public/attachments/DA-25-12A1.pdf",
        "aslVideos": "The FCC's official American Sign Language WEA template videos, referenced by 47 CFR 10.480(f). Canonical page: https://www.fcc.gov/WirelessEmergencyAlert-Templates-ASL (18 templates; verified against the Internet Archive snapshot of 2026-01-19 AND the FCC's Multilingual WEA Guidance of 18 July 2025, whose 18 links these IDs are; every video title verified free of the '*DEMO ONLY*' prefix on the FCC YouTube channel, 2026-08-28). CORRECTION v0.10.1: versions <= 0.10.0 of this file erroneously carried IDs from the DEMO-ONLY Feb-2024 set hosted at fcc.gov/wireless-emergency-alert-templates-american-sign-language-asl, which the FCC forbids using for any purpose. Videos are CDI-signed and published on the FCC's YouTube channel.",
        "reuse": "The FCC's July 2025 originator guidance instructs alert originators to embed or link ASL video for alerts. Template texts and videos are U.S. government works; this file only maps them and adds Three Senses hazard-family categorization."
    },
    "honesty": {
        "producedBy": "The videos and texts are the FCC's, not IDE's. A template video explains what an alert TYPE means in ASL; it is never a translation of a specific message (agency, location, and time reach ASL users as text, 47 CFR 10.500(e)(3)).",
        "mismatch": "CORRECTED v0.10.2: no video/text mismatch exists in the OFFICIAL set — all 18 adopted Appendix C templates (including the Tornado Emergency and Flash Flood Emergency escalations) have dedicated official FCC ASL videos. The earlier claim that the two Emergencies lacked videos described the Feb-2024 DEMO-ONLY set and was false for the official assets. Evacuation Immediate and Shelter in Place existed only as demo videos (no adopted text, no official video) and are carried here as annotated stubs.",
        "deferredNoAsl": [
            "All-clear",
            "AMBER alert",
            "Extreme heat",
            "Severe cold",
            "Ice storm",
            "Severe winter weather"
        ],
        "deferredNote": "Message types the FCC expressly deferred with no template and no ASL (DA 25-12 para 6 n.32; generic evacuation and shelter-in-place template TEXTS were declined as too vague in para 11, yet their ASL videos exist)."
    },
    "families": {
        "note": "Three Senses hazard-family categorization per THE-STANDARD.md section 4. null = an action or infrastructure message whose family follows the causing hazard chosen by the originator; renderers treat null as OTHER.",
        "capCategoryNote": "capCategory is the conventional CAP category for the event (Met, Geo, Health, ...), used as the compose default when the originator sets none."
    },
    "templates": [
        {
            "id": "tornado-emergency",
            "name": "Tornado Emergency",
            "sameCodes": [
                "TOR"
            ],
            "variant": "escalation of Tornado Warning (damage-threat catastrophic)",
            "family": "STORM",
            "capCategory": "Met",
            "englishText": "[SENDING AGENCY]: A TORNADO EMERGENCY is in effect for [LOCATION] until [TIME]. Tornado spotted in this area. This is a life-threatening situation. Take shelter now in a basement or an interior room on the lowest floor of a sturdy building. If you are outdoors, in a mobile home, or in a vehicle, move to the closest sturdy shelter and protect yourself from flying objects. Check media. [URL]",
            "asl": {
                "youtubeId": "nJWws8aNQ4M",
                "url": "https://www.youtube.com/watch?v=nJWws8aNQ4M"
            }
        },
        {
            "id": "tornado-warning",
            "name": "Tornado Warning",
            "sameCodes": [
                "TOR"
            ],
            "family": "STORM",
            "capCategory": "Met",
            "englishText": "[SENDING AGENCY]: A TORNADO WARNING is in effect for [LOCATION] until [TIME]. Take shelter now in a basement or an interior room on the lowest floor of a sturdy building. If you are outdoors, in a mobile home, or in a vehicle, move to the closest sturdy shelter and protect yourself from flying objects. Check media. [URL]",
            "asl": {
                "youtubeId": "a59VLxN82uI",
                "url": "https://www.youtube.com/watch?v=a59VLxN82uI"
            }
        },
        {
            "id": "flash-flood-emergency",
            "name": "Flash Flood Emergency",
            "sameCodes": [
                "FFW"
            ],
            "variant": "escalation of Flash Flood Warning",
            "family": "WATER",
            "capCategory": "Met",
            "englishText": "[SENDING AGENCY]: A FLASH FLOOD EMERGENCY is in effect for [LOCATION] until [TIME]. This is an extremely dangerous and life-threatening situation. Do not attempt to travel unless you are fleeing an area that may flood or are under an evacuation order. [URL]",
            "asl": {
                "youtubeId": "bo8C8FgXjNQ",
                "url": "https://www.youtube.com/watch?v=bo8C8FgXjNQ"
            }
        },
        {
            "id": "flash-flood-warning",
            "name": "Flash Flood Warning",
            "sameCodes": [
                "FFW"
            ],
            "family": "WATER",
            "capCategory": "Met",
            "englishText": "[SENDING AGENCY]: A FLASH FLOOD WARNING is in effect for [LOCATION] until [TIME]. This is a dangerous and life-threatening situation. Do not attempt to travel unless you are fleeing an area that may flood or are under an evacuation order. [URL]",
            "asl": {
                "youtubeId": "di3jkZzPztc",
                "url": "https://www.youtube.com/watch?v=di3jkZzPztc"
            }
        },
        {
            "id": "severe-thunderstorm-warning",
            "name": "Severe Thunderstorm Warning",
            "sameCodes": [
                "SVR"
            ],
            "family": "STORM",
            "capCategory": "Met",
            "englishText": "[SENDING AGENCY]: A SEVERE THUNDERSTORM WARNING is in effect for [LOCATION] until [TIME] for DESTRUCTIVE 80 mile per hour winds. Take shelter inside a sturdy building, away from windows. Flying objects may be deadly to those outside a sturdy shelter. [URL]",
            "asl": {
                "youtubeId": "fZcVj_5ZrfQ",
                "url": "https://www.youtube.com/watch?v=fZcVj_5ZrfQ"
            }
        },
        {
            "id": "snow-squall-warning",
            "name": "Snow Squall Warning",
            "sameCodes": [
                "SQW"
            ],
            "family": "STORM",
            "capCategory": "Met",
            "englishText": "[SENDING AGENCY]: A SNOW SQUALL WARNING is in effect for [LOCATION] until [TIME]. Slow down or delay travel! Be ready for a sudden drop to near zero visibility and icy roads in heavy snow. [URL]",
            "asl": {
                "youtubeId": "Y9_m0LyJoHY",
                "url": "https://www.youtube.com/watch?v=Y9_m0LyJoHY"
            }
        },
        {
            "id": "dust-storm-warning",
            "name": "Dust Storm Warning",
            "sameCodes": [
                "DSW"
            ],
            "family": "STORM",
            "capCategory": "Met",
            "englishText": "[SENDING AGENCY]: A DUST STORM WARNING is in effect for [LOCATION] until [TIME]. Be ready for sudden drop to zero visibility. Pull Aside, Stay Alive! When visibility drops, pull far off the road and put your vehicle in park. Turn the lights off and keep your foot off the brake. Infants, the elderly, and those with trouble breathing urged to take precautions. [URL]",
            "asl": {
                "youtubeId": "K0JupcW1LSo",
                "url": "https://www.youtube.com/watch?v=K0JupcW1LSo"
            }
        },
        {
            "id": "hurricane-warning",
            "name": "Hurricane Warning",
            "sameCodes": [
                "HUW"
            ],
            "family": "STORM",
            "capCategory": "Met",
            "englishText": "[SENDING AGENCY]: A HURRICANE WARNING is in effect for [LOCATION] for dangerous and damaging winds until [TIME]. This warning is issued up to 36 hours before hazardous conditions begin. Take steps to protect life and property. Have food, water, cash, fuel, and medications for 3+ days. FOLLOW INSTRUCTIONS FROM LOCAL OFFICIALS. [URL]",
            "asl": {
                "youtubeId": "btF7iogteD8",
                "url": "https://www.youtube.com/watch?v=btF7iogteD8"
            }
        },
        {
            "id": "storm-surge-warning",
            "name": "Storm Surge Warning",
            "sameCodes": [
                "SSW"
            ],
            "family": "WATER",
            "capCategory": "Met",
            "englishText": "[SENDING AGENCY]: A STORM SURGE WARNING is in effect for [LOCATION] for the danger of life-threatening flooding until [TIME]. This warning is issued up to 36 hours before hazardous conditions begin. Take steps to protect life and property. Follow evacuation orders if given for this area to avoid drowning or being cut off from emergency services. [URL]",
            "asl": {
                "youtubeId": "RhyJrFzpP1Y",
                "url": "https://www.youtube.com/watch?v=RhyJrFzpP1Y"
            }
        },
        {
            "id": "extreme-wind-warning",
            "name": "Extreme Wind Warning",
            "sameCodes": [
                "EWW"
            ],
            "family": "STORM",
            "capCategory": "Met",
            "englishText": "[SENDING AGENCY]: An EXTREME WIND WARNING is in effect for [LOCATION] for the immediate danger of life-threatening winds until [TIME]. Take cover NOW in an interior room of a sturdy building, away from windows. Protect your head from flying objects. Do NOT go outside if the wind calms! Winds will quickly become dangerous again. [URL]",
            "asl": {
                "youtubeId": "IcCymJHZmlE",
                "url": "https://www.youtube.com/watch?v=IcCymJHZmlE"
            }
        },
        {
            "id": "test-alert",
            "name": "Test Alert",
            "sameCodes": [
                "NPT",
                "RWT",
                "RMT",
                "DMO"
            ],
            "family": "TEST",
            "capCategory": "Safety",
            "englishText": "THIS IS A TEST of the National Wireless Emergency Alert System sent by [SENDING AGENCY]. The purpose is to maintain and improve alert and warning capabilities at the federal, state, local, Tribal and territorial levels and to evaluate the nation's public alert and warning capabilities. No action is required by the public. [URL]",
            "asl": {
                "youtubeId": "UXCxRRlY_x8",
                "url": "https://www.youtube.com/watch?v=UXCxRRlY_x8"
            }
        },
        {
            "id": "tsunami-warning",
            "name": "Tsunami Warning",
            "sameCodes": [
                "TSW"
            ],
            "family": "WATER",
            "capCategory": "Geo",
            "englishText": "[SENDING AGENCY]: A TSUNAMI WARNING is in effect for [LOCATION] until [TIME]. A series of powerful waves and strong currents may affect coasts near you. You are in danger. Get away from coastal waters. Move to high ground or inland now. Keep away from the coast until local officials say it is safe to return. [URL]",
            "asl": {
                "youtubeId": "o0gvQK5FHpI",
                "url": "https://www.youtube.com/watch?v=o0gvQK5FHpI"
            }
        },
        {
            "id": "earthquake-warning",
            "name": "Earthquake Warning",
            "sameCodes": [
                "EQW"
            ],
            "family": "GROUND",
            "capCategory": "Geo",
            "englishText": "EARTHQUAKE DETECTED! Drop, Cover, Hold On. Protect Yourself. [SENDING AGENCY] [URL]",
            "asl": {
                "youtubeId": "s382YqfwVj0",
                "url": "https://www.youtube.com/watch?v=s382YqfwVj0"
            }
        },
        {
            "id": "boil-water-advisory",
            "name": "Boil Water Advisory",
            "sameCodes": [],
            "sameNote": "No standard SAME/EAS event code; match by event name.",
            "family": "OTHER",
            "capCategory": "Health",
            "englishText": "[SENDING AGENCY]: A BOIL WATER ALERT has been issued for [LOCATION] and is in effect until [TIME]. Water in your community can make you sick. Use bottled water if available. Do not drink, cook with, brush your teeth with, or clean your home with tap water or filtered water until you boil it. Bring water to a full rolling boil for THREE MINUTES. Let water cool before use. Do not use ice made with water that has not been boiled. If you use formula to feed your child, use ready-to-use formula. Make sure pets do not drink water that has not been boiled. [URL]",
            "asl": {
                "youtubeId": "0yljX78JCsE",
                "url": "https://www.youtube.com/watch?v=0yljX78JCsE"
            }
        },
        {
            "id": "911-outage-alert",
            "name": "911 Outage Alert",
            "sameCodes": [
                "TOE"
            ],
            "family": "OTHER",
            "capCategory": "Infra",
            "englishText": "[SENDING AGENCY]: A 9-1-1 OUTAGE ALERT is in effect for [LOCATION]. Please contact police, fire, medical, or other emergency services directly at their local phone numbers in case of emergency. If you dial 9-1-1, you may not get help. [URL]",
            "asl": {
                "youtubeId": "0lP6m5y_Ww8",
                "url": "https://www.youtube.com/watch?v=0lP6m5y_Ww8"
            }
        },
        {
            "id": "avalanche-warning",
            "name": "Avalanche Warning",
            "sameCodes": [
                "AVW"
            ],
            "family": "GROUND",
            "capCategory": "Geo",
            "englishText": "[SENDING AGENCY]: An AVALANCHE WARNING is in effect in [LOCATION] until [TIME]. Unstable, fast-moving snow can happen quickly, causing injury or death and can block roads and damage property in affected areas. LEAVE areas near [LOCATION]. DO NOT return to area after evacuation until directed by local officials. Travel in the area is not recommended. Avalanches may run long distances. [URL]",
            "asl": {
                "youtubeId": "1hjwH1aY6Sg",
                "url": "https://www.youtube.com/watch?v=1hjwH1aY6Sg"
            }
        },
        {
            "id": "fire-warning",
            "name": "Fire Warning",
            "sameCodes": [
                "FRW"
            ],
            "family": "FIRE",
            "capCategory": "Fire",
            "englishText": "[SENDING AGENCY]: A FIRE WARNING in [LOCATION] is in effect until [TIME]. Evacuate your family and pets now, do not delay. Visibility in area will be reduced and roads can become blocked. If you do not leave now, you could be trapped, injured, or killed. LEAVE areas near [LOCATION]. Expect reduced visibility, heavy smoke, and difficulty breathing. Be careful when driving. Watch for public safety personnel operating in the area and follow their instructions. [URL]",
            "asl": {
                "youtubeId": "N5ZGlh_t4x0",
                "url": "https://www.youtube.com/watch?v=N5ZGlh_t4x0"
            }
        },
        {
            "id": "hazardous-materials-warning",
            "name": "Hazardous Materials Warning",
            "sameCodes": [
                "HMW"
            ],
            "family": "THREAT",
            "capCategory": "CBRNE",
            "englishText": "[SENDING AGENCY]: HAZARDOUS MATERIALS were released at [TIME] in [LOCATION]. Exposure may cause difficulty breathing, loss of coordination, burning sensation in eyes, nose, throat, or lungs, nausea, and possibly death. LEAVE areas near [LOCATION]. IF DRIVING to evacuate area, keep car windows and vents closed. DO NOT return to area after evacuation unless directed by local officials. [URL]",
            "asl": {
                "youtubeId": "QcRciWTMpW0",
                "url": "https://www.youtube.com/watch?v=QcRciWTMpW0"
            }
        },
        {
            "id": "evacuation-immediate",
            "name": "Evacuation Immediate",
            "sameCodes": [
                "EVI"
            ],
            "family": null,
            "capCategory": "Safety",
            "familyNote": "An action message: the family follows the causing hazard chosen by the originator.",
            "englishText": null,
            "textNote": "No adopted template text (declined as too vague, DA 25-12 para 11); the ASL video exists.",
            "asl": null,
            "note": "Demo-era action-message stub: the Feb-2024 DEMO-ONLY set included an ASL video for this message, but the adopted Appendix C texts (DA 25-12) do not include it and the OFFICIAL ASL set (fcc.gov/WirelessEmergencyAlert-Templates-ASL, 18 videos) does not either. Kept as an entry because the message type is real and the family mapping is useful; it carries no template text and no video. The FCC forbids using the demo video for any purpose."
        },
        {
            "id": "shelter-in-place-warning",
            "name": "Shelter in Place Warning",
            "sameCodes": [
                "SPW"
            ],
            "family": null,
            "capCategory": "Safety",
            "familyNote": "An action message: the family follows the causing hazard chosen by the originator.",
            "englishText": null,
            "textNote": "No adopted template text (declined as too vague, DA 25-12 para 11); the ASL video exists.",
            "asl": null,
            "note": "Demo-era action-message stub: the Feb-2024 DEMO-ONLY set included an ASL video for this message, but the adopted Appendix C texts (DA 25-12) do not include it and the OFFICIAL ASL set (fcc.gov/WirelessEmergencyAlert-Templates-ASL, 18 videos) does not either. Kept as an entry because the message type is real and the family mapping is useful; it carries no template text and no video. The FCC forbids using the demo video for any purpose."
        }
    ]
};
