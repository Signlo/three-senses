# Security Policy: three-senses

Signlo is a single-maintainer organization with no external contributors on staff. three-senses
is its one deliberately PUBLIC repository (recorded, with the rationale, in
`Signlo/signlo-platform-ops` `config/public-repos.yaml`). There is no bug-bounty programme. This
file tailors the [org-wide default](https://github.com/Signlo/.github/blob/main/SECURITY.md) to
three-senses; a repo's own file always overrides the default.

## Reporting

Email **emmanuel@signlo.com** with the affected path and how to reproduce. If it involves a
**live credential**, say so in the subject line: rotation comes before analysis. Because this
repository is public, please do not open a public issue for a credential or a supply-chain
finding; email first.

## Scope

Only the code currently on `main` is supported. The SDK is published to npm as
`@ideafe/three-senses` from `release.yml`; the standard text, the vocabulary and the conformance
vectors are versioned with it. The specification is a public draft, and implementations should
pin an exact version.

## Trust model and protected invariants (NOT vulnerabilities)

- **Public by design.** The Three Senses Alerting Standard exists to be citable by the FCC docket
  and by other implementers. Its visibility is a disclosure decision the operator took on
  2026-08-17, and it carries no patent-corpus or trade-secret material.
- **Fork pull requests are in the threat model here**, unlike every other Signlo repo. Every
  workflow in this repository must default to a GitHub-hosted runner; the one workflow that
  names a self-hosted runner (`dependabot-auto-approve.yml`) triggers only on
  `pull_request_target` gated on `github.actor == 'dependabot[bot]'`, which a PR author cannot
  forge. That exception is recorded in platform-ops `config/public-runner-exceptions.yaml`.
- **The committed `dist/` and embedded data are checked against the source in CI.** A stale
  build failing that check is the gate working, not a flaky test.

## Genuinely a finding: please do report

- A live credential (npm token, Zenodo token, GitHub token) anywhere in this repo's history,
  its workflows, or a published npm tarball.
- A workflow change that runs fork-controlled code on Signlo hardware, or that grants a
  `pull_request`-triggered job write permissions or secrets.
- A conformance vector or vocabulary entry whose rhythm could be mistaken for a different hazard
  family: for an alerting standard, an ambiguous signal is a safety defect.
- A published package whose contents differ from the tagged source.
- Accessibility regressions in the SDK's reference output: audio-only, visual-only or
  haptic-only signalling of a warning that the standard requires in all three senses.
