const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imgMatches = content.matchAll(/<img\b([^>]*)>/gi);
  for (const m of imgMatches) {
    const attrs = m[1];
    const hasWidth = /\bwidth\s*=/i.test(attrs);
    const hasHeight = /\bheight\s*=/i.test(attrs);
    if (!hasWidth || !hasHeight) {
      console.log(`Missing in ${filePath}:`, m[0].substring(0, 80));
    }
  }
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      scanDir(full);
    } else if (ent.name.endsWith('.liquid')) {
      checkFile(full);
    }
  }
}

scanDir('shopify-theme');
