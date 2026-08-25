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

test("the embedded map matches the published wea-asl-templates.json byte-for-byte", () => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(weaTemplates())),
    rootMap.templates,
  );
});

test("the map holds all 18 adopted templates plus the two ASL-only action videos", () => {
  assert.equal(rootMap.templates.length, 20);
  const withText = rootMap.templates.filter((t) => t.englishText);
  const withVideo = rootMap.templates.filter((t) => t.asl);
  assert.equal(withText.length, 18, "the adopted Appendix C set");
  assert.equal(withVideo.length, 18, "the published ASL video set");
  // the honestly-recorded mismatch: the two sets differ by exactly two each way
  const textNoVideo = rootMap.templates.filter((t) => t.englishText && !t.asl).map((t) => t.id);
  const videoNoText = rootMap.templates.filter((t) => !t.englishText && t.asl).map((t) => t.id);
  assert.deepEqual(textNoVideo.sort(), ["flash-flood-emergency", "tornado-emergency"]);
  assert.deepEqual(videoNoText.sort(), ["evacuation-immediate", "shelter-in-place-warning"]);
});

test("weaTemplateFor: TOR prefers the variant with a published video", () => {
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
});

test("familyForEvent: map first, crosswalk keywords second, OTHER floor", () => {
  assert.equal(familyForEvent("TOR"), "STORM");
  assert.equal(familyForEvent("TSW"), "WATER");
  assert.equal(familyForEvent("Volcano Warning"), "GROUND"); // crosswalk keyword
  assert.equal(familyForEvent("Blue Alert"), "OTHER"); // honest floor
  assert.equal(familyForEvent("EVI"), null); // action message: originator chooses
});

test("compose: a valid input yields IPAWS-profile CAP with template resource and parameters", () => {
  const xml = composeCap(BASE);
  assert.ok(xml.includes('<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">'));
  assert.ok(xml.includes("<code>IPAWSv1.0</code>"));
  assert.ok(xml.includes("<scope>Public</scope>"));
  assert.ok(xml.includes("<eventCode><valueName>SAME</valueName><value>TOR</value></eventCode>"));
  assert.ok(xml.includes("ideafe:threeSenses:family</valueName><value>STORM</value>"));
  assert.ok(xml.includes(`ideafe:threeSenses:version</valueName><value>${rootMap.version}</value>`));
  assert.ok(xml.includes("https://www.youtube.com/watch?v=HHs1gMK5r5w"), "the official TOR video");
  assert.ok(xml.includes("not a translation of this specific message"), "honesty label");
  assert.ok(xml.includes("<valueName>CMAMtext</valueName>"));
  assert.ok(xml.includes("<valueName>CMAMtext-Spanish</valueName>"));
  assert.ok(xml.includes("<geocode><valueName>SAME</valueName><value>040109</value></geocode>"));
});

test("compose is deterministic: same input, same bytes", () => {
  assert.equal(composeCap(BASE), composeCap(BASE));
});

test("compose: unknown event attaches NO asl resource (negative control)", () => {
  const xml = composeCap({ ...BASE, event: "Volcano Warning", sameCode: undefined });
  assert.ok(!xml.includes("<resource>"), "no wrong-hazard video, ever");
  assert.ok(xml.includes("ideafe:threeSenses:family</valueName><value>GROUND</value>"));
});

test("compose: attachAslTemplate false suppresses the resource", () => {
  const xml = composeCap({ ...BASE, attachAslTemplate: false });
  assert.ok(!xml.includes("<resource>"));
});

test("compose: XML-escapes user text", () => {
  const xml = composeCap({
    ...BASE,
    headline: 'Winds >80mph & "destructive" <hail>',
  });
  assert.ok(xml.includes("Winds &gt;80mph &amp; &quot;destructive&quot; &lt;hail&gt;"));
  assert.ok(!/<headline>[^<]*<hail>/.test(xml));
});

test("precheck: a clean input has zero issues", () => {
  assert.deepEqual(precheck(BASE), []);
});

test("precheck: missing expires is caught (IPAWS profile)", () => {
  const issues = precheck({ ...BASE, expires: "" });
  assert.ok(issues.some((i) => i.field === "expires" && i.problem === "required"));
});

test("precheck: bare-Z timestamps are rejected (IPAWS profile)", () => {
  const issues = precheck({ ...BASE, sent: "2026-08-25T12:00:00Z" });
  assert.ok(issues.some((i) => i.field === "sent" && /never bare Z/.test(i.problem)));
});

test("precheck: a 100-node polygon is rejected (MOA software requirement)", () => {
  const ring = Array.from({ length: 99 }, (_, i) => `35.${i},-97.${i}`);
  ring.push(ring[0]); // closed, 100 nodes
  const issues = precheck({ ...BASE, area: { ...BASE.area, polygons: [ring.join(" ")] } });
  assert.ok(issues.some((i) => i.field === "area.polygons" && /100/.test(i.problem)));
});

test("precheck: an unclosed polygon is rejected", () => {
  const issues = precheck({
    ...BASE,
    area: { ...BASE.area, polygons: ["35.4,-97.6 35.6,-97.6 35.6,-97.3 35.4,-97.3"] },
  });
  assert.ok(issues.some((i) => /must close/.test(i.problem)));
});

test("precheck: WEA over 90 characters is rejected, and 91 is the first failure (boundary)", () => {
  const ninety = "x".repeat(90);
  assert.deepEqual(
    precheck({ ...BASE, wea: { shortEn: ninety } }).filter((i) => i.field === "wea.shortEn"),
    [],
  );
  const issues = precheck({ ...BASE, wea: { shortEn: ninety + "x" } });
  assert.ok(issues.some((i) => i.field === "wea.shortEn" && /limit 90/.test(i.problem)));
});

test("precheck: WEA-unsafe characters are rejected", () => {
  const issues = precheck({ ...BASE, wea: { shortEn: "Take shelter 🌪 now" } });
  assert.ok(issues.some((i) => i.field === "wea.shortEn" && /WEA-safe/.test(i.problem)));
});

test("precheck: Spanish accents pass the WEA-safe set", () => {
  const issues = precheck({ ...BASE, wea: { shortEn: "ok", shortEs: "Refúgiese ahora ¡peligro!" } });
  assert.deepEqual(issues.filter((i) => i.field === "wea.shortEs"), []);
});

test("precheck: area needs at least one geometry", () => {
  const issues = precheck({ ...BASE, area: { areaDesc: "Somewhere" } });
  assert.ok(issues.some((i) => i.field === "area"));
});

test("precheck: a non-six-digit SAME geocode is rejected", () => {
  const issues = precheck({ ...BASE, area: { ...BASE.area, sameGeocodes: ["4109"] } });
  assert.ok(issues.some((i) => i.field === "area.sameGeocodes"));
});

test("precheck: Update without references is rejected", () => {
  const issues = precheck({ ...BASE, msgType: "Update" });
  assert.ok(issues.some((i) => i.field === "references"));
});

test("compose throws on a failing precheck (never emits a known-broken message)", () => {
  assert.throws(() => composeCap({ ...BASE, expires: "" }), /precheck failed/);
});

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
  assert.ok(xml.includes("<event>Tornado Warning</event>"), "prior data carried over");
});

test("every published video URL is a well-formed YouTube watch URL", () => {
  for (const t of rootMap.templates) {
    if (!t.asl) continue;
    assert.match(t.asl.url, /^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{6,}$/);
    assert.ok(t.asl.url.endsWith(t.asl.youtubeId));
  }
});
