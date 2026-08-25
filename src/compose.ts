/**
 * @ideafe/three-senses/compose — the Three Senses Alert Composer core.
 *
 * Origination-side: builds a CAP 1.2 alert XML document that
 *  - complies with the OASIS CAP v1.2 USA IPAWS Profile v1.0 essentials
 *    (`<code>IPAWSv1.0</code>`, required `<expires>`, Public scope),
 *  - attaches the FCC's official ASL WEA template video for the event as a
 *    CAP `<resource>` (never a video IDE produced; never presented as a
 *    translation of the specific message),
 *  - carries Three Senses metadata as namespaced CAP `<parameter>` blocks
 *    (CAP-PROFILE.md, the origination annex),
 *  - carries WEA 90/360-character English and Spanish texts as the IPAWS
 *    CMAMtext / CMAMlongtext parameter convention.
 *
 * Test-environment software: `precheck()` is the pre-send error check the
 * FEMA MOA requires; nothing here transmits. Submission transport (signed
 * SOAP to IPAWS-OPEN TDL) arrives with the COG and certificates and lives
 * outside this pure module.
 *
 * Determinism: the caller supplies `identifier` and `sent`; this module
 * never reads a clock, so composed XML is byte-reproducible in tests.
 */
import { WEA_ASL_DATA } from "./data.js";
import type { FamilyName } from "./index.js";

export type CapStatus = "Actual" | "Exercise" | "System" | "Test" | "Draft";
export type CapMsgType = "Alert" | "Update" | "Cancel" | "Ack" | "Error";
export type CapUrgency = "Immediate" | "Expected" | "Future" | "Past" | "Unknown";
export type CapSeverity = "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown";
export type CapCertainty = "Observed" | "Likely" | "Possible" | "Unlikely" | "Unknown";
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

