# Frequently asked questions

Questions from the WFD 75th Anniversary webinar (17 August 2026) and from
implementers. Short answers; the specification is the authority.

## Does a quiet phone mean I am safe?

No, and the standard now says so in as many words. Silence can also mean a
dead battery, no coverage, a disabled channel, or a failed device. When a
siren merely stops, nobody can tell whether the danger ended or the siren
broke. So the all-clear is an affirmative, authenticated message that
names what ended (for example "FLOOD WARNING ENDED") and plays the RELEASE
cue: one long soft press, a breath, a shorter settling press, once, gently,
on every channel. Repetition is reserved for danger, so a cue that plays
once and rests is itself part of the meaning. Never treat the absence of
an alert as proof that danger has passed.

## How does an app get alerts if the internet is shut down?

Government alerts do not travel by internet or SMS. They use CELL
BROADCAST: a one-to-many radio signal from the cell tower that reaches
every phone in the area at once, with no data plan and no congestion. That
is why it survives disasters. The catch: no third-party app may read that
channel, on Android or iOS — the operating system presents the alert
itself. An app can teach the rhythm language and play it perfectly, but
only the OS hears the radio. That is why this standard is addressed to
regulators and platform makers: the alert pipe already exists, and even
carries a hazard-type field; what is missing is the rule that its
presentation must carry meaning. (On Android there is one legal,
user-granted bridge — a notification listener watching the system alert
app — and the reference implementation prototypes it; it is best-effort by
construction and impossible on iOS, which is exactly the gap.)

## Could SMS with a code drive the rhythms, without AI?

Yes — see `SMS-PROFILE.md`. A five-character code (`3S:W4` = WATER family,
extreme) parses with one regular expression. It exists for the places that
alert by SMS today: countries without cell broadcast and humanitarian
operations. Platform honesty: automatic SMS reading is Android-only and
restricted in consumer app stores, so the profile targets managed
deployments, not app-store apps. iOS apps cannot read SMS at all.

## Can I change the rhythms in my implementation?

No — that is the one thing conformance forbids (requirement R7). A warning
language only works if FIRE feels the same everywhere, like the siren.
Implement freely under Apache-2.0; if you alter a pattern, you have made
something else and must not call it Three Senses. Propose changes here
instead: rhythm changes are versioned governance events.

## Is it really free?

Yes. The vocabulary and code are Apache-2.0, the specification text is
CC BY-ND 4.0, there is no membership, no royalty, and no proprietary
claim. Releases are archived with a DOI (see the README) so you can cite
an exact version forever.

## Why does severity never change the rhythm?

A person who learned "two long waves means water" must feel two long waves
at every severity, or the vocabulary collapses under stress. Severity
rides on other axes: four distinct vibration strengths for the hand (how a
DeafBlind user reads the level), a one-to-three mark count and color for
the eye, and full-power light and sound from the middle tier upward
(those channels exist to reach, not to whisper).

## What about photosensitive users?

Light rendering never exceeds three flashes per second (WCAG 2.3.1), and
every conformant implementation must offer a steady, non-modulating light
path that carries the same information through duration. See the
specification's light bounds and requirement R5.
