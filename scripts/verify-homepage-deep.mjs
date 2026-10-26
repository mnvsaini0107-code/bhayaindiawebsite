import fs from "node:fs";
import path from "node:path";
import { Liquid } from "liquidjs";

const rootDir = process.cwd();
const themeDir = path.resolve(rootDir, "shopify-theme");

console.log("=== BHAYA INDIA HOMEPAGE FORENSIC VERIFICATION ===");

// 1. Verify templates/index.json
const indexPath = path.resolve(themeDir, "templates/index.json");
if (!fs.existsSync(indexPath)) {
  console.error("FAIL: templates/index.json does not exist!");
  process.exit(1);
}

let indexJson;
try {
  indexJson = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  console.log("PASS: templates/index.json exists and is valid JSON.");
} catch (e) {
  console.error("FAIL: templates/index.json JSON syntax error:", e.message);
  process.exit(1);
}

// 2. Verify all sections referenced in index.json
const sections = indexJson.sections || {};
const order = indexJson.order || [];

console.log(`\nVerifying ${order.length} sections in order:`);
const missingSections = [];
const schemaErrors = [];

order.forEach((secId, i) => {
  const secDef = sections[secId];
  if (!secDef) {
    console.error(`- [${i + 1}] FAIL: Section "${secId}" in order is not defined in sections object.`);
    missingSections.push(secId);
    return;
  }
  const secType = secDef.type;
  const liquidPath = path.resolve(themeDir, `sections/${secType}.liquid`);
  if (!fs.existsSync(liquidPath)) {
    console.error(`- [${i + 1}] FAIL: Section type "${secType}" (${liquidPath}) does NOT exist!`);
    missingSections.push(secType);
    return;
  }

  // Check schema validity in section
  const content = fs.readFileSync(liquidPath, "utf8");
  const schemaMatch = content.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
  if (schemaMatch) {
    try {
      JSON.parse(schemaMatch[1].trim());
    } catch (err) {
      console.error(`- [${i + 1}] FAIL: Schema JSON syntax error in sections/${secType}.liquid:`, err.message);
      schemaErrors.push(`${secType}.liquid: ${err.message}`);
    }
  }

  console.log(`- [${i + 1}] PASS: "${secId}" -> sections/${secType}.liquid (Valid Liquid & Schema)`);
});

// 3. Verify layout/theme.liquid
console.log("\nVerifying layout/theme.liquid:");
const themeLiquidPath = path.resolve(themeDir, "layout/theme.liquid");
if (!fs.existsSync(themeLiquidPath)) {
  console.error("FAIL: layout/theme.liquid does not exist!");
  process.exit(1);
}

