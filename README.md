# The Three Senses Alerting Standard

[![npm](https://img.shields.io/npm/v/%40ideafe%2Fthree-senses)](https://www.npmjs.com/package/@ideafe/three-senses) [![CI](https://github.com/Signlo/three-senses/actions/workflows/ci.yml/badge.svg)](https://github.com/Signlo/three-senses/actions/workflows/ci.yml) [![DOI](https://zenodo.org/badge/1336687968.svg)](https://zenodo.org/badge/latestdoi/1336687968)

**See it. Feel it. Hear it.** Open rules that make every emergency warning
readable by sight, touch, or hearing alone, each channel enough to act on.

- `THE-STANDARD.md`: the specification (draft 0.6.0)
- `vocabulary.json`: the normative, machine-readable rhythm vocabulary
- `conformance/vectors.json`: machine-checkable conformance vectors (R1 to R8)
- `conformance/validate.mjs`: checks a rendering log against the vectors
- `SMS-PROFILE.md`: informative annex — a five-character code (`3S:W4`)
  that lets SMS-based alerting (no cell broadcast, humanitarian settings)
  drive the vocabulary with one regex, no AI; `parseSmsCode()` in the SDK
- `src/`, `dist/`: the SDK (`@ideafe/three-senses`), TypeScript, zero
  dependencies, conformance-proven against the vectors in CI

Published by [International Deaf Emergency](https://ideafe.org), a Deaf-led
US 501(c)(3) nonprofit. Canonical page: [ideafe.org/standard](https://ideafe.org/standard).
Reference implementation: [Deaflare](https://deaflare.com).

## Why the rhythms cannot be modified

Anyone may implement this standard, free, forever (Apache-2.0 data and
code). But a warning language only works if it is the same everywhere, like
the siren. So the specification text is BY-ND, the vocabulary is versioned
and published only here, and the standard's names identify conformant
implementations only. Fork the code all you like; if you change what FIRE
feels like, it is not Three Senses anymore.

## The SDK

TypeScript, zero runtime dependencies, works in Node (18+) and browsers.

    npm install @ideafe/three-senses

(Installing straight from this repository also works:
`npm install github:Signlo/three-senses`.)

Timelines, severity, and conformance (Node or browser):

```js
import {
  timeline, cycleMs, cycleStart, channelLevel, vibratePattern, conformance,
} from "@ideafe/three-senses";

timeline("FIRE");            // { steps: [{at: 0, event: "on"}, ...], totalMs: 4000 }
cycleMs("WATER");            // 6000 — the normative repeat interval (R8)
channelLevel("TEST", "Extreme"); // 0.3 — a drill is capped, always (R6)
vibratePattern("STORM");     // [500, 1000, 500, 1000, 500]
conformance().pass;          // true — this SDK, proven against the vectors
```

Play an alert in a browser, all channels on one clock:

```js
import { startAlert } from "@ideafe/three-senses/web";

const alert = startAlert("FIRE", {
  severity: "Extreme",
  onFlash: (on) => beacon.classList.toggle("lit", on), // any light you own
  tone: true,      // 520 Hz, gated on the same envelope
  vibrate: true,   // Vibration API where available
});
acknowledgeButton.onclick = () => alert.stop(); // I UNDERSTAND
```

The renderer callback design is deliberate: the SDK owns the clock and the
rhythm; you own the surface — a DOM element, a torch, a smart bulb, a
building beacon. Severity only ever changes the level. ALL_CLEAR is an affirmative update presented calmly: it renders
nothing.

And a CLI:

    npx three-senses list
    npx three-senses show FIRE
    npx three-senses conformance   # proves the SDK against the vectors

## Conformance in one command

Render the vocabulary, log your events as JSON, then:

    node conformance/validate.mjs your-render-log.json

An SDK-based implementation can emit that log directly with
`renderLog(family)`; the SDK's own test suite runs exactly this check, plus
negative controls (a wrong rhythm and a trimmed loop both fail).

## Versioning

Rhythm changes are major versions and governance events, never code tweaks.
Draft 0.1.0 reflected field testing with the standard's Deaf author. Draft
0.2.0 (the day after) came from the author's repetition review: urgent
alerts loop with no pause, and the 0.1.0 patterns fused across the loop
boundary (two long waves became one). Every family except GROUND now ends
in a trailing quiet (requirement R8). Draft 0.3.0 refined TEST to a
quick grouped double tap. Draft 0.4.0 split severity by channel purpose:
touch grades in four strengths for DeafBlind reading, marks count the
step, and light and sound deliver at full power from the middle tier.
Draft 0.6.0, after an external FCC-style audit, reframed the all-clear as
an affirmative calmly-presented message (silence is never evidence of
safety), split the five questions across attention and language channels,
and added originator-suppression, timing-tolerance, amplitude-capability,
and CAP-mapping rules, plus a standards adaptation grant. No rhythm
changed.
Deaf and DeafBlind user studies are beginning and will shape the next
draft.

## Citing the standard

Every release is archived on Zenodo. Cite the concept DOI, which always
resolves to the latest version:

> Jacq, E. (2026). The Three Senses Alerting Standard. International Deaf
> Emergency. Zenodo. https://doi.org/10.5281/zenodo.21977982

Citation metadata ships in `CITATION.cff`; GitHub's "Cite this repository"
button uses it.
