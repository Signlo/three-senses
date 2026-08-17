# The Three Senses Alerting Standard

**See it. Feel it. Hear it.** Open rules that make every emergency warning
readable by sight, touch, or hearing alone, each channel enough to act on.

- `THE-STANDARD.md`: the specification (draft 0.3.0)
- `vocabulary.json`: the normative, machine-readable rhythm vocabulary
- `conformance/vectors.json`: machine-checkable conformance vectors (R1 to R8)
- `conformance/validate.mjs`: checks a rendering log against the vectors

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

## Conformance in one command

Render the vocabulary, log your events as JSON, then:

    node conformance/validate.mjs your-render-log.json

## Versioning

Rhythm changes are major versions and governance events, never code tweaks.
Draft 0.1.0 reflected field testing with the standard's Deaf author. Draft
0.2.0 (the day after) came from the author's repetition review: urgent
alerts loop with no pause, and the 0.1.0 patterns fused across the loop
boundary (two long waves became one). Every family except GROUND now ends
in a trailing quiet (requirement R8). Draft 0.3.0 refined TEST to a
quick grouped double tap. Deaf and DeafBlind user studies are beginning
and will shape the next draft.
