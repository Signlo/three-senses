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
    asl: {
        youtubeId: string;
        url: string;
    } | null;
    /** Present on escalation variants (e.g. Tornado Emergency escalates Tornado
     *  Warning). A bare SAME-code lookup prefers the base template — the
     *  originator opts INTO an escalation by name. */
    variant?: string;
    /** Present on demo-era stubs that carry neither an adopted text nor an
     *  official video; explains why. */
    note?: string;
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
 * FCC-template map first, then the standard's section 4 crosswalk keywords
 * (word-bounded: "protest" is not a TEST, "ceasefire" is not a FIRE).
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
 * Runtime-validates every closed-list field — the CLI feeds parsed JSON,
 * where TypeScript's compile-time unions protect nothing.
 */
export declare function precheck(input: ComposeInput): PrecheckIssue[];
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
export declare function composeCap(input: ComposeInput): string;
/**
 * Update or cancel WITHOUT re-entering the data (a FEMA MOA capability):
 * takes the prior input, carries the prior message's own references
 * forward (the IPAWS profile: ALL related unexpired messages MUST be
 * referenced), appends the prior message's triple, and applies the changed
 * fields on top. The caller supplies the new identifier and sent time.
 * Note: `next` fields shallow-replace — a partial `next.area` replaces the
 * WHOLE area (precheck then catches a geometry-less one).
 */
export declare function composeFollowUp(prior: ComposeInput, msgType: "Update" | "Cancel", next: Partial<ComposeInput> & {
    identifier: string;
    sent: string;
}): string;
