const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync('shopify-theme/locales/en.default.json', 'utf8'));

function getVal(obj, keyPath) {
  const parts = keyPath.split('.');
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== 'object') return undefined;
    cur = cur[p];
  }
  return cur;
}

function scanDir(dir) {
  let missing = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      missing = missing.concat(scanDir(full));
    } else if (ent.name.endsWith('.liquid')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.matchAll(/\{\{\s*'([^']+)'\s*\|\s*t\s*\}\}/g);
      for (const m of matches) {
        const key = m[1];
        if (getVal(en, key) === undefined) {
          missing.push({ file: full, key });
        }
      }
    }
  }
  return missing;
}

const missing = scanDir('shopify-theme');
console.log('Total missing keys:', missing.length);
const uniqueKeys = Array.from(new Set(missing.map(m => m.key)));
console.log(JSON.stringify(uniqueKeys, null, 2));
