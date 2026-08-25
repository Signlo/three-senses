/**
 * @ideafe/three-senses/compose — the Three Senses Alert Composer core.
 *
 * Origination-side: builds a CAP 1.2 alert XML document that
 *  - complies with the OASIS CAP v1.2 USA IPAWS Profile v1.0 essentials
 *    (`<code>IPAWSv1.0</code>`, required `<expires>`, required SAME
 *    `<eventCode>`, Public scope),
 *  - attaches the FCC's official ASL WEA template video for the event as a
 *    CAP `<resource>` (never a video IDE produced; never presented as a
 *    translation of the specific message),
 *  - carries Three Senses metadata as namespaced CAP `<parameter>` blocks
 *    (CAP-PROFILE.md, the origination annex),
 *  - carries WEA 90/360-character texts as the IPAWS CMAMtext /
 *    CMAMlongtext parameter convention — Spanish in a SECOND `<info>`
 *    block with `<language>es-US</language>` and plain CMAMtext valueNames,
 *    which is how IPAWS actually delivers Spanish WEA (NWS CAP v1.2
 *    guidance); a "-Spanish" valueName suffix does not exist and would be
 *    silently dropped.
 *
 * Test-environment software: `precheck()` is the pre-send error check the
 * FEMA MOA requires; nothing here transmits. Submission transport (signed
 * SOAP to IPAWS-OPEN TDL) arrives with the COG and certificates and lives
 * outside this pure module.
 *
 * Security: this module is fed parsed JSON at runtime (the CLI), where
 * TypeScript's unions do not exist — so every closed-list field is
 * runtime-validated in `precheck()` AND escaped at the interpolation site.
 * Neither layer trusts the other.
 *
 * Determinism: the caller supplies `identifier` and `sent`; this module
 * never reads a clock, so composed XML is byte-reproducible in tests.
 */
import { WEA_ASL_DATA } from "./data.js";
import type { FamilyName } from "./index.js";

export type CapStatus = "Actual" | "Exercise" | "System" | "Test" | "Draft";
export type CapMsgType = "Alert" | "Update" | "Cancel" | "Ack" | "Error";
export type CapUrgency =
  | "Immediate"
  | "Expected"
  | "Future"
  | "Past"
  | "Unknown";
export type CapSeverity =
  | "Extreme"
  | "Severe"
  | "Moderate"
  | "Minor"
  | "Unknown";
export type CapCertainty =
  | "Observed"
  | "Likely"
  | "Possible"
  | "Unlikely"
  | "Unknown";
export type CapCategory =
  | "Geo"
  | "Met"
  | "Safety"
  | "Security"
  | "Rescue"
  | "Fire"
  | "Health"
  | "Env"
  | "Transport"
  | "Infra"
  | "CBRNE"
  | "Other";

// Runtime twins of the closed lists above (CAP 1.2 xsd enumerations).
const STATUSES = ["Actual", "Exercise", "System", "Test", "Draft"] as const;
const MSG_TYPES = ["Alert", "Update", "Cancel", "Ack", "Error"] as const;
const URGENCIES = [
  "Immediate",
  "Expected",
  "Future",
  "Past",
  "Unknown",
] as const;
const SEVERITIES = [
  "Extreme",
  "Severe",
  "Moderate",
  "Minor",
  "Unknown",
] as const;
const CERTAINTIES = [
  "Observed",
  "Likely",
  "Possible",
  "Unlikely",
  "Unknown",
] as const;
const CATEGORIES = [
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
] as const;
const FAMILIES = [
  "GROUND",
  "WATER",
  "STORM",
  "FIRE",
  "THREAT",
  "TEST",
  "OTHER",
  "ALL_CLEAR",
] as const;

export interface WeaTexts {
  /** 90-character WEA short text, English (required when wea is present). */
  shortEn: string;
  /** 360-character WEA long text, English. */
  longEn?: string;
  /** 90-character WEA short text, Spanish (emitted in an es-US info block). */
  shortEs?: string;
  /** 360-character WEA long text, Spanish. */
  longEs?: string;
}

export interface ComposeArea {
  areaDesc: string;
  /** Each polygon: "lat,lon lat,lon ..." closed ring, fewer than 100 nodes. */
  polygons?: readonly string[];
  /** Each circle: "lat,lon radiusKm". */
  circles?: readonly string[];
  /** SAME geocodes (six digits); emitted as the IPAWS SAME convention. */
  sameGeocodes?: readonly string[];
}

export interface CapParameter {
  valueName: string;
  value: string;
}

