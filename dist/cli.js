#!/usr/bin/env node
/**
 * three-senses — inspect and verify the vocabulary from a terminal.
 *
 *   three-senses list                 every family, one line each
 *   three-senses show FIRE            timeline, timer, and ASCII rhythm
 *   three-senses conformance          prove this SDK against the vectors
 *   three-senses log FIRE             a render log for conformance/validate.mjs
 *   three-senses templates            the FCC WEA template / ASL video map
 *   three-senses compose in.json      CAP 1.2 + IPAWS-profile XML from a
 *                                     JSON input ("-" reads stdin); errors
 *                                     list every precheck issue and exit 1
 */
import { readFileSync } from "node:fs";
import { composeCap, precheck, weaTemplates, } from "./compose.js";
import { STANDARD_VERSION, families, family, timeline, cycleMs, vibratePattern, renderLog, conformance, } from "./index.js";
function ascii(name, msPerChar = 100) {
    const t = timeline(name);
    if (t.steps.length === 0)
        return "(silence)";
    // On-intervals from the on/off pairs; a cell is lit when any interval
    // overlaps it, so a pulse shorter than one cell still shows.
    const intervals = [];
    for (let i = 0; i < t.steps.length; i += 2)
        intervals.push([t.steps[i].at, t.steps[i + 1].at]);
    let out = "";
    for (let ms = 0; ms < t.totalMs; ms += msPerChar) {
        const lit = intervals.some(([on, off]) => on < ms + msPerChar && off > ms);
        out += lit ? "█" : "·";
    }
    return out;
}
const [, , command, arg] = process.argv;
switch (command) {
    case "list": {
        console.log(`Three Senses Alerting Standard ${STANDARD_VERSION}`);
        for (const name of families()) {
            const f = family(name);
            console.log(`${name.padEnd(9)} ${String(cycleMs(name)).padStart(5)} ms  ${f.meaning}`);
        }
        break;
    }
    case "show": {
        const name = (arg ?? "").toUpperCase();
        const f = family(name); // throws with the R7 message on unknown names
        const t = timeline(name);
        console.log(`${name} — ${f.meaning}`);
        console.log(f.mimesis);
        console.log(ascii(name));
        console.log(`cycle ${t.totalMs} ms (trailing quiet included, R8) · ` +
            `vibrate [${vibratePattern(name).join(", ")}]` +
            (f.fixedLevel !== undefined
                ? ` · level capped at ${f.fixedLevel} (R6)`
                : ""));
        for (const s of t.steps)
            console.log(`  ${String(s.at).padStart(5)} ms ${s.event}`);
        break;
    }
    case "log": {
        const name = (arg ?? "").toUpperCase();
        console.log(JSON.stringify(renderLog(name), null, 2));
        break;
    }
    case "conformance": {
        const { pass, results } = conformance();
        for (const r of results) {
            console.log(`${r.pass ? "PASS" : "FAIL"} ${r.family} ${r.requirement}${r.detail ? ` — ${r.detail}` : ""}`);
        }
        console.log(pass ? "CONFORMANT" : "NOT CONFORMANT");
        process.exit(pass ? 0 : 1);
    }
    case "templates": {
        console.log(`FCC WEA template / ASL video map (compiled 2026-08-25)`);
        for (const t of weaTemplates()) {
            const codes = t.sameCodes.length
                ? t.sameCodes.join("/")
                : "(no SAME code)";
            const asl = t.asl ? t.asl.url : "NO ASL VIDEO PUBLISHED";
            console.log(`${t.name.padEnd(28)} ${codes.padEnd(16)} ${String(t.family ?? "(originator's)").padEnd(14)} ${asl}`);
        }
        break;
    }
    case "compose": {
        const raw = arg === "-" || arg === undefined
            ? readFileSync(0, "utf8")
            : readFileSync(arg, "utf8");
        let input;
        try {
            input = JSON.parse(raw);
        }
        catch (e) {
            console.error(`invalid JSON input: ${e instanceof Error ? e.message : String(e)}`);
            process.exit(1);
        }
        const issues = precheck(input);
        if (issues.length > 0) {
            for (const i of issues)
                console.error(`PRECHECK ${i.field}: ${i.problem}`);
            process.exit(1);
        }
        process.stdout.write(composeCap(input));
        break;
    }
    // eslint-disable-next-line no-fallthrough
    default: {
        console.log("usage: three-senses <list | show <FAMILY> | log <FAMILY> | conformance | templates | compose <in.json|->>");
        process.exit(command ? 2 : 0);
    }
}
