import { chmodSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
chmodSync(
  join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "cli.js"),
  0o755,
);
