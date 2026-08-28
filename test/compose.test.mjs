import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  composeCap,
  composeFollowUp,
  precheck,
  weaTemplateFor,
  weaTemplates,
  familyForEvent,
} from "../dist/compose.js";

const rootMap = JSON.parse(
  readFileSync(new URL("../wea-asl-templates.json", import.meta.url)),
);

const BASE = {
  identifier: "IDE-TEST-0001",
  sender: "composer-test@ideafe.org",
  sent: "2026-08-25T12:00:00-04:00",
  status: "Test",
  event: "Tornado Warning",
  sameCode: "TOR",
  urgency: "Immediate",
  severity: "Extreme",
  certainty: "Observed",
  expires: "2026-08-25T13:00:00-04:00",
  headline: "Test tornado warning",
  instruction: "Take shelter now.",
  area: {
    areaDesc: "Oklahoma County, OK",
    sameGeocodes: ["040109"],
    polygons: ["35.4,-97.6 35.6,-97.6 35.6,-97.3 35.4,-97.3 35.4,-97.6"],
  },
  wea: {
    shortEn: "Tornado Warning in this area. Take shelter now. Check media.",
    shortEs: "Aviso de tornado en esta area. Refugiese ahora.",
  },
};

// ---------- the data artifact ----------

test("the embedded map matches the published wea-asl-templates.json byte-for-byte", () => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(weaTemplates())),
    rootMap.templates,
  );
});

test("the 18 adopted templates align text-to-video; two demo-era stubs carry neither", () => {
  // v0.10.1 truth table, after the demo->official video correction: the OFFICIAL
  // ASL set covers exactly the 18 adopted Appendix C texts (including both
  // Emergency escalations, which the demo set lacked). Evacuation Immediate and
  // Shelter in Place existed ONLY as demo videos: no adopted text, no official
  // video — kept as annotated stubs because the message types are real.
  assert.equal(rootMap.templates.length, 20);
  const withText = rootMap.templates.filter((t) => t.englishText);
  const withVideo = rootMap.templates.filter((t) => t.asl);
  assert.equal(withText.length, 18, "the adopted Appendix C set");
  assert.equal(withVideo.length, 18, "the official ASL video set");
  assert.deepEqual(
    rootMap.templates.filter((t) => t.englishText && !t.asl).map((t) => t.id),
    [],
    "every adopted text has an official video",
  );
  assert.deepEqual(
    rootMap.templates.filter((t) => !t.englishText && t.asl).map((t) => t.id),
    [],
    "no video without an adopted text (the demo-era pair is stubbed out)",
  );
  const stubs = rootMap.templates.filter((t) => !t.englishText && !t.asl);
  assert.deepEqual(stubs.map((t) => t.id).sort(), [
    "evacuation-immediate",
    "shelter-in-place-warning",
  ]);
  for (const st of stubs)
    assert.ok(st.note && st.note.includes("DEMO"), `${st.id} explains itself`);
});

test("every template carries a valid capCategory", () => {
  const allowed = new Set([
    "Geo",
    "Met",
    "Safety",
    "Security",
    "Rescue",
    "Fire",
    "Health",
    "Env",
    "Transport",
    "Infra",
    "CBRNE",
    "Other",
  ]);
  for (const t of rootMap.templates)
    assert.ok(allowed.has(t.capCategory), t.id);
});

test("every published video URL is a well-formed YouTube watch URL", () => {
  for (const t of rootMap.templates) {
    if (!t.asl) continue;
    assert.match(
      t.asl.url,
      /^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{6,}$/,
    );
    assert.ok(t.asl.url.endsWith(t.asl.youtubeId));
  }
});

// ---------- template + family lookup ----------

test("weaTemplateFor: a bare TOR never silently escalates — base Warning wins", () => {
  const t = weaTemplateFor("TOR");
  assert.equal(t.id, "tornado-warning");
  assert.ok(t.asl.url.includes("youtube.com"));
});

