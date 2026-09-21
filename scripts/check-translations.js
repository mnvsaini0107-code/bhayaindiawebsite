// scripts/check-translations.js
// Automated coverage and parity check between en.ts and hi.ts

const fs = require("fs");
const path = require("path");

function extractKeys(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const keys = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // match key: "value" or key: `value`
    const match = line.match(/^([a-zA-Z0-9_]+)\s*:\s*["`'](.*)["`'],?$/);
    if (match) {
      const key = match[1];
      const val = match[2];
      keys[key] = val;
    }
  }
  return keys;
}

const enPath = path.join(__dirname, "..", "src", "locales", "en.ts");
const hiPath = path.join(__dirname, "..", "src", "locales", "hi.ts");

const enKeys = extractKeys(enPath);
const hiKeys = extractKeys(hiPath);

const enKeyList = Object.keys(enKeys);
const hiKeyList = Object.keys(hiKeys);

console.log(`[PARITY CHECK] Total English keys: ${enKeyList.length}`);
console.log(`[PARITY CHECK] Total Hindi keys: ${hiKeyList.length}`);

const missingInHindi = enKeyList.filter((k) => !(k in hiKeys));
const missingInEnglish = hiKeyList.filter((k) => !(k in enKeys));
const emptyInHindi = Object.entries(hiKeys).filter(([k, v]) => !v || v.trim() === "").map(([k]) => k);
const emptyInEnglish = Object.entries(enKeys).filter(([k, v]) => !v || v.trim() === "").map(([k]) => k);

let hasError = false;

if (missingInHindi.length > 0) {
  console.error("❌ Keys present in en.ts but missing in hi.ts:", missingInHindi);
  hasError = true;
}

if (missingInEnglish.length > 0) {
  console.error("❌ Keys present in hi.ts but missing in en.ts:", missingInEnglish);
  hasError = true;
}

if (emptyInHindi.length > 0) {
  console.error("❌ Empty translations in hi.ts:", emptyInHindi);
  hasError = true;
}

if (emptyInEnglish.length > 0) {
  console.error("❌ Empty translations in en.ts:", emptyInEnglish);
  hasError = true;
}

if (!hasError) {
  console.log("✅ 100% Localization Dictionary Parity Verified! No missing or empty keys.");
  process.exit(0);
} else {
  console.error("❌ Translation parity check failed.");
  process.exit(1);
}
