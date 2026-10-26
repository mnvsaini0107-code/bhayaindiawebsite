const fs = require('fs');
const path = require('path');

const zipPath = path.resolve(__dirname, '..', 'BHAYA-INDIA-SHOPIFY-THEME-FINAL.zip');

function parseZipEntries(buf) {
  const entries = [];
  let i = 0;
  while (i < buf.length - 4) {
    if (buf.readUInt32LE(i) === 0x04034b50) { // Local file header signature
      const fnLen = buf.readUInt16LE(i + 26);
      const extraLen = buf.readUInt16LE(i + 28);
      const compSize = buf.readUInt32LE(i + 18);
      const filename = buf.slice(i + 30, i + 30 + fnLen).toString('utf8');
      entries.push(filename);
      i += 30 + fnLen + extraLen + compSize;
    } else {
      i++;
    }
  }
  return entries;
}

function verify() {
  console.log('=== BHAYA INDIA SHOPIFY THEME ZIP VERIFICATION ===\n');

  // 1. ZIP exists
  const exists = fs.existsSync(zipPath);
  console.log(`1. ZIP exists: ${exists ? 'PASS' : 'FAIL'}`);
  if (!exists) process.exit(1);

  // 2. ZIP size < 50MB
  const stats = fs.statSync(zipPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  const sizePass = stats.size < 50 * 1024 * 1024;
  console.log(`2. ZIP size: ${sizeMB} MB (< 50 MB): ${sizePass ? 'PASS' : 'FAIL'}`);

  const buf = fs.readFileSync(zipPath);
  const entries = parseZipEntries(buf);
  console.log(`\nTotal files in ZIP: ${entries.length}`);

  // 3-7 Key files
  const keyFiles = [
    { num: 3, file: 'layout/theme.liquid' },
    { num: 4, file: 'config/settings_schema.json' },
    { num: 5, file: 'templates/index.json' },
    { num: 6, file: 'templates/product.json' },
    { num: 7, file: 'templates/collection.json' },
  ];

  keyFiles.forEach(({ num, file }) => {
    const present = entries.includes(file);
    console.log(`${num}. ${file} exists: ${present ? 'PASS' : 'FAIL'}`);
  });

  // 8. sections present
  const sectionFiles = entries.filter((e) => e.startsWith('sections/'));
  console.log(`8. sections are present (${sectionFiles.length} sections found): ${sectionFiles.length >= 10 ? 'PASS' : 'FAIL'}`);

  // 9. snippets present
  const snippetFiles = entries.filter((e) => e.startsWith('snippets/'));
  console.log(`9. snippets are present (${snippetFiles.length} snippets found): ${snippetFiles.length >= 4 ? 'PASS' : 'FAIL'}`);

  // 10-11 locales
  console.log(`10. locales/en.default.json exists: ${entries.includes('locales/en.default.json') ? 'PASS' : 'FAIL'}`);
  console.log(`11. locales/hi.json exists: ${entries.includes('locales/hi.json') ? 'PASS' : 'FAIL'}`);

  // 12. No .env files
  const envFiles = entries.filter((e) => e.toLowerCase().includes('.env'));
  console.log(`12. No .env files included: ${envFiles.length === 0 ? 'PASS' : 'FAIL'}`);

  // 13. No API keys or Shopify secrets
  // Scan text files in ZIP for secret tokens (e.g. shpat_, shpss_)
  const zipText = buf.toString('utf8');
  const hasSecrets = /shpat_[a-zA-Z0-9]+|shpss_[a-zA-Z0-9]+|NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN|VERCEL_OIDC_TOKEN/.test(zipText);
  console.log(`13. No API keys or Shopify secrets included: ${!hasSecrets ? 'PASS' : 'FAIL'}`);

  // 14. No node_modules
  const nodeModules = entries.filter((e) => e.includes('node_modules'));
  console.log(`14. No node_modules included: ${nodeModules.length === 0 ? 'PASS' : 'FAIL'}`);

  // 15. No .next folder
  const nextFolder = entries.filter((e) => e.includes('.next'));
  console.log(`15. No .next folder included: ${nextFolder.length === 0 ? 'PASS' : 'FAIL'}`);

  // 16. No unnecessary project files
  const rootDirs = [...new Set(entries.map((e) => e.split('/')[0]))];
  const allowedDirs = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
  const unexpected = rootDirs.filter((d) => !allowedDirs.includes(d));
  console.log(`16. Root directory structure: [${rootDirs.join(', ')}]`);
  console.log(`    No unnecessary project files at root: ${unexpected.length === 0 ? 'PASS' : 'FAIL'}`);

  console.log('\n=== VERIFICATION COMPLETE ===\n');
}

verify();