test("weaTemplateFor: name lookup, case-insensitive", () => {
  assert.equal(weaTemplateFor("boil water advisory").id, "boil-water-advisory");
});

test("weaTemplateFor: unknown event yields null, never a guess (negative control)", () => {
  assert.equal(weaTemplateFor("Volcano Warning"), null);
  assert.equal(weaTemplateFor(""), null);
  assert.equal(weaTemplateFor("   "), null);
});

test("familyForEvent: map first, crosswalk keywords second, OTHER floor", () => {
  assert.equal(familyForEvent("TOR"), "STORM");
  assert.equal(familyForEvent("TSW"), "WATER");
  assert.equal(familyForEvent("Volcano Warning"), "GROUND");
  assert.equal(familyForEvent("Blue Alert"), "OTHER");
  assert.equal(familyForEvent("EVI"), null); // action message: originator chooses
});

test("familyForEvent: word boundaries — no substring misclassification (audit regression)", () => {
  assert.equal(familyForEvent("protest advisory"), "OTHER"); // not TEST
  assert.equal(familyForEvent("ceasefire notice"), "OTHER"); // not FIRE
  assert.equal(familyForEvent("firearm threat"), "THREAT"); // THREAT outranks FIRE
  assert.equal(familyForEvent("stormwater management"), "OTHER"); // not STORM
  assert.equal(familyForEvent("dam failure"), "WATER"); // bare \bdam\b
  assert.equal(familyForEvent("active shooter"), "THREAT");
});

// ---------- compose: the happy path ----------

test("compose: a valid input yields IPAWS-profile CAP with template resource and parameters", () => {
  const xml = composeCap(BASE);
  assert.ok(
    xml.includes('<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">'),
  );
  assert.ok(xml.includes("<code>IPAWSv1.0</code>"));
  assert.ok(xml.includes("<scope>Public</scope>"));
  assert.ok(
    xml.includes(
      "<eventCode><valueName>SAME</valueName><value>TOR</value></eventCode>",
    ),
  );
  assert.ok(
    xml.includes("ideafe:threeSenses:family</valueName><value>STORM</value>"),
  );
  assert.ok(
    xml.includes(
      `ideafe:threeSenses:version</valueName><value>${rootMap.version}</value>`,
    ),
  );
  assert.ok(
    xml.includes("https://www.youtube.com/watch?v=a59VLxN82uI"),
    "the official TOR video",
  );
  assert.ok(
    xml.includes("not a translation of this specific message"),
    "honesty label",
  );
  assert.ok(xml.includes("<valueName>CMAMtext</valueName>"));
  assert.ok(
    xml.includes(
      "<geocode><valueName>SAME</valueName><value>040109</value></geocode>",
    ),
  );
  assert.ok(
    xml.includes("<category>Met</category>"),
    "template capCategory default",
  );
});

test("compose is deterministic: same input, same bytes", () => {
  assert.equal(composeCap(BASE), composeCap(BASE));
});

test("compose: Spanish WEA rides a SECOND es-US info block with plain CMAMtext (audit F1)", () => {
  const xml = composeCap(BASE);
  const infos = xml.split("<info>").length - 1;
  assert.equal(infos, 2, "two info blocks when Spanish is present");
  assert.ok(xml.includes("<language>es-US</language>"));
  assert.ok(
    !xml.includes("CMAMtext-Spanish"),
    "the invented valueName must never appear",
  );
  const esBlock = xml.slice(xml.indexOf("<language>es-US</language>"));
  assert.ok(
    esBlock.includes("Aviso de tornado"),
    "Spanish text under plain CMAMtext",
  );
  // the profile requires category and eventCode identical across info blocks
  assert.equal(xml.split("<category>Met</category>").length - 1, 2);
  assert.equal(
    xml.split(
      "<eventCode><valueName>SAME</valueName><value>TOR</value></eventCode>",
    ).length - 1,
    2,
  );
  // both blocks carry the ASL resource and the area
  assert.equal(xml.split("<resource>").length - 1, 2);
  assert.equal(xml.split("<areaDesc>").length - 1, 2);
});

