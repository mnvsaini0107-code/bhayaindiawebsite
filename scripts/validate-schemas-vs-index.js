const fs = require('fs');
const path = require('path');

const themeDir = path.resolve(__dirname, '..', 'shopify-theme');
const indexJsonPath = path.resolve(themeDir, 'templates/index.json');
const index = JSON.parse(fs.readFileSync(indexJsonPath, 'utf8'));

console.log('Validating templates/index.json against section schemas...\n');

let totalErrors = 0;

for (const [secId, secDef] of Object.entries(index.sections)) {
  const type = secDef.type;
  const liquidPath = path.resolve(themeDir, 'sections', `${type}.liquid`);
  if (!fs.existsSync(liquidPath)) {
    console.error(`ERROR: Section file ${type}.liquid does not exist!`);
    totalErrors++;
    continue;
  }

  const content = fs.readFileSync(liquidPath, 'utf8');
  const match = content.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
  if (!match) {
    console.warn(`WARNING: ${type}.liquid has no schema block!`);
    continue;
  }

  let schema;
  try {
    schema = JSON.parse(match[1].trim());
  } catch (e) {
    console.error(`ERROR: Invalid schema in ${type}.liquid:`, e.message);
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
      console.error(`[${secId} (${type})] Setting "${k}" is provided in index.json but NOT declared in schema!`);
      totalErrors++;
    } else {
      const s = schemaSettingsMap.get(k);
      if (s.type === 'range') {
        if (s.step) {
          const rem = (v - s.min) % s.step;
          if (rem !== 0) {
            console.error(`[${secId} (${type})] Value ${v} for range "${k}" does not match step ${s.step} (min: ${s.min})!`);
            totalErrors++;
          }
        }
      }
    }
  }
}

console.log(`\nValidation complete. Total discrepancy errors: ${totalErrors}`);
