import type { FamilyName } from "./index.js";
export type CapStatus = "Actual" | "Exercise" | "System" | "Test" | "Draft";
export type CapMsgType = "Alert" | "Update" | "Cancel" | "Ack" | "Error";
export type CapUrgency = "Immediate" | "Expected" | "Future" | "Past" | "Unknown";
export type CapSeverity = "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown";
export type CapCertainty = "Observed" | "Likely" | "Possible" | "Unlikely" | "Unknown";
export type CapCategory = "Geo" | "Met" | "Safety" | "Security" | "Rescue" | "Fire" | "Health" | "Env" | "Transport" | "Infra" | "CBRNE" | "Other";
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
    asl: {
        youtubeId: string;
        url: string;
    } | null;
}
/** Every FCC WEA template in the map, in published order. */
export declare function weaTemplates(): readonly AslTemplate[];
/**
 * The FCC template for a SAME code or event name. When several templates
 * share a code (TOR covers Tornado Warning and its Emergency escalation),
 * the one WITH a published ASL video wins — attaching the official video
 * beats matching the escalation variant that has none. Returns null on no
 * match: never guess a template (a wrong-hazard ASL video is worse than
 * none).
 */
export declare function weaTemplateFor(sameCodeOrEvent: string): AslTemplate | null;
/**
 * The Three Senses hazard family for a SAME code or event name, via the
 * FCC-template map first, then the standard's section 4 crosswalk keywords.
 * Falls back to OTHER (honest attention without false specificity) — and
 * to null only for action messages whose family the originator must choose.
 */
export declare function familyForEvent(sameCodeOrEvent: string): FamilyName | null;
export interface PrecheckIssue {
    field: string;
    problem: string;
}
/**
 * The pre-send error check (a FEMA MOA "Associated Software Requirements"
 * capability): every issue found, empty when the input composes cleanly.
 * CAP timestamps: the IPAWS profile forbids bare "Z"; use a numeric offset.
 */
export declare function precheck(input: ComposeInput): PrecheckIssue[];
/**
 * Compose the CAP 1.2 + IPAWS-profile alert XML. Throws when `precheck`
 * finds issues (compose never emits a message it knows is broken); call
 * `precheck` first for the full list.
 */
export declare function composeCap(input: ComposeInput): string;
/**
 * Update or cancel WITHOUT re-entering the data (a FEMA MOA capability):
 * takes the prior input, stamps the reference triple, and applies only the
 * changed fields. The caller supplies the new identifier and sent time.
 */
export declare function composeFollowUp(prior: ComposeInput, msgType: "Update" | "Cancel", next: Partial<ComposeInput> & {
    identifier: string;
    sent: string;
}): string;