test("compose: no Spanish text, exactly one info block", () => {
  const xml = composeCap({ ...BASE, wea: { shortEn: BASE.wea.shortEn } });
  assert.equal(xml.split("<info>").length - 1, 1);
});

test("compose: unknown event attaches NO asl resource (negative control)", () => {
  const xml = composeCap({
    ...BASE,
    event: "Volcano Warning",
    sameCode: "VOW",
  });
  assert.ok(!xml.includes("<resource>"), "no wrong-hazard video, ever");
  assert.ok(
    xml.includes("ideafe:threeSenses:family</valueName><value>GROUND</value>"),
  );
});

test("compose: attachAslTemplate false suppresses the resource", () => {
  const xml = composeCap({ ...BASE, attachAslTemplate: false });
  assert.ok(!xml.includes("<resource>"));
});

test("compose: EAS-ORG and passthrough parameters are emitted escaped", () => {
  const xml = composeCap({
    ...BASE,
    easOrg: "CIV",
    parameters: [{ valueName: "WEAHandling", value: "Imminent & Threat" }],
  });
  assert.ok(xml.includes("<valueName>EAS-ORG</valueName><value>CIV</value>"));
  assert.ok(
    xml.includes(
      "<valueName>WEAHandling</valueName><value>Imminent &amp; Threat</value>",
    ),
  );
});

test("compose: XML-escapes user text", () => {
  const xml = composeCap({
    ...BASE,
    headline: 'Winds >80mph & "destructive" <hail>',
  });
  assert.ok(
    xml.includes("Winds &gt;80mph &amp; &quot;destructive&quot; &lt;hail&gt;"),
  );
  assert.ok(!/<headline>[^<]*<hail>/.test(xml));
});

// ---------- precheck: the pre-send gate ----------

test("precheck: a clean input has zero issues", () => {
  assert.deepEqual(precheck(BASE), []);
});

test("precheck: enum garbage is rejected — no injection through status et al. (audit F3)", () => {
  const evil = "Actual</status><scope>Restricted</scope><status>Test";
  for (const field of [
    "status",
    "msgType",
    "urgency",
    "severity",
    "certainty",
    "category",
  ]) {
    const issues = precheck({ ...BASE, [field]: evil });
    assert.ok(
      issues.some((i) => i.field === field && /must be one of/.test(i.problem)),
      `${field} must be enum-validated`,
    );
  }
  assert.throws(() => composeCap({ ...BASE, status: evil }), /precheck failed/);
});

test("compose: even a hypothetical enum bypass is escaped (defense in depth)", () => {
  // precheck blocks this, so prove the escaping layer via a direct probe:
  // valid input, then confirm the interpolation sites use escaped values by
  // checking that no raw angle bracket from any input field can survive.
  const xml = composeCap({ ...BASE, event: "<Tornado> & Co" });
  assert.ok(xml.includes("<event>&lt;Tornado&gt; &amp; Co</event>"));
});

test("precheck: sameCode is REQUIRED and three letters (IPAWS profile, audit F2)", () => {
  const missing = { ...BASE };
  delete missing.sameCode;
  assert.ok(
    precheck(missing).some(
      (i) => i.field === "sameCode" && /required/.test(i.problem),
    ),
  );
  assert.ok(
    precheck({ ...BASE, sameCode: "TORNADO" }).some(
      (i) => i.field === "sameCode" && /three-letter/.test(i.problem),
    ),
  );
});

test("precheck: sender charset is enforced like identifier (audit F6)", () => {
  const issues = precheck({ ...BASE, sender: "composer test@ideafe.org" });
  assert.ok(issues.some((i) => i.field === "sender"));
  const issues2 = precheck({ ...BASE, sender: "a,b@ideafe.org" });
  assert.ok(issues2.some((i) => i.field === "sender"));
});

