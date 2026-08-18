# The Three Senses SMS Profile (Annex, informative)

Draft 1, August 2026. Part of the Three Senses Alerting Standard
(github.com/Signlo/three-senses). This annex is INFORMATIVE: it does not
change the vocabulary, and implementing it is optional.

## Why an SMS profile exists

Cell broadcast is the right channel for government alerts, but much of the
world alerts by SMS instead: countries without cell broadcast deployment,
humanitarian operations (camps, shelters, NGO phone trees), utilities, and
community networks. SMS is prose; a receiving app would need language
understanding to know which rhythm to play. This profile removes that need
with a five-character code any sender can append and any device can parse
with one regular expression, no AI and no network involved.

## The code

    3S:<FAMILY><SEVERITY>

appended anywhere in an SMS (by convention, at the end). Square brackets
are permitted: `[3S:W4]` equals `3S:W4`.

FAMILY, one letter:

| Letter | Family | Meaning |
| --- | --- | --- |
| G | GROUND | earthquake, landslide |
| W | WATER | flood, tsunami, storm surge |
| S | STORM | cyclone, typhoon, tornado, severe storm |
| F | FIRE | fire, wildfire |
| H | THREAT | danger from people |
| O | OTHER | any unnamed hazard |
| T | TEST | drill, never a real emergency |
| A | ALL_CLEAR | the danger has ended |

SEVERITY, one digit:

| Digit | Step | Touch level |
| --- | --- | --- |
| 0 | SAFE NOW (all clear) | silence |
| 1 | BE CAREFUL | 25% |
| 2 | DANGER COMING | 50% |
| 3 | ACT NOW (Severe) | 75% |
| 4 | ACT NOW (Extreme) | 100% |

Examples:

    Tsunami warning for the coast. Move to high ground now. 3S:W4
    Monthly siren test today at noon. No action needed. [3S:T1]
    The flood danger has ended. 3S:A0

## Parsing rules (normative for implementations of this annex)

1. The pattern is `3S:` followed by one family letter and one severity
   digit, case-insensitive, matched at a word boundary. First match wins.
2. `T` (TEST) renders at the TEST family's fixed gentle level whatever the
   digit says: a drill must never feel like an emergency.
3. `A` (ALL_CLEAR) renders no alarm rhythm whatever the digit says. An
   all-clear code MUST accompany an affirmative textual all-clear in the
   message body; a bare code, and silence generally, is never evidence of
   safety.
4. A malformed or absent code means this profile does not apply: fall back
   to the message's plain text. Never guess a family from a broken code.
5. The code grants no authority. Receivers decide which SENDERS to trust
   (a subscribed shortcode, a known NGO number); the profile only says what
   to render, never whether to believe it.

## Platform honesty

Automatic SMS reading is possible on Android only, and Google Play
restricts SMS permissions to default-SMS apps and approved exceptions;
deployments typically use a dedicated receiver app distributed outside the
Play Store, an org-managed device fleet, or manual paste. iOS offers no
SMS access to apps at all. The profile is therefore aimed at deployments
that control the receiving device (humanitarian operations, community
alerting) and at future native adoption, not at consumer app stores.

## Reference implementation

The SDK ships `parseSmsCode(text)` returning `{family, severity}` or
`null`, tested in `test/sms.test.mjs`.
