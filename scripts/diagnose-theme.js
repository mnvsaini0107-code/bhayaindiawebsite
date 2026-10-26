const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const themeDir = path.resolve(rootDir, 'shopify-theme');
const templatesDir = path.resolve(themeDir, 'templates');
const sectionsDir = path.resolve(themeDir, 'sections');
const snippetsDir = path.resolve(themeDir, 'snippets');
const assetsDir = path.resolve(themeDir, 'assets');
const localesDir = path.resolve(themeDir, 'locales');

console.log('====================================================');
console.log('BHAYA INDIA SHOPIFY THEME DEEP FORENSIC DIAGNOSTIC');
console.log('====================================================\n');

let issues = [];

// 1. Check all JSON templates
const templateFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));
console.log(`Checking ${templateFiles.length} JSON templates...`);

templateFiles.forEach(f => {
  const filePath = path.join(templatesDir, f);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);

    if (json.sections) {
      Object.entries(json.sections).forEach(([key, sec]) => {
        if (!sec.type) {
          issues.push({ file: `templates/${f}`, issue: `Section "${key}" is missing "type"` });
          return;
        }
        const liquidPath = path.join(sectionsDir, `${sec.type}.liquid`);
        if (!fs.existsSync(liquidPath)) {
          issues.push({ file: `templates/${f}`, issue: `Section type "${sec.type}" does not exist in sections/ (${sec.type}.liquid)` });
        }
      });
    }

    if (json.order) {
      json.order.forEach(ord => {
        if (!json.sections || !json.sections[ord]) {
          issues.push({ file: `templates/${f}`, issue: `order references section "${ord}" which is not defined in sections` });
        }
      });
    }
  } catch (err) {
    issues.push({ file: `templates/${f}`, issue: `JSON syntax error: ${err.message}` });
  }
});

// 2. Check all Liquid sections for missing snippet references or broken syntax
const sectionFiles = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.liquid'));
console.log(`Checking ${sectionFiles.length} Liquid sections...`);

sectionFiles.forEach(sf => {
  const content = fs.readFileSync(path.join(sectionsDir, sf), 'utf8');

  // Check render / include calls
  const renderMatches = content.matchAll(/{%\s*(?:render|include)\s+['"]([^'"]+)['"]/g);
  for (const match of renderMatches) {
    const snippetName = match[1];
    const snippetFile = path.join(snippetsDir, `${snippetName}.liquid`);
    if (!fs.existsSync(snippetFile)) {
      issues.push({ file: `sections/${sf}`, issue: `Renders missing snippet "${snippetName}" (${snippetName}.liquid)` });
    }
  }

  // Check section schema syntax
  const schemaMatch = content.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
  if (schemaMatch) {
    try {
      JSON.parse(schemaMatch[1].trim());
    } catch (e) {
      issues.push({ file: `sections/${sf}`, issue: `Invalid JSON schema in section: ${e.message}` });
    }
  }

  // Check for React / Next.js remnants
  if (content.includes('className=') || content.includes('import ') || content.includes('export default') || content.includes('from "next/')) {
    issues.push({ file: `sections/${sf}`, issue: `Contains React/Next.js syntax remnants (className, import, etc.)` });
  }
});

// 3. Check layout/theme.liquid
console.log('Checking layout/theme.liquid...');
const themeLiquid = fs.readFileSync(path.join(themeDir, 'layout', 'theme.liquid'), 'utf8');
const layoutRenderMatches = themeLiquid.matchAll(/{%\s*(?:render|include|section)\s+['"]([^'"]+)['"]/g);
for (const match of layoutRenderMatches) {
  const item = match[1];
  const isSection = match[0].includes('section');
  const dir = isSection ? sectionsDir : snippetsDir;
  if (!fs.existsSync(path.join(dir, `${item}.liquid`))) {
    issues.push({ file: 'layout/theme.liquid', issue: `References missing ${isSection ? 'section' : 'snippet'} "${item}"` });
  }
}

// 4. Check asset references in Liquid files
console.log('Checking asset references in Liquid files...');
const allLiquidFiles = [
  ...sectionFiles.map(f => path.join(sectionsDir, f)),
  ...fs.readdirSync(snippetsDir).filter(f => f.endsWith('.liquid')).map(f => path.join(snippetsDir, f)),
  path.join(themeDir, 'layout', 'theme.liquid')
];

allLiquidFiles.forEach(lf => {
  const relPath = path.relative(themeDir, lf);
  const content = fs.readFileSync(lf, 'utf8');

  // Match e.g. {{ 'xyz.jpg' | asset_url }}
  const assetMatches = content.matchAll(/['"]([^'"]+\.[a-zA-Z0-9]+)['"]\s*\|\s*asset_url/g);
  for (const m of assetMatches) {
    const assetName = m[1];
    const assetPath = path.join(assetsDir, assetName);
    if (!fs.existsSync(assetPath)) {
      issues.push({ file: relPath, issue: `References missing asset "${assetName}"` });
    }
  }
});

// 5. Check locales
console.log('Checking locales...');
['en.default.json', 'hi.json'].forEach(lf => {
  const locPath = path.join(localesDir, lf);
  if (!fs.existsSync(locPath)) {
    issues.push({ file: `locales/${lf}`, issue: `Missing locale file` });
  } else {
    try {
      JSON.parse(fs.readFileSync(locPath, 'utf8'));
    } catch (e) {
      issues.push({ file: `locales/${lf}`, issue: `Invalid JSON in locale file: ${e.message}` });
    }
  }
});

console.log('\n--- DIAGNOSTIC RESULTS ---');
if (issues.length === 0) {
  console.log('SUCCESS: No code-level missing files, broken asset links, or JSON errors found.');
} else {
  console.log(`FOUND ${issues.length} ISSUE(S):`);
  issues.forEach((iss, idx) => {
    console.log(`[${idx + 1}] ${iss.file}: ${iss.issue}`);
  });
}