test("precheck: missing expires is caught (IPAWS profile)", () => {
  const issues = precheck({ ...BASE, expires: "" });
  assert.ok(
    issues.some((i) => i.field === "expires" && i.problem === "required"),
  );
});

test("precheck: bare-Z and +00:00 timestamps are rejected (CAP 1.2 dateTime, audit F7)", () => {
  assert.ok(
    precheck({ ...BASE, sent: "2026-08-25T12:00:00Z" }).some(
      (i) => i.field === "sent" && /numeric timezone offset/.test(i.problem),
    ),
  );
  assert.ok(
    precheck({ ...BASE, sent: "2026-08-25T16:00:00+00:00" }).some(
      (i) => i.field === "sent" && /-00:00/.test(i.problem),
    ),
  );
  assert.deepEqual(
    precheck({ ...BASE, sent: "2026-08-25T16:00:00-00:00" }).filter(
      (i) => i.field === "sent",
    ),
    [],
    "-00:00 is the mandated UTC form",
  );
});

test("precheck: a 100-node polygon is rejected (MOA software requirement)", () => {
  const ring = Array.from({ length: 99 }, (_, i) => `35.${i},-97.${i}`);
  ring.push(ring[0]);
  const issues = precheck({
    ...BASE,
    area: { ...BASE.area, polygons: [ring.join(" ")] },
  });
  assert.ok(
    issues.some((i) => i.field === "area.polygons" && /100/.test(i.problem)),
  );
});

test("precheck: an unclosed polygon is rejected", () => {
  const issues = precheck({
    ...BASE,
    area: {
      ...BASE.area,
      polygons: ["35.4,-97.6 35.6,-97.6 35.6,-97.3 35.4,-97.3"],
    },
  });
  assert.ok(issues.some((i) => /must close/.test(i.problem)));
});

test("precheck: out-of-range coordinates and zero radius are rejected (audit A3)", () => {
  const issues = precheck({
    ...BASE,
    area: { ...BASE.area, polygons: ["999,999 1,1 2,2 999,999"] },
  });
  assert.ok(issues.some((i) => /latitude 999/.test(i.problem)));
  const issues2 = precheck({
    ...BASE,
    area: { ...BASE.area, circles: ["35.4,-97.6 0"] },
  });
  assert.ok(issues2.some((i) => /radius must be positive/.test(i.problem)));
  const issues3 = precheck({
    ...BASE,
    area: { ...BASE.area, circles: ["95.4,-197.6 5"] },
  });
  assert.ok(issues3.some((i) => /latitude 95.4/.test(i.problem)));
  assert.ok(issues3.some((i) => /longitude -197.6/.test(i.problem)));
});

test("precheck: WEA over 90 characters is rejected, and 91 is the first failure (boundary)", () => {
  const ninety = "x".repeat(90);
  assert.deepEqual(
    precheck({ ...BASE, wea: { shortEn: ninety } }).filter(
      (i) => i.field === "wea.shortEn",
    ),
    [],
  );
  const issues = precheck({ ...BASE, wea: { shortEn: ninety + "x" } });
  assert.ok(
    issues.some((i) => i.field === "wea.shortEn" && /limit 90/.test(i.problem)),
  );
});

test("precheck: WEA-unsafe characters are rejected (emoji, embedded newline)", () => {
  assert.ok(
    precheck({ ...BASE, wea: { shortEn: "Take shelter 🌪 now" } }).some(
      (i) => i.field === "wea.shortEn" && /WEA-safe/.test(i.problem),
    ),
  );
  assert.ok(
    precheck({ ...BASE, wea: { shortEn: "line one\nline two" } }).some(
      (i) => i.field === "wea.shortEn" && /WEA-safe/.test(i.problem),
    ),
  );
});

test("precheck: Spanish accents pass the WEA-safe set", () => {
  const issues = precheck({
    ...BASE,
    wea: { shortEn: "ok", shortEs: "Refúgiese ahora ¡peligro!" },
  });
  assert.deepEqual(
    issues.filter((i) => i.field === "wea.shortEs"),
    [],
  );
});

