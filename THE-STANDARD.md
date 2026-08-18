# The Three Senses Alerting Standard

Draft 0.7.0 (August 2026). Published by International Deaf Emergency (IDE),
a Deaf-led United States 501(c)(3) nonprofit. Contact: Emmanuel Jacq,
President, emmanuel.jacq@ideafe.org. Canonical page: https://ideafe.org/standard
(also reachable at https://alertsforall.org).

See it. Feel it. Hear it.

## 1. Purpose

An alert is not what leaves the tower; an alert is what reaches the person.
A person who cannot perceive or understand a warning has not been warned.
This standard defines rules under which the attention facts of every public
emergency alert (that there is an emergency, how serious it is, and what
kind of danger it is) are readable through sight alone, touch alone, or
hearing alone, and the protective action is always available in accessible
language, so that Deaf, DeafBlind, hard-of-hearing, blind, and hearing
people, in any language, at any hour, receive the answers they need in time
to act.

## 2. The Five Alert Questions (normative)

Every alert MUST answer, and every conformant renderer MUST convey:

1. Is this an emergency? A system-reserved, authenticated presentation,
   distinguishable from ordinary notifications to the extent the platform
   supports, repeating until acknowledged, subject to alert-originator
   suppression instructions and a bounded device maximum, after which the
   alert persists as an accessible status. When the warning escalates or
   ends, the person is alerted again.
2. How serious is it? A four-step severity ladder expressed simultaneously
   as color, a color-independent mark count, and channel intensity.
3. What danger is it? A hazard family conveyed by picture and by the
   family's rhythm on every channel.
4. What should I do now? The protective action first, in plain words,
   before any technical prose.
5. Where is more information, in my language? Further detail in national
   sign languages through deaf signers, plus text, voice, and accessible
   formats.

The five questions ride two kinds of channel, and the distinction is
normative:

- ATTENTION channels (the family rhythm on touch, light, and tone) carry
  question 1, question 3, and, where the channel can grade, question 2.
  They are redundant: any single enabled attention channel is sufficient
  to know that an emergency is happening and which hazard family it is.
- LANGUAGE channels (text, synthesized speech, sign-language video,
  refreshable braille) carry questions 4 and 5 and restate questions 1
  to 3. The protective action is selected by the alert originator and
  conveyed in language; a device MUST NOT infer the protective action from
  the hazard family alone. For a person trained on the vocabulary, the
  learned family association (water: go up; fire: go out) provides an
  immediate provisional prompt, the way a learned fire-alarm tone means
  evacuate; training materials MUST teach the association, and the
  language channel remains authoritative.

Questions 1 through 4 MUST each be answerable through sight alone, touch
alone, and hearing alone.

## 3. The vocabulary (normative)

The machine-readable vocabulary in `vocabulary.json` is the normative
definition of every hazard family rhythm. Its core rules:

- ENVELOPE IS THE RHYTHM. Touch, light, and tone render the identical
  pulse envelope from one shared clock. A late-starting channel joins the
  rhythm mid-pattern in phase; it never plays the rhythm shifted.
- SEVERITY GRADES THE HAND; LIGHT AND SOUND REACH. Where the device has
  validated vibration amplitude control, touch carries the level in four
  distinct strengths (25, 50, 75, 100 percent), so a DeafBlind user reads
  severity by touch alone. Amplitude control is not universal: a device
  without it MUST perform a capability check, render the rhythm unchanged,
  and let the filled-mark count (one to three), the color, and the words
  carry the level; it MUST NOT claim touch-graded severity. Color never
  carries severity alone. Light and sound exist to reach: from DANGER
  COMING (the middle tier) upward they deliver at full power. Severity
  never changes a rhythm: a person who learned "two long waves means
  water" feels two long waves at every severity.
- THE ALL-CLEAR IS AN AFFIRMATIVE RELEASE, PLAYED ONCE. An all-clear is an
  authenticated update or cancellation, linked to the alert it ends, that
  says in words what has ended (for example "FLOOD WARNING ENDED"), and
  plays the RELEASE cue: one long soft press, a breath, a shorter settling
  press (1200 ms on, 400 ms quiet, 500 ms on), at its fixed gentle level
  (0.25) on every channel, exactly ONCE per message, never looping.
  Repetition is reserved for danger, so not-repeating is itself part of
  the meaning. The cue exists because ABSENCE cannot be told apart from
  FAILURE: when a siren merely stops, a person cannot know whether the
  danger ended or the siren broke, and the same is true of a phone that
  simply falls quiet. Relief is information, and it is delivered
  affirmatively, to every sense: a gentle release on the skin, a calm
  light, a soft tone, and the words. The absence of an alert is NEVER
  evidence of safety, and a device MUST NOT present silence, a dead
  battery, a disabled channel, or missing coverage as an all-clear.
- RHYTHMS ARE MIMETIC WHERE THE HAZARD HAS A SIGNATURE. WATER, GROUND,
  STORM, and FIRE are drawn from the hazard's own temporal pattern,
  converging with the iconicity of sign languages: the ground holds one
  unbroken shake, the wave rolls long and hits, fire flickers in ten fast
  pulses like the fingers of the sign for fire. THREAT, TEST, and OTHER
  are deliberately abstract: they mark categories without a physical
  signature. Mimesis is a design hypothesis under human testing, expected
  to reduce learning burden; it is not claimed as universal across
  languages and cultures. Future patterns MUST differ from every existing
  pattern on at least two axes (pulse length and gap length), never by
  count alone, and SHOULD be mimetic where the hazard offers a signature.
- PHOTOSENSITIVITY IS A FLOOR. No light renderer may exceed 3 flashes per
  second or 6 state transitions per second. These bounds are drawn from
  WCAG 2.3.1, whose full thresholds also cover flash area, luminance, and
  red flash; device-specific evaluation against those thresholds remains
  necessary. Every implementation MUST offer a steady, non-modulating
  light path for people who identify as photosensitive. The steady path
  carries attention and, through duration and brightness, urgency; in
  steady mode the hazard family and the action are carried by the symbol
  and the language channels, and no implementation may claim the steady
  path conveys the rhythm's family information.
- TESTS ARE GENTLE. The TEST family never exceeds intensity 0.3 on any
  channel. A drill must never feel like an emergency.
- LOOPS ARE SEAMLESS. Urgent alerts repeat with no pause, so every family
  except GROUND ends in a trailing quiet, part of the pattern and counted
  in its total, sized so the looped stream keeps the family's cadence
  exactly. A repeat begins at t0 plus the pattern's total; pulses never
  fuse across the loop boundary. GROUND is the deliberate exception:
  looped, it fuses into one continuous unbroken hold, which is its mimesis.
- ORIGINATOR CONTROLS ARE HONORED. Event-specific presentation MUST honor
  alert-originator suppression instructions (for example, silent alerts
  for active-threat events where a buzzing device could reveal a hiding
  person), applicable regulation, the user's accessibility settings, and
  device health and safety limits. Where an originator validly suppresses
  a modality, the device MUST NOT override the suppression, except where
  regulation itself provides an accessibility override.
- FALLBACK IS GRACEFUL. A device that cannot render a pattern falls back
  to its platform's common cadence, never to silence, except where the
  alert originator has validly suppressed that modality.
- TIMING IS TOLERANCED (draft budgets for the standards process). Between
  modalities of one device: skew no greater than 50 ms. Pulse duration
  error: no greater than 10 percent or 20 ms, whichever is larger.
  Repeats anchor to the original start time, so error never accumulates
  across cycles. A late-joining or interrupted channel rejoins at the
  correct phase; it never replays a cycle from its beginning mid-stream.

## 4. CAP alignment and the hazard-family crosswalk (normative)

The Common Alerting Protocol (OASIS CAP 1.2) is the interchange language of
public alerting, and this standard maps onto it rather than beside it:

- SEVERITY. CAP severity values map to the ladder: Minor maps to BE
  CAREFUL, Moderate to DANGER COMING, Severe and Extreme to ACT NOW
  (touch, where graded, separates them at 75 and 100 percent). Unknown
  presents as Severe: a warning whose level cannot be read is presumed
  dangerous, never gentle.
- URGENCY is not severity. CAP urgency (Immediate, Expected, Future, Past,
  Unknown) governs WHEN to act and SHOULD modulate presentation priority
  and repetition, not the severity ladder. An Extreme-but-Future alert
  presents with full severity marking and without the immediate-action
  loop.
- PROTECTIVE ACTION. CAP responseType and the instruction text carry the
  action. The alert originator selects it; a renderer conveys it in
  language and MUST NOT derive it from the hazard family.
- ALL-CLEAR. A CAP Cancel or Update, or responseType AllClear, is the
  affirmative all-clear of section 3. Certainty is preserved in the
  language channels; it is never silently discarded.
- The mapping is performed by the alert originator or an alerting gateway
  under a published table; a device applies the received identifiers.

The hazard families identify a CATEGORY only; they never determine the
protective action. The reference crosswalk:

| Event class | Family |
| --- | --- |
| Earthquake, landslide, avalanche, volcano | GROUND |
| Flood, tsunami, storm surge, dam failure | WATER |
| Tornado, hurricane, cyclone, severe storm, winter storm, high wind | STORM |
| Wildfire, structure fire, fire weather | FIRE |
| Human threat, law enforcement, civil danger, missing person (AMBER), chemical, radiological, hazardous materials | THREAT |
| Health, air quality, infectious disease, utility and infrastructure, and every event without a family | OTHER |
| Drills, exercises, and system tests, whatever hazard words they carry | TEST |

Events spanning families take the originator's primary categorization.
Whether health emergencies warrant a family of their own is a question for
the consensus standards process; until then they present as OTHER, which
is honest attention without false specificity.

### A note on the reference tone

The reference implementation's 520 Hz tone is a prototype supplemental
tone chosen for audibility against hearing-aid frequency ranges. Nothing
in this standard proposes replacing any regulated attention signal (for
example the United States WEA 853 and 960 Hz signal); where regulation
prescribes a signal, the rhythm rides the channels regulation leaves open.

## 5. Device profiles (informative, draft)

The vocabulary is semantic, not device-bound. A device renders the
questions its channels can carry and defers the rest; the rhythm is always
the same rhythm. Phones and smartwatches render all channels; a television
renders the visual answer at room scale; connected lighting renders
questions 1 to 3 and richer devices complete the answer; building systems
gain what today's alarms lack, the ability to say not only that danger
exists but which way to run. Device profiles will be specified in a later
draft.

## 6. Conformance

`conformance/vectors.json` contains the machine-checkable event vectors and
requirements R1 through R8. An implementation may describe itself as
conformant with this standard only if it renders the vectors exactly,
passes all requirements, and alters no pattern. `conformance/validate.mjs`
checks a rendering log against the vectors.

## 7. Licensing and integrity

- This specification text: Creative Commons BY-ND 4.0. Free to copy,
  cite, and translate with attribution; no derivative "modified standards."
- The vocabulary data and all code in this repository: Apache License 2.0.
- The names "Three Senses Alerting Standard" and "Alerts for All" identify
  this standard as published by International Deaf Emergency. Do not use
  them for altered vocabularies.

STANDARDS ADAPTATION GRANT. IDE grants the United States Federal
Communications Commission, FEMA, and recognized standards development
organizations a perpetual, worldwide, royalty-free license to reproduce,
adapt, create derivative works from, and incorporate the normative
material of this standard (the vocabulary, the conformance requirements,
and this specification text) into public standards, technical reports,
and regulations, with attribution. The no-derivatives restriction above
does not apply to that use. The full grant is in STANDARDS-GRANT.md.

The point of this arrangement: anyone may implement the standard for free,
no one may change what FIRE feels like and still call it Three Senses, and
nothing in the licensing blocks a standards body from doing its work.

## 8. Status and lineage

Draft 0.7.0 is implemented end to end in Deaflare (the reference
implementation). Evaluation to date: expert panel review and engineering
testing on consumer devices. Structured usability testing with Deaf and
DeafBlind participants is underway through IDE's network; completed,
quality-reviewed results will be published and filed where relevant.
0.7.0 gave the all-clear its own RELEASE cue (long press, breath, settling
press, once, gentle), by the author's ruling: a signal that merely stops
cannot be told apart from a signal that broke, in a building's siren or in
a pocket, so relief is delivered affirmatively to every sense. The cue is
distinct from every alarm rhythm on both design axes and additionally by
never repeating. 0.6.0 reframed the all-clear as an affirmative message with calm
presentation (absence of signal is never evidence of safety), split the
five questions across attention and language channels, added the
originator-suppression rule, timing tolerances, amplitude capability
requirements, the CAP mapping, and the standards adaptation grant, after
an external FCC-style audit (August 2026); no rhythm changed. 0.2.0 revised
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
Union public-warning framework. The standard continues the line of the
2015 WFD and WASLI statement on emergency communication, and its intended
destination is a Deaf-led working group under Early Warnings for All,
where the community owns the text.