export interface ComposeInput {
  /** Caller-supplied unique id (determinism: no clock, no randomness here). */
  identifier: string;
  sender: string;
  /** ISO 8601 with a numeric timezone offset (UTC is -00:00, never Z). */
  sent: string;
  status: CapStatus;
  msgType?: CapMsgType;
  /** "sender,identifier,sent" triples of the messages this one references. */
  references?: readonly string[];
  category?: CapCategory;
  /** Human event name; also a FCC-template lookup key. */
  event: string;
  /** SAME event code (TOR, FFW, ...). REQUIRED by the IPAWS profile. */
  sameCode: string;
  urgency: CapUrgency;
  severity: CapSeverity;
  certainty: CapCertainty;
  expires: string;
  senderName?: string;
  headline?: string;
  description?: string;
  instruction?: string;
  web?: string;
  language?: string;
  area: ComposeArea;
  wea?: WeaTexts;
  /** SAME organization code; REQUIRED by the profile for EAS/HazCollect. */
  easOrg?: string;
  /** Additional CAP parameters, passed through verbatim (escaped). */
  parameters?: readonly CapParameter[];
  /** Override the crosswalk (an action message follows its causing hazard). */
  family?: FamilyName;
  /** Attach the FCC ASL template video resource when one exists (default true). */
  attachAslTemplate?: boolean;
}

export interface AslTemplate {
  id: string;
  name: string;
  sameCodes: readonly string[];
  family: FamilyName | null;
  /** CAP category conventional for this event (Met, Geo, Health, ...). */
  capCategory?: CapCategory;
  englishText: string | null;
  asl: { youtubeId: string; url: string } | null;
}

const TEMPLATES = WEA_ASL_DATA.templates as readonly AslTemplate[];

/** Every FCC WEA template in the map, in published order. */
export function weaTemplates(): readonly AslTemplate[] {
  return TEMPLATES;
}

/**
 * The FCC template for a SAME code or event name. When several templates
 * share a code (TOR covers Tornado Warning and its Emergency escalation),
 * the one WITH a published ASL video wins — attaching the official video
 * beats matching the escalation variant that has none. Returns null on no
 * match: never guess a template (a wrong-hazard ASL video is worse than
 * none).
 */
export function weaTemplateFor(sameCodeOrEvent: string): AslTemplate | null {
  const q = (sameCodeOrEvent ?? "").trim().toUpperCase();
  if (!q) return null;
  const byCode = TEMPLATES.filter((t) =>
    t.sameCodes.some((c) => c.toUpperCase() === q),
  );
  if (byCode.length > 0) return byCode.find((t) => t.asl) ?? byCode[0];
  const byName = TEMPLATES.filter((t) => t.name.toUpperCase() === q);
  if (byName.length > 0) return byName.find((t) => t.asl) ?? byName[0];
  return null;
}

/**
 * The Three Senses hazard family for a SAME code or event name, via the
 * FCC-template map first, then the standard's section 4 crosswalk keywords
 * (word-bounded: "protest" is not a TEST, "ceasefire" is not a FIRE).
 * Falls back to OTHER (honest attention without false specificity) — and
 * to null only for action messages whose family the originator must choose.
 */
