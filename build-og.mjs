import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const templatePath = resolve(ROOT, "og.template.svg");
const screenshotPath = resolve(ROOT, "og-ui.jpg");
const svgOutPath = resolve(ROOT, "og.svg");
const pngOutPath = resolve(ROOT, "og.png");

const template = readFileSync(templatePath, "utf8");
const screenshotB64 = readFileSync(screenshotPath).toString("base64");
const dataUri = `data:image/jpeg;base64,${screenshotB64}`;

if (!template.includes("{{OG_UI_DATA_URI}}")) {
  throw new Error("og.template.svg missing {{OG_UI_DATA_URI}} placeholder");
}

const svg = template.replace("{{OG_UI_DATA_URI}}", dataUri);
writeFileSync(svgOutPath, svg);

execFileSync("sips", ["-s", "format", "png", svgOutPath, "--out", pngOutPath], {
  stdio: "inherit",
});

console.log(`Wrote ${pngOutPath}`);
