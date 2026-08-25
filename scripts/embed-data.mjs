// Regenerates src/data.ts from the two normative JSON artifacts at the repo
// root. The SDK embeds them (instead of reading files at runtime) so it works
// identically in browsers, bundlers, and Node — and a test asserts the embed
// matches the JSON byte-for-byte, so the SDK can never drift from the
// published standard.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const vocabulary = JSON.parse(readFileSync(join(root, "vocabulary.json"), "utf8"));
const vectors = JSON.parse(readFileSync(join(root, "conformance", "vectors.json"), "utf8"));
const weaAsl = JSON.parse(readFileSync(join(root, "wea-asl-templates.json"), "utf8"));

const banner = `// GENERATED FILE — do not edit. Run \`npm run embed\` to regenerate from
// vocabulary.json, conformance/vectors.json, and wea-asl-templates.json, the\n// normative artifacts.
`;

writeFileSync(
  join(root, "src", "data.ts"),
  banner +
    `export const VOCABULARY_DATA = ${JSON.stringify(vocabulary, null, 2)} as const;\n\n` +
    `export const VECTORS_DATA = ${JSON.stringify(vectors, null, 2)} as const;\n\n` +
    `export const WEA_ASL_DATA = ${JSON.stringify(weaAsl, null, 2)};\n`,
);
console.log(
  "embedded vocabulary", vocabulary.version,
  "vectors", vectors.standardVersion,
  "wea-asl map", weaAsl.version,
);
