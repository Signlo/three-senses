# The Three Senses Alerting Standard

Draft 0.4.0 (August 2026). Published by International Deaf Emergency (IDE),
a Deaf-led United States 501(c)(3) nonprofit. Contact: Emmanuel Jacq,
President, emmanuel.jacq@ideafe.org. Canonical page: https://ideafe.org/standard
(also reachable at https://alertsforall.org).

See it. Feel it. Hear it.

## 1. Purpose

An alert is not what leaves the tower; an alert is what reaches the person.
A person who cannot perceive or understand a warning has not been warned.
This standard defines rules under which every public emergency alert is
readable through sight alone, touch alone, or hearing alone, so that Deaf,
DeafBlind, hard-of-hearing, blind, and hearing people, in any language, at
any hour, receive the same four answers in time to act.

## 2. The Five Alert Questions (normative)

Every alert MUST answer, and every conformant renderer MUST convey:

1. Is this an emergency? An unmistakable presentation no ordinary
   notification can imitate, repeating until acknowledged. When the warning
   escalates or ends, the person is alerted again.
2. How serious is it? A four-step severity ladder expressed simultaneously
   as color, a color-independent mark count, and channel intensity.
3. What danger is it? A hazard family conveyed by picture and by the
   family's rhythm on every channel.
4. What should I do now? The protective action first, in plain words,
   before any technical prose.
5. Where is more information, in my language? Further detail in national
   sign languages through deaf signers, plus text, voice, and accessible
   formats.

Questions 1 through 4 MUST each be answerable through sight alone, touch
alone, and hearing alone.

## 3. The vocabulary (normative)

The machine-readable vocabulary in `vocabulary.json` is the normative
definition of every hazard family rhythm. Its core rules:

- ENVELOPE IS THE RHYTHM. Touch, light, and tone render the identical
  pulse envelope from one shared clock. A late-starting channel joins the
  rhythm mid-pattern in phase; it never plays the rhythm shifted.
- SEVERITY GRADES THE HAND; LIGHT AND SOUND REACH. Touch carries the level
  in four distinct strengths (25, 50, 75, 100 percent), so a DeafBlind user
  reads severity by touch alone; the filled-mark count (one to three) and
  the color say the same thing for the eye, and color never carries
  severity alone. Light and sound exist to reach: from DANGER COMING (the
  middle tier) upward they deliver at full power. Severity never changes a
  rhythm: a person who learned "two long waves means water" feels two long
  waves at every severity.
- THE ALL-CLEAR IS SILENCE. No channel plays anything. Quiet means safe.
- RHYTHMS ARE MIMETIC. Every pattern is the hazard's own temporal
  signature, converging with the iconicity of sign languages: the ground
  holds one unbroken shake, the wave rolls long and hits, fire flickers in
  ten fast pulses like the fingers of the sign for fire. Future patterns
  MUST be mimetic, and MUST differ from every existing pattern on at least
  two axes (pulse length and gap length), never by count alone.
- PHOTOSENSITIVITY IS A FLOOR. No light renderer may exceed 3 flashes per
  second or 6 state transitions per second (WCAG 2.3.1), and every
  implementation MUST offer a steady, non-modulating light path for people
  who identify as photosensitive, carrying the same information through
  duration.
- TESTS ARE GENTLE. The TEST family never exceeds intensity 0.3 on any
  channel. A drill must never feel like an emergency.
- LOOPS ARE SEAMLESS. Urgent alerts repeat with no pause, so every family
  except GROUND ends in a trailing quiet, part of the pattern and counted
  in its total, sized so the looped stream keeps the family's cadence
  exactly. A repeat begins at t0 plus the pattern's total; pulses never
  fuse across the loop boundary. GROUND is the deliberate exception:
  looped, it fuses into one continuous unbroken hold, which is its mimesis.
- FALLBACK IS GRACEFUL. A device that cannot render a pattern falls back
  to its platform's common cadence, never to silence.

## 4. Device profiles (informative, draft)

The vocabulary is semantic, not device-bound. A device renders the
questions its channels can carry and defers the rest; the rhythm is always
the same rhythm. Phones and smartwatches render all channels; a television
renders the visual answer at room scale; connected lighting renders
questions 1 to 3 and richer devices complete the answer; building systems
gain what today's alarms lack, the ability to say not only that danger
exists but which way to run. Device profiles will be specified in a later
draft.

## 5. Conformance

`conformance/vectors.json` contains the machine-checkable event vectors and
requirements R1 through R8. An implementation may describe itself as
conformant with this standard only if it renders the vectors exactly,
passes all requirements, and alters no pattern. `conformance/validate.mjs`
checks a rendering log against the vectors.

## 6. Licensing and integrity

- This specification text: Creative Commons BY-ND 4.0. Free to copy,
  cite, and translate with attribution; no derivative "modified standards."
- The vocabulary data and all code in this repository: Apache License 2.0.
- The names "Three Senses Alerting Standard" and "Alerts for All" identify
  this standard as published by International Deaf Emergency. Do not use
  them for altered vocabularies.

The point of this arrangement: anyone may implement the standard for free,
and no one may change what FIRE feels like and still call it Three Senses.

## 7. Status and lineage

Draft 0.4.0 is implemented end to end in Deaflare (the reference
implementation) and field-tested on consumer devices. 0.2.0 revised
0.1.0 after a repetition review: every family except GROUND now ends in
a trailing quiet so that back-to-back repetition preserves each rhythm
exactly (requirement R8). 0.3.0 refined the TEST family to a quick
grouped double tap. 0.4.0 splits severity by channel purpose, by the
author's ruling after the WFD 75th anniversary webinar: touch grades in
four strengths, marks count the step one to three, and light and sound
deliver at full power from the middle tier upward. The standard is offered
as comments to the United States FCC alerting-modernization proceeding
(PS Dockets 15-91, 15-94, 25-224; August 2026), proposed as input to the
UN Early Warnings for All initiative, and being adapted for the European
Union public-warning framework. Structured testing with Deaf
and DeafBlind users is beginning. The standard continues the line of the
2015 WFD and WASLI statement on emergency communication, and its intended
destination is a Deaf-led working group under Early Warnings for All,
where the community owns the text.
