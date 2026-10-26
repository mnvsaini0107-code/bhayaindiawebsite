const fs = require('fs');
const path = require('path');

const themeDir = path.resolve(__dirname, '..', 'shopify-theme');
const templatesDir = path.resolve(themeDir, 'templates');
const templateFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));

console.log(`Checking all ${templateFiles.length} JSON templates against section schemas...\n`);

let totalErrors = 0;

templateFiles.forEach(f => {
  const fullPath = path.join(templatesDir, f);
  let json;
  try {
    json = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (e) {
    console.error(`ERROR: JSON syntax error in ${f}:`, e.message);
    totalErrors++;
    return;
  }

  if (!json.sections) return;

  for (const [secId, secDef] of Object.entries(json.sections)) {
    const type = secDef.type;
    const liquidPath = path.resolve(themeDir, 'sections', `${type}.liquid`);
    if (!fs.existsSync(liquidPath)) {
      console.error(`[${f}] Section file ${type}.liquid does not exist!`);
      totalErrors++;
      continue;
    }

    const content = fs.readFileSync(liquidPath, 'utf8');
    const match = content.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
    if (!match) continue;

    let schema;
    try {
      schema = JSON.parse(match[1].trim());
    } catch (e) {
      console.error(`[${f}] Schema JSON error in ${type}.liquid:`, e.message);
      totalErrors++;
      continue;
    }

    const schemaSettingsMap = new Map();
    (schema.settings || []).forEach(s => {
      schemaSettingsMap.set(s.id, s);
    });

    const providedSettings = secDef.settings || {};
    for (const [k, v] of Object.entries(providedSettings)) {
      if (!schemaSettingsMap.has(k)) {
        console.error(`[${f}] Section "${secId}" (${type}) setting "${k}" is provided in JSON but NOT declared in schema!`);
        totalErrors++;
      } else {
        const s = schemaSettingsMap.get(k);
        if (s.type === 'range') {
          if (s.step) {
            const rem = (v - s.min) % s.step;
            if (rem !== 0) {
              console.error(`[${f}] Section "${secId}" (${type}) value ${v} for range "${k}" does not match step ${s.step} (min: ${s.min})!`);
              totalErrors++;
            }
          }
        }
      }
    }
  }
});

console.log(`\nCompleted audit of all templates. Total discrepancy errors: ${totalErrors}`);
