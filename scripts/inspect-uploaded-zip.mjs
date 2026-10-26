import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const zipPath = "C:\\Users\\DELL\\Downloads\\WhatsApp Unknown 2026-10-16 at 7.27.11 AM.zip";
const outDir = path.resolve("scratch/uploaded_images_zip");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log("Extracting ZIP:", zipPath);
execSync(`powershell -Command "Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${outDir}' -Force"`);

const files = fs.readdirSync(outDir);
console.log(`\nExtracted ${files.length} files from user ZIP:`);
files.forEach(f => {
  const st = fs.statSync(path.join(outDir, f));
  console.log(`- ${f} (${st.size} bytes)`);
});