export function familyForEvent(sameCodeOrEvent: string): FamilyName | null {
  const t = weaTemplateFor(sameCodeOrEvent);
  if (t) return t.family;
  const q = (sameCodeOrEvent ?? "").toLowerCase();
  if (!q.trim()) return "OTHER";
  if (/\b(earthquake|landslide|avalanche|volcano|volcanic)\b/.test(q))
    return "GROUND";
  if (/\b(flood|tsunami|storm surge|dam)\b/.test(q)) return "WATER";
  if (/\b(tornado|hurricane|cyclone|storm|wind|blizzard|squall)\b/.test(q))
    return "STORM";
  if (
    /\b(threat|civil|law enforcement|amber|missing|chemical|radiological|hazardous|attack|shooter)\b/.test(
      q,
    )
  )
    return "THREAT";
  if (/\bfire\b/.test(q)) return "FIRE";
  if (/\b(test|drill|exercise)\b/.test(q)) return "TEST";
  return "OTHER";
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Printable ASCII plus the Latin-1 letters and punctuation Spanish needs
// (á í ó ú are NOT in GSM-7 basic, but WEA Spanish rides UCS-2, so they are
// deliverable); emoji, control characters (newlines included: a WEA text is
// one line), and non-Latin scripts are rejected. Conservative until FEMA's
// Interface Design Guidance states the exact prohibited set — then this
// regex tracks the Guidance.
const WEA_SAFE_RE = /^[\x20-\x7E¡-ÿ]*$/;

const ISO_WITH_OFFSET_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;
const CAP_ID_UNSAFE_RE = /[\s,<&]/;

export interface PrecheckIssue {
  field: string;
  problem: string;
}

function checkEnum(
  issues: PrecheckIssue[],
  field: string,
  value: unknown,
  allowed: readonly string[],
  optional = false,
): void {
  if (value === undefined || value === null) {
    if (!optional) issues.push({ field, problem: "required" });
    return;
  }
  if (typeof value !== "string" || !allowed.includes(value))
    issues.push({ field, problem: `must be one of ${allowed.join(", ")}` });
}

function checkLatLon(
  issues: PrecheckIssue[],
  field: string,
  pair: string,
): void {
  const [lat, lon] = pair.split(",").map(Number);
  if (!(lat >= -90 && lat <= 90))
    issues.push({ field, problem: `latitude ${lat} outside [-90, 90]` });
  if (!(lon >= -180 && lon <= 180))
    issues.push({ field, problem: `longitude ${lon} outside [-180, 180]` });
}

/**
 * The pre-send error check (a FEMA MOA "Associated Software Requirements"
 * capability): every issue found, empty when the input composes cleanly.
 * Runtime-validates every closed-list field — the CLI feeds parsed JSON,
 * where TypeScript's compile-time unions protect nothing.
 */
export function precheck(input: ComposeInput): PrecheckIssue[] {
  const issues: PrecheckIssue[] = [];
  const need = (field: keyof ComposeInput) => {
    const v = input[field];
    if (
      v === undefined ||
      v === null ||
      (typeof v === "string" && v.trim() === "")
    )
      issues.push({ field: String(field), problem: "required" });
  };
  need("identifier");
  need("sender");
  need("sent");
  need("event");
  need("expires");
  checkEnum(issues, "status", input.status, STATUSES);
  checkEnum(issues, "msgType", input.msgType, MSG_TYPES, true);
  checkEnum(issues, "urgency", input.urgency, URGENCIES);
  checkEnum(issues, "severity", input.severity, SEVERITIES);
  checkEnum(issues, "certainty", input.certainty, CERTAINTIES);
  checkEnum(issues, "category", input.category, CATEGORIES, true);
  checkEnum(issues, "family", input.family, FAMILIES, true);
  // CAP 3.2.1: identifier AND sender exclude spaces, commas, < and & — and
  // the references triple format depends on it.
  for (const f of ["identifier", "sender"] as const) {
    const v = input[f];
    if (v && CAP_ID_UNSAFE_RE.test(v))
      issues.push({
        field: f,
        problem: "no spaces, commas, ampersands, or angle brackets",
      });
  }
  // IPAWS profile: eventCode with valueName SAME is REQUIRED, three letters.
  if (
    input.sameCode === undefined ||
    input.sameCode === null ||
    input.sameCode === ""
  )
    issues.push({
      field: "sameCode",
      problem: "required (IPAWS profile: SAME eventCode)",
    });
  else if (!/^[A-Z]{3}$/.test(input.sameCode))
    issues.push({
      field: "sameCode",
      problem: "a three-letter SAME code (e.g. TOR)",
    });
  if (input.easOrg !== undefined && !/^[A-Z]{2,4}$/.test(input.easOrg))
    issues.push({
      field: "easOrg",
      problem: "a SAME organization code (e.g. CIV, WXR, EAS, PEP)",
    });
  for (const f of ["sent", "expires"] as const) {
    const v = input[f];
    if (!v) continue;
    if (!ISO_WITH_OFFSET_RE.test(v)) {
      issues.push({
        field: f,
        problem:
          "CAP 1.2 dateTime: ISO 8601 with a numeric timezone offset (alphabetic designators like Z MUST NOT be used)",
      });
    } else if (v.endsWith("+00:00")) {
      issues.push({
        field: f,
        problem: "CAP 1.2 dateTime: UTC MUST be written -00:00, not +00:00",
      });
    }
  }
  const mt = input.msgType ?? "Alert";
  if (
    (mt === "Update" || mt === "Cancel" || mt === "Ack" || mt === "Error") &&
    !(input.references && input.references.length > 0)
  )
    issues.push({
      field: "references",
      problem: `${mt} must reference the prior message(s)`,
    });
  for (const r of input.references ?? []) {
    if (!/^[^\s,]+,[^\s,]+,[^\s,]+$/.test(r))
      issues.push({
        field: "references",
        problem: `"${r}" is not a sender,identifier,sent triple`,
      });
  }
  if (!input.area || !input.area.areaDesc?.trim())
    issues.push({ field: "area.areaDesc", problem: "required" });
  const hasGeometry =
    (input.area?.polygons?.length ?? 0) > 0 ||
    (input.area?.circles?.length ?? 0) > 0 ||
    (input.area?.sameGeocodes?.length ?? 0) > 0;
  if (!hasGeometry)
    issues.push({
      field: "area",
      problem: "at least one polygon, circle, or SAME geocode",
    });
  for (const p of input.area?.polygons ?? []) {
    const nodes = p.trim().split(/\s+/);
    if (nodes.length >= 100)
      issues.push({
        field: "area.polygons",
        problem: `polygon has ${nodes.length} nodes (limit: fewer than 100)`,
      });
    if (nodes.length >= 4 && nodes[0] !== nodes[nodes.length - 1])
      issues.push({
        field: "area.polygons",
        problem: "polygon ring must close (first point repeated last)",
      });
    if (nodes.length > 0 && nodes.length < 4)
      issues.push({
        field: "area.polygons",
        problem: "a polygon needs at least 4 points (closed ring)",
      });
    for (const n of nodes) {
      if (!/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(n)) {
        issues.push({
          field: "area.polygons",
          problem: 'points must be "lat,lon" pairs',
        });
      } else {
        checkLatLon(issues, "area.polygons", n);
      }
    }
  }
  for (const c of input.area?.circles ?? []) {
    const m = /^(-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/.exec(
      c.trim(),
    );
    if (!m) {
      issues.push({
        field: "area.circles",
        problem: '"lat,lon radiusKm" required',
      });
    } else {
      checkLatLon(issues, "area.circles", m[1]);
      if (Number(m[2]) <= 0)
        issues.push({
          field: "area.circles",
          problem: "radius must be positive",
        });
    }
  }
  for (const g of input.area?.sameGeocodes ?? []) {
    if (!/^\d{6}$/.test(g))
      issues.push({
        field: "area.sameGeocodes",
        problem: `"${g}" is not a six-digit SAME code`,
      });
  }
  if (input.wea) {
    const w = input.wea;
    const checks: Array<[string, string | undefined, number]> = [
      ["wea.shortEn", w.shortEn, 90],
      ["wea.longEn", w.longEn, 360],
      ["wea.shortEs", w.shortEs, 90],
      ["wea.longEs", w.longEs, 360],
    ];
    if (!w.shortEn?.trim())
      issues.push({
        field: "wea.shortEn",
        problem: "required when wea is present",
      });
    if (w.longEs && !w.shortEs)
      issues.push({
        field: "wea.shortEs",
        problem: "required when wea.longEs is present",
      });
    for (const [field, text, max] of checks) {
      if (text === undefined) continue;
      if (text.length > max)
        issues.push({
          field,
          problem: `${text.length} characters (limit ${max})`,
        });
      if (!WEA_SAFE_RE.test(text))
        issues.push({
          field,
          problem: "contains characters outside the WEA-safe set",
        });
    }
  }
  for (const p of input.parameters ?? []) {
    if (!p?.valueName?.trim() || p.value === undefined || p.value === null)
      issues.push({
        field: "parameters",
        problem: "each parameter needs valueName and value",
      });
  }
  return issues;
}

function parameter(valueName: string, value: string): string {
  return `    <parameter><valueName>${esc(valueName)}</valueName><value>${esc(value)}</value></parameter>\n`;
}

interface InfoRender {
  language: string;
  weaShort?: string;
  weaLong?: string;
}

/**
 * Compose the CAP 1.2 + IPAWS-profile alert XML. Throws when `precheck`
 * finds issues (compose never emits a message it knows is broken); call
 * `precheck` first for the full list.
 *
 * Spanish WEA text produces a second `<info>` block, identical except for
 * `<language>es-US</language>` and the Spanish CMAM texts — the IPAWS
 * delivery mechanism for Spanish (the profile requires category and
 * eventCode to be identical across info blocks, and they are: the blocks
 * are rendered from one template).
 */
export function composeCap(input: ComposeInput): string {
  const issues = precheck(input);
  if (issues.length > 0) {
    throw new Error(
      `compose precheck failed: ${issues.map((i) => `${i.field}: ${i.problem}`).join("; ")}`,
    );
  }
  const msgType = input.msgType ?? "Alert";
  const template =
    input.attachAslTemplate === false
      ? null
      : (weaTemplateFor(input.sameCode) ?? weaTemplateFor(input.event));
  const family: FamilyName =
    input.family ?? template?.family ?? familyForEvent(input.event) ?? "OTHER";
  const category = input.category ?? template?.capCategory ?? "Safety";

  const renderInfo = ({ language, weaShort, weaLong }: InfoRender): string => {
    let x = `  <info>\n`;
    x += `    <language>${esc(language)}</language>\n`;
    x += `    <category>${esc(category)}</category>\n`;
    x += `    <event>${esc(input.event)}</event>\n`;
    x += `    <urgency>${esc(input.urgency)}</urgency>\n`;
    x += `    <severity>${esc(input.severity)}</severity>\n`;
    x += `    <certainty>${esc(input.certainty)}</certainty>\n`;
    x += `    <eventCode><valueName>SAME</valueName><value>${esc(input.sameCode)}</value></eventCode>\n`;
    x += `    <expires>${input.expires}</expires>\n`;
    if (input.senderName)
      x += `    <senderName>${esc(input.senderName)}</senderName>\n`;
    if (input.headline)
      x += `    <headline>${esc(input.headline)}</headline>\n`;
    if (input.description)
      x += `    <description>${esc(input.description)}</description>\n`;
    if (input.instruction)
      x += `    <instruction>${esc(input.instruction)}</instruction>\n`;
    if (input.web) x += `    <web>${esc(input.web)}</web>\n`;
    if (weaShort) x += parameter("CMAMtext", weaShort);
    if (weaLong) x += parameter("CMAMlongtext", weaLong);
    if (input.easOrg) x += parameter("EAS-ORG", input.easOrg);
    for (const p of input.parameters ?? [])
      x += parameter(p.valueName, p.value);
    x += parameter("ideafe:threeSenses:family", family);
    x += parameter("ideafe:threeSenses:version", WEA_ASL_DATA.version);
    if (template?.asl) {
      x += `    <resource>\n`;
      x += `      <resourceDesc>${esc(
        `American Sign Language video: what a ${template.name} means (official FCC WEA template video; not a translation of this specific message)`,
      )}</resourceDesc>\n`;
      x += `      <mimeType>text/html</mimeType>\n`;
      x += `      <uri>${esc(template.asl.url)}</uri>\n`;
      x += `    </resource>\n`;
    }
    x += `    <area>\n`;
    x += `      <areaDesc>${esc(input.area.areaDesc)}</areaDesc>\n`;
    for (const p of input.area.polygons ?? [])
      x += `      <polygon>${esc(p)}</polygon>\n`;
    for (const c of input.area.circles ?? [])
      x += `      <circle>${esc(c)}</circle>\n`;
    for (const g of input.area.sameGeocodes ?? [])
      x += `      <geocode><valueName>SAME</valueName><value>${esc(g)}</value></geocode>\n`;
    x += `    </area>\n`;
    x += `  </info>\n`;
    return x;
  };

  let x = '<?xml version="1.0" encoding="UTF-8"?>\n';
  x += '<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">\n';
  x += `  <identifier>${esc(input.identifier)}</identifier>\n`;
  x += `  <sender>${esc(input.sender)}</sender>\n`;
  x += `  <sent>${input.sent}</sent>\n`;
  x += `  <status>${esc(input.status)}</status>\n`;
  x += `  <msgType>${esc(msgType)}</msgType>\n`;
  x += `  <scope>Public</scope>\n`;
  x += `  <code>IPAWSv1.0</code>\n`;
  if (input.references && input.references.length > 0)
    x += `  <references>${esc(input.references.join(" "))}</references>\n`;
  x += renderInfo({
    language: input.language ?? "en-US",
    weaShort: input.wea?.shortEn,
    weaLong: input.wea?.longEn,
  });
  if (input.wea?.shortEs) {
    x += renderInfo({
      language: "es-US",
      weaShort: input.wea.shortEs,
      weaLong: input.wea.longEs,
    });
  }
  x += `</alert>\n`;
  return x;
}

/**
 * Update or cancel WITHOUT re-entering the data (a FEMA MOA capability):
 * takes the prior input, carries the prior message's own references
 * forward (the IPAWS profile: ALL related unexpired messages MUST be
 * referenced), appends the prior message's triple, and applies the changed
 * fields on top. The caller supplies the new identifier and sent time.
 * Note: `next` fields shallow-replace — a partial `next.area` replaces the
 * WHOLE area (precheck then catches a geometry-less one).
 */
export function composeFollowUp(
  prior: ComposeInput,
  msgType: "Update" | "Cancel",
  next: Partial<ComposeInput> & { identifier: string; sent: string },
): string {
  const triple = `${prior.sender},${prior.identifier},${prior.sent}`;
  const references = [
    ...(prior.references ?? []),
    ...(next.references ?? []),
    triple,
  ].filter((r, i, all) => all.indexOf(r) === i);
  const merged: ComposeInput = { ...prior, ...next, msgType, references };
  return composeCap(merged);
}
