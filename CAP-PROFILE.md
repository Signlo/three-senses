# CAP origination annex: accessibility at the source (informative)

Part of the Three Senses Alerting Standard, draft 0.10.0. Informative annex: it binds no
conformance requirement (R1 to R8 live in THE-STANDARD.md); it specifies how an alert
ORIGINATOR carries accessibility inside a standard OASIS CAP 1.2 message so that any
receiving device can render it, with no coordination beyond this page.

The reference origination implementation is the `@ideafe/three-senses/compose` module
(the Three Senses Alert Composer core), developed under a Memorandum of Agreement with
FEMA's IPAWS Program Management Office for the IPAWS-OPEN test environment.

## 1. Design rules

1. STANDARD CAP ONLY. Everything rides fields CAP 1.2 already defines: `<resource>` for
   media, `<parameter>` for metadata. A receiver that knows nothing about this annex sees
   a fully valid, fully ordinary CAP alert. Nothing replaces or alters the message text.
2. ROUND-TRIP UNTOUCHED. A gateway or redistributor that does not understand a parameter
   defined here MUST pass it through byte-intact, and one that re-serves CAP passes the
   ORIGINAL XML byte-intact (the IPAWS rule: a received message is never changed,
   manipulated, or filtered).
3. NEVER GUESS. A composer attaches an ASL resource only on an exact template match; a
   renderer applies a Three Senses parameter only when the value parses exactly. Broken
   or unknown values are ignored in favor of local inference: a wrong-hazard video or a
   wrong-family rhythm is worse than none.
4. HONESTY IN THE LABEL. An FCC template video explains what an alert TYPE means in ASL.
   It is never presented as a translation of the specific message (47 CFR 10.500(e)(3)
   leaves agency, location, and time to the text channels). The `resourceDesc` written by
   the Composer says so in words.

## 2. ASL video as a CAP resource

One `<resource>` block per `<info>`:

```xml
<resource>
  <resourceDesc>American Sign Language video: what a Tornado Warning means
    (official FCC WEA template video; not a translation of this specific
    message)</resourceDesc>
  <mimeType>text/html</mimeType>
  <uri>https://www.youtube.com/watch?v=HHs1gMK5r5w</uri>
</resource>
```

- `mimeType` is `text/html` when the URI is a viewing page (the FCC publishes the
  official templates on its channel); a directly hosted file carries its real type
  (`video/mp4`) and, per CAP, a `<size>` when known. Assume aggressive size budgets:
  alerts are received in disasters, on bad networks.
- The normative source of template-to-video pairings is `wea-asl-templates.json` in this
  repository (Apache-2.0, compiled from FCC DA 25-12 Appendix C and the FCC's official
  ASL template page, with the mismatches between the two sets recorded honestly).

## 3. Three Senses metadata as CAP parameters

Two `<parameter>` blocks per `<info>`, namespaced so they can never collide:

```xml
<parameter><valueName>ideafe:threeSenses:family</valueName><value>STORM</value></parameter>
<parameter><valueName>ideafe:threeSenses:version</valueName><value>0.10.0</value></parameter>
```

- `ideafe:threeSenses:family` is one of the standard's family names (GROUND, WATER,
  STORM, FIRE, THREAT, TEST, OTHER, ALL_CLEAR), chosen by the originator under the
  section 4 crosswalk of THE-STANDARD.md. The family names a CATEGORY only; the
  protective action always travels in language (`<instruction>`, WEA text).
- `ideafe:threeSenses:version` is the standard draft the originator mapped against. A
  renderer that does not recognize the version treats the parameter as absent.
- Receiver rule (mirrors rule 3): prefer the sender-declared family over local inference
  only when the value is an exact family name; otherwise infer locally exactly as if the
  parameter were missing. Severity is NEVER carried here: CAP `<severity>` is already the
  channel for it, and duplicating it would invite contradiction.

## 4. WEA texts

The 90-character short and 360-character long WEA texts ride the IPAWS parameter
convention, English and Spanish:

```xml
<parameter><valueName>CMAMtext</valueName><value>...90 characters...</value></parameter>
<parameter><valueName>CMAMlongtext</valueName><value>...360 characters...</value></parameter>
<parameter><valueName>CMAMtext-Spanish</valueName><value>...</value></parameter>
<parameter><valueName>CMAMlongtext-Spanish</valueName><value>...</value></parameter>
```

The Composer's precheck enforces the lengths and a conservative WEA-safe character set,
and IPAWS-profile essentials besides: `<code>IPAWSv1.0</code>`, a required `<expires>`,
timestamps with numeric timezone offsets, closed polygons under 100 nodes, six-digit SAME
geocodes, and references on every Update and Cancel. Where FEMA's IPAWS-OPEN Web-Service
Interface Design Guidance states a stricter rule, the Guidance wins; this annex tracks it.

## 5. What this annex is not

It does not originate live public alerts (the Composer is test-environment software under
its agreement); it does not replace the FCC's device-side template mechanism
(47 CFR 10.480(f)); it does not define new CAP elements; and it does not make the ASL
videos IDE's: they are United States government works, mapped here so they get used.
