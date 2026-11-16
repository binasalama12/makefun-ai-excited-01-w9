import { readFileSync, writeFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function sha256Hex(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

function main(): void {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const sourcePath = join(scriptDir, "entry.png");
  const requested = process.argv[2];
  const outputPath = requested ? resolve(requested) : join(scriptDir, "out.png");

  const sourceBytes = readFileSync(sourcePath);
  const sourceHash = sha256Hex(sourceBytes);

  writeFileSync(outputPath, sourceBytes);

  const outputBytes = readFileSync(outputPath);
  const outputHash = sha256Hex(outputBytes);
  const outputSize = statSync(outputPath).size;
  const matches = sourceHash === outputHash;

  console.log(`output: ${outputPath}`);
  console.log(`size: ${outputSize} bytes`);
  console.log(`sha256 output: ${outputHash}`);
  console.log(`sha256 source (entry.png): ${sourceHash}`);
  console.log(`match: ${matches ? "yes" : "no"}`);
}

main();