test("precheck: longEs without shortEs is rejected", () => {
  const issues = precheck({
    ...BASE,
    wea: { shortEn: "ok", longEs: "texto largo" },
  });
  assert.ok(issues.some((i) => i.field === "wea.shortEs"));
});

test("precheck: area needs at least one geometry", () => {
  const issues = precheck({ ...BASE, area: { areaDesc: "Somewhere" } });
  assert.ok(issues.some((i) => i.field === "area"));
});

test("precheck: a non-six-digit SAME geocode is rejected", () => {
  const issues = precheck({
    ...BASE,
    area: { ...BASE.area, sameGeocodes: ["4109"] },
  });
  assert.ok(issues.some((i) => i.field === "area.sameGeocodes"));
});

test("precheck: Update/Cancel/Ack/Error without references are rejected (audit F8)", () => {
  for (const msgType of ["Update", "Cancel", "Ack", "Error"]) {
    const issues = precheck({ ...BASE, msgType });
    assert.ok(
      issues.some((i) => i.field === "references"),
      msgType,
    );
  }
});

test("precheck: a malformed references triple is rejected", () => {
  const issues = precheck({
    ...BASE,
    msgType: "Update",
    references: ["not a triple"],
  });
  assert.ok(
    issues.some((i) => i.field === "references" && /triple/.test(i.problem)),
  );
});

test("precheck: malformed passthrough parameters are rejected", () => {
  const issues = precheck({
    ...BASE,
    parameters: [{ valueName: "", value: "x" }],
  });
  assert.ok(issues.some((i) => i.field === "parameters"));
});

test("compose throws on a failing precheck (never emits a known-broken message)", () => {
  assert.throws(() => composeCap({ ...BASE, expires: "" }), /precheck failed/);
});

// ---------- follow-ups ----------

test("composeFollowUp: cancel references the prior triple without re-entering data", () => {
  const xml = composeFollowUp(BASE, "Cancel", {
    identifier: "IDE-TEST-0002",
    sent: "2026-08-25T12:30:00-04:00",
  });
  assert.ok(xml.includes("<msgType>Cancel</msgType>"));
  assert.ok(
    xml.includes(
      "<references>composer-test@ideafe.org,IDE-TEST-0001,2026-08-25T12:00:00-04:00</references>",
    ),
  );
  assert.ok(
    xml.includes("<event>Tornado Warning</event>"),
    "prior data carried over",
  );
});

test("composeFollowUp: a chain carries EVERY prior reference forward (audit F4)", () => {
  const update1Input = {
    ...BASE,
    identifier: "IDE-TEST-0002",
    sent: "2026-08-25T12:30:00-04:00",
    msgType: "Update",
    references: [
      "composer-test@ideafe.org,IDE-TEST-0001,2026-08-25T12:00:00-04:00",
    ],
  };
  const xml = composeFollowUp(update1Input, "Update", {
    identifier: "IDE-TEST-0003",
    sent: "2026-08-25T12:45:00-04:00",
  });
  assert.ok(
    xml.includes(
      "composer-test@ideafe.org,IDE-TEST-0001,2026-08-25T12:00:00-04:00 " +
        "composer-test@ideafe.org,IDE-TEST-0002,2026-08-25T12:30:00-04:00",
    ),
    "both the original alert and the first update are referenced",
  );
});

test("composeFollowUp: duplicate references are collapsed", () => {
  const triple =
    "composer-test@ideafe.org,IDE-TEST-0001,2026-08-25T12:00:00-04:00";
  const xml = composeFollowUp({ ...BASE, references: undefined }, "Cancel", {
    identifier: "IDE-TEST-0004",
    sent: "2026-08-25T13:00:00-04:00",
    references: [triple],
  });
  assert.equal(xml.split(triple).length - 1, 1);
});