export interface WeaTexts {
  /** 90-character WEA short text, English (required when wea is present). */
  shortEn: string;
  /** 360-character WEA long text, English. */
  longEn?: string;
  /** 90-character WEA short text, Spanish. */
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

export interface ComposeInput {
  /** Caller-supplied unique id (determinism: no clock, no randomness here). */
  identifier: string;
  sender: string;
  /** ISO 8601 with timezone offset, e.g. 2026-08-25T12:00:00-04:00. */
  sent: string;
  status: CapStatus;
  msgType?: CapMsgType;
  /** "sender,identifier,sent" triples of the messages this one references. */
  references?: readonly string[];
  category?: CapCategory;
  /** Human event name; also the FCC-template lookup key when no sameCode. */
  event: string;
  /** SAME event code (TOR, FFW, ...); drives template + family lookup. */
  sameCode?: string;
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
  const q = sameCodeOrEvent.trim().toUpperCase();
  if (!q) return null;
  const byCode = TEMPLATES.filter((t) => t.sameCodes.some((c) => c.toUpperCase() === q));
  if (byCode.length > 0) return byCode.find((t) => t.asl) ?? byCode[0];
  const byName = TEMPLATES.filter((t) => t.name.toUpperCase() === q);
  if (byName.length > 0) return byName.find((t) => t.asl) ?? byName[0];
  return null;
}

/**
 * The Three Senses hazard family for a SAME code or event name, via the
 * FCC-template map first, then the standard's section 4 crosswalk keywords.
 * Falls back to OTHER (honest attention without false specificity) — and
 * to null only for action messages whose family the originator must choose.
 */
export function familyForEvent(sameCodeOrEvent: string): FamilyName | null {
  const t = weaTemplateFor(sameCodeOrEvent);
  if (t) return t.family;
  const q = sameCodeOrEvent.toLowerCase();
  if (/earthquake|landslide|avalanche|volcan/.test(q)) return "GROUND";
  if (/flood|tsunami|storm surge|dam /.test(q)) return "WATER";
  if (/tornado|hurricane|cyclone|storm|wind|blizzard|squall/.test(q)) return "STORM";
  if (/fire/.test(q)) return "FIRE";
  if (/civil|law enforcement|amber|missing|chemical|radiolog|hazardous|threat|attack/.test(q))
    return "THREAT";
  if (/test|drill|exercise/.test(q)) return "TEST";
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
// deliverable); emoji, control characters, and non-Latin scripts are
// rejected. Conservative until FEMA's Interface Design Guidance states the
// exact prohibited set — then this regex tracks the Guidance.
// eslint-disable-next-line no-control-regex
const WEA_SAFE_RE = /^[\x0A\x0D\x20-\x7E¡-ÿ]*$/;

const ISO_WITH_OFFSET_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[+-]\d{2}:\d{2}|Z)$/;

export interface PrecheckIssue {
  field: string;
  problem: string;
}

/**
 * The pre-send error check (a FEMA MOA "Associated Software Requirements"
 * capability): every issue found, empty when the input composes cleanly.
 * CAP timestamps: the IPAWS profile forbids bare "Z"; use a numeric offset.
 */
export function precheck(input: ComposeInput): PrecheckIssue[] {
  const issues: PrecheckIssue[] = [];
  const need = (field: keyof ComposeInput) => {
    const v = input[field];
    if (v === undefined || v === null || (typeof v === "string" && v.trim() === ""))
      issues.push({ field: String(field), problem: "required" });
  };
  need("identifier");
  need("sender");
  need("sent");
  need("status");
  need("event");
  need("urgency");
  need("severity");
  need("certainty");
  need("expires");
  if (input.identifier && /[\s,<&]/.test(input.identifier))
    issues.push({ field: "identifier", problem: "no spaces, commas, ampersands, or angle brackets" });
  for (const f of ["sent", "expires"] as const) {
    const v = input[f];
    if (v && !ISO_WITH_OFFSET_RE.test(v))
      issues.push({ field: f, problem: "ISO 8601 with timezone offset required" });
    if (v && v.endsWith("Z"))
      issues.push({ field: f, problem: "IPAWS profile: numeric offset, never bare Z" });
  }
  const mt = input.msgType ?? "Alert";
  if ((mt === "Update" || mt === "Cancel") && !(input.references && input.references.length > 0))
    issues.push({ field: "references", problem: `${mt} must reference the prior message` });
  if (!input.area || !input.area.areaDesc?.trim())
    issues.push({ field: "area.areaDesc", problem: "required" });
  const hasGeometry =
    (input.area?.polygons?.length ?? 0) > 0 ||
    (input.area?.circles?.length ?? 0) > 0 ||
    (input.area?.sameGeocodes?.length ?? 0) > 0;
  if (!hasGeometry)
    issues.push({ field: "area", problem: "at least one polygon, circle, or SAME geocode" });
  for (const p of input.area?.polygons ?? []) {
    const nodes = p.trim().split(/\s+/);
    if (nodes.length >= 100)
      issues.push({ field: "area.polygons", problem: `polygon has ${nodes.length} nodes (limit: fewer than 100)` });
    if (nodes.length >= 4 && nodes[0] !== nodes[nodes.length - 1])
      issues.push({ field: "area.polygons", problem: "polygon ring must close (first point repeated last)" });
    if (nodes.length > 0 && nodes.length < 4)
      issues.push({ field: "area.polygons", problem: "a polygon needs at least 4 points (closed ring)" });
    if (nodes.some((n) => !/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(n)))
      issues.push({ field: "area.polygons", problem: 'points must be "lat,lon" pairs' });
  }
  for (const c of input.area?.circles ?? []) {
    if (!/^-?\d+(\.\d+)?,-?\d+(\.\d+)?\s+\d+(\.\d+)?$/.test(c.trim()))
      issues.push({ field: "area.circles", problem: '"lat,lon radiusKm" required' });
  }
  for (const g of input.area?.sameGeocodes ?? []) {
    if (!/^\d{6}$/.test(g))
      issues.push({ field: "area.sameGeocodes", problem: `"${g}" is not a six-digit SAME code` });
  }
  if (input.wea) {
    const w = input.wea;
    const checks: Array<[string, string | undefined, number]> = [
      ["wea.shortEn", w.shortEn, 90],
      ["wea.longEn", w.longEn, 360],
      ["wea.shortEs", w.shortEs, 90],
      ["wea.longEs", w.longEs, 360],
    ];
    if (!w.shortEn?.trim()) issues.push({ field: "wea.shortEn", problem: "required when wea is present" });
    for (const [field, text, max] of checks) {
      if (text === undefined) continue;
      if (text.length > max) issues.push({ field, problem: `${text.length} characters (limit ${max})` });
      if (!WEA_SAFE_RE.test(text))
        issues.push({ field, problem: "contains characters outside the WEA-safe set" });
    }
  }
  if (input.family) {
    const known = ["GROUND", "WATER", "STORM", "FIRE", "THREAT", "TEST", "OTHER", "ALL_CLEAR"];
    if (!known.includes(input.family))
      issues.push({ field: "family", problem: `unknown family "${input.family}"` });
  }
  return issues;
}

function parameter(valueName: string, value: string): string {
  return `    <parameter><valueName>${esc(valueName)}</valueName><value>${esc(value)}</value></parameter>\n`;
}

/**
 * Compose the CAP 1.2 + IPAWS-profile alert XML. Throws when `precheck`
 * finds issues (compose never emits a message it knows is broken); call
 * `precheck` first for the full list.
 */
export function composeCap(input: ComposeInput): string {
  const issues = precheck(input);
  if (issues.length > 0) {
    throw new Error(
      `compose precheck failed: ${issues.map((i) => `${i.field}: ${i.problem}`).join("; ")}`,
    );
  }
  const msgType = input.msgType ?? "Alert";
  const lang = input.language ?? "en-US";
  const template =
    input.attachAslTemplate === false ? null : weaTemplateFor(input.sameCode ?? input.event);
  const family = input.family ?? familyForEvent(input.sameCode ?? input.event) ?? "OTHER";

  let x = '<?xml version="1.0" encoding="UTF-8"?>\n';
  x += '<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">\n';
  x += `  <identifier>${esc(input.identifier)}</identifier>\n`;
  x += `  <sender>${esc(input.sender)}</sender>\n`;
  x += `  <sent>${input.sent}</sent>\n`;
  x += `  <status>${input.status}</status>\n`;
  x += `  <msgType>${msgType}</msgType>\n`;
  x += `  <scope>Public</scope>\n`;
  x += `  <code>IPAWSv1.0</code>\n`;
  if (input.references && input.references.length > 0)
    x += `  <references>${esc(input.references.join(" "))}</references>\n`;
  x += `  <info>\n`;
  x += `    <language>${esc(lang)}</language>\n`;
  x += `    <category>${input.category ?? "Safety"}</category>\n`;
  x += `    <event>${esc(input.event)}</event>\n`;
  x += `    <urgency>${input.urgency}</urgency>\n`;
  x += `    <severity>${input.severity}</severity>\n`;
  x += `    <certainty>${input.certainty}</certainty>\n`;
  if (input.sameCode) {
    x += `    <eventCode><valueName>SAME</valueName><value>${esc(input.sameCode)}</value></eventCode>\n`;
  }
  x += `    <expires>${input.expires}</expires>\n`;
  if (input.senderName) x += `    <senderName>${esc(input.senderName)}</senderName>\n`;
  if (input.headline) x += `    <headline>${esc(input.headline)}</headline>\n`;
  if (input.description) x += `    <description>${esc(input.description)}</description>\n`;
  if (input.instruction) x += `    <instruction>${esc(input.instruction)}</instruction>\n`;
  if (input.web) x += `    <web>${esc(input.web)}</web>\n`;
  if (input.wea) {
    x += parameter("CMAMtext", input.wea.shortEn);
    if (input.wea.longEn) x += parameter("CMAMlongtext", input.wea.longEn);
    if (input.wea.shortEs) x += parameter("CMAMtext-Spanish", input.wea.shortEs);
    if (input.wea.longEs) x += parameter("CMAMlongtext-Spanish", input.wea.longEs);
  }
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
  for (const p of input.area.polygons ?? []) x += `      <polygon>${esc(p)}</polygon>\n`;
  for (const c of input.area.circles ?? []) x += `      <circle>${esc(c)}</circle>\n`;
  for (const g of input.area.sameGeocodes ?? [])
    x += `      <geocode><valueName>SAME</valueName><value>${esc(g)}</value></geocode>\n`;
  x += `    </area>\n`;
  x += `  </info>\n`;
  x += `</alert>\n`;
  return x;
}

/**
 * Update or cancel WITHOUT re-entering the data (a FEMA MOA capability):
 * takes the prior input, stamps the reference triple, and applies only the
 * changed fields. The caller supplies the new identifier and sent time.
 */
export function composeFollowUp(
  prior: ComposeInput,
  msgType: "Update" | "Cancel",
  next: Partial<ComposeInput> & { identifier: string; sent: string },
): string {
  const merged: ComposeInput = {
    ...prior,
    ...next,
    msgType,
    references: [
      ...(next.references ?? []),
      `${prior.sender},${prior.identifier},${prior.sent}`,
    ],
  };
  return composeCap(merged);
}
