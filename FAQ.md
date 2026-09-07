# Frequently asked questions

Questions from the WFD 75th Anniversary webinar (17 August 2026) and from
implementers. Short answers; the specification is the authority.

## Why is one alarm sound not enough?

Because one sound can only carry one instruction, and the instructions
contradict each other.

> The fire alarm carries exactly one message: get out. In a tsunami, going
> outside is lethal and the roof is safety; in a tornado, the basement is.
> Three dangers, three opposite escapes, one bell.

The building often knows which hazard is coming; the alarm has no vocabulary
to say it. So the signal is spent on "something is wrong" and the part that
decides whether you live, which way safety is, is left to the person to guess.
A hazard vocabulary closes that gap. A child feels WATER on a wristband and
knows: climb, not run. The exact event and the action still arrive in words
(requirement R2); the rhythm is what gets the body moving in the right
direction before the words are read.

## Where do the rhythms come from?

> These rhythms come from sign languages. Deaf people have carried the shape
> of danger in our hands for centuries. Now that knowledge can save everyone.

Each pattern is drawn from the hazard's own temporal signature, and those
signatures are already how sign languages depict these dangers. FIRE is ten
rapid pulses, like the fingers of the sign for fire flickering upward. WATER
is long soft rolls a breath apart, like the rolling hand of the signs for
waves. GROUND is one unbroken hold, like the sustained-shaking signs for
earthquake. THREAT, TEST and OTHER are deliberately abstract, because a human
threat and a drill have no natural signature to imitate. So a person meeting
the vocabulary for the first time is recognizing a hazard, not decoding a
code. Mimesis is a design hypothesis under human testing, and
`vocabulary.json` says so family by family.

> Deaf people have been the crash-test bodies of every warning failure. We
> would rather be its engineers.
>
> An alert designed for the body that hears nothing reaches every body.

## Does a quiet phone mean I am safe?

No, and the standard now says so in as many words. Silence can also mean a
dead battery, no coverage, a disabled channel, or a failed device. When a
siren merely stops, nobody can tell whether the danger ended or the siren
broke. So the all-clear is an affirmative, authenticated message that
names what ended (for example "FLOOD WARNING ENDED") and plays the RELEASE
cue: one long soft press easing away, a breath, a short settling press,
gently, at most three times, never louder, and it stops on its own. Danger
insists until you acknowledge it; safety lets go by itself, so the release
is recognizable by its behavior. On light it leaves an afterglow (steady
calm green for ten minutes), because a lamp you can glance at answers "is
it over?" in a way a moment that passed cannot. Tone-only sirens never
sound it: a siren speaking means danger. Never treat the absence of an
alert as proof that danger has passed.

## How does an app get alerts if the internet is shut down?

Government alerts do not travel by internet or SMS. They use CELL
BROADCAST: a one-to-many radio signal from the cell tower that reaches
every phone in the area at once, with no data plan and no congestion. That
is why it survives disasters. The catch: no third-party app may read that
channel, on Android or iOS: the operating system presents the alert
itself. An app can teach the rhythm language and play it perfectly, but
only the OS hears the radio. That is why this standard is addressed to
regulators and platform makers: the alert pipe already exists, and even
carries a hazard-type field; what is missing is the rule that its
presentation must carry meaning. (On Android there is one legal,
user-granted bridge (a notification listener watching the system alert
app), and the reference implementation prototypes it; it is best-effort by
construction and impossible on iOS, which is exactly the gap.)

## Could SMS with a code drive the rhythms, without AI?

Yes, see `SMS-PROFILE.md`. A five-character code (`3S:W4` = WATER family,
extreme) parses with one regular expression. It exists for the places that
alert by SMS today: countries without cell broadcast and humanitarian
operations. Platform honesty: automatic SMS reading is Android-only and
restricted in consumer app stores, so the profile targets managed
deployments, not app-store apps. iOS apps cannot read SMS at all.

## Can I change the rhythms in my implementation?

No. That is the one thing conformance forbids (requirement R7). A warning
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