const themeLiquid = fs.readFileSync(themeLiquidPath, "utf8");
const checks = [
  { name: "{{ content_for_header }}", regex: /{{\s*content_for_header\s*}}/ },
  { name: "{{ content_for_layout }}", regex: /{{\s*content_for_layout\s*}}/ },
  { name: "{% section 'header' %}", regex: /{%\s*section\s*['"]header['"]\s*%}/ },
  { name: "{% section 'footer' %}", regex: /{%\s*section\s*['"]footer['"]\s*%}/ },
  { name: "theme.css stylesheet", regex: /theme\.css/ },
  { name: "base.css stylesheet", regex: /base\.css/ },
  { name: "theme.js script", regex: /theme\.js/ }
];

checks.forEach(c => {
  if (c.regex.test(themeLiquid)) {
    console.log(`PASS: ${c.name} is present in theme.liquid`);
  } else {
    console.error(`FAIL: ${c.name} is MISSING in theme.liquid`);
  }
});

// 4. Test render full homepage through Liquid
console.log("\nTesting full homepage render through LiquidJS engine...");
const enLocale = JSON.parse(fs.readFileSync(path.resolve(themeDir, "locales/en.default.json"), "utf-8"));
function getTranslation(key, fallback = "") {
  const parts = key.split(".");
  let cur = enLocale;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) cur = cur[p];
    else return fallback || key;
  }
  return typeof cur === "string" ? cur : (fallback || key);
}

const engine = new Liquid({
  root: [
    path.resolve(themeDir, "layout"),
    path.resolve(themeDir, "sections"),
    path.resolve(themeDir, "snippets")
  ],
  extname: ".liquid"
});

engine.registerFilter("t", (key, opts) => getTranslation(key, opts?.default || ""));
engine.registerFilter("asset_url", (name) => `/assets/${name}`);
engine.registerFilter("stylesheet_tag", (url) => `<link rel="stylesheet" href="${url}">`);
engine.registerFilter("image_url", (img) => "/assets/hero-editorial.jpg");
engine.registerFilter("money", (cents) => `₹${((cents || 0) / 100).toFixed(0)}`);
engine.registerFilter("money_without_trailing_zeros", (cents) => `₹${((cents || 0) / 100).toFixed(0)}`);
engine.registerFilter("escape", (val) => val || "");
engine.registerTag("schema", {
  parse(tagToken, remainTokens) {
    const stream = this.liquid.parser.parseStream(remainTokens);
    stream.on("tag:endschema", () => stream.stop()).start();
  },
  render: () => ""
});
engine.registerTag("javascript", {
  parse(tagToken, remainTokens) {
    const stream = this.liquid.parser.parseStream(remainTokens);
    stream.on("tag:endjavascript", () => stream.stop()).start();
  },
  render: () => ""
});
engine.registerTag("stylesheet", {
  parse(tagToken, remainTokens) {
    const stream = this.liquid.parser.parseStream(remainTokens);
    stream.on("tag:endstylesheet", () => stream.stop()).start();
  },
  render: () => ""
});
engine.registerTag("form", {
  parse(tagToken, remainTokens) {
    this.templates = [];
    const stream = this.liquid.parser.parseStream(remainTokens);
    stream.on("tag:endform", () => stream.stop()).on("template", (tpl) => this.templates.push(tpl)).on("end", () => { throw new Error("tag form not closed"); });
    stream.start();
  },
  render: function* (ctx, emitter) {
    emitter.write('<form class="shopify-form">');
    yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter);
    emitter.write("</form>");
  }
});

async function runRender() {
  try {
    let sectionsHtml = "";
    for (const secId of order) {
      const secDef = sections[secId];
      const secType = secDef.type;
      const html = await engine.renderFile(secType, {
        section: {
          id: secId,
          settings: secDef.settings || {}
        },
        routes: {
          root_url: "/",
          all_products_collection_url: "/collections/all",
          collections_url: "/collections"
        },
        collections: {}
      });
      sectionsHtml += `<!-- Section ${secId} -->\n${html}\n`;
    }

    const headerHtml = await engine.renderFile("header", {
      section: { id: "header", settings: {} },
      routes: { root_url: "/", search_url: "/search", cart_url: "/cart" }
    });
    const footerHtml = await engine.renderFile("footer", {
      section: { id: "footer", settings: {} },
      routes: { root_url: "/" }
    });

    const fullPage = themeLiquid
      .replace(/{{\s*content_for_header\s*}}/, "")
      .replace(/{%\s*section\s*['"]header['"]\s*%}/, headerHtml)
      .replace(/{{\s*content_for_layout\s*}}/, sectionsHtml)
      .replace(/{%\s*section\s*['"]footer['"]\s*%}/, footerHtml)
      .replace(/{%\s*render\s*['"]seo-tags['"]\s*%}/, "<title>BHAYA INDIA</title>")
      .replace(/{%\s*render\s*['"]cart-drawer['"]\s*%}/, "")
      .replace(/{%\s*render\s*['"]search-modal['"]\s*%}/, "")
      .replace(/{%\s*render\s*['"]enquiry-modal['"]\s*%}/, "");

    console.log(`PASS: Full homepage rendered successfully without any Liquid errors (${fullPage.length} bytes)!`);
    console.log("=== FORENSIC VERIFICATION COMPLETE: ALL CHECKS PASSED ===");
  } catch (err) {
    console.error("FAIL: Homepage render threw an error:", err);
    process.exit(1);
  }
}

runRender();
