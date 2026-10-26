import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Liquid } from "liquidjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const themeDir = path.resolve(rootDir, "shopify-theme");

// Load locale strings
const enLocale = JSON.parse(fs.readFileSync(path.resolve(themeDir, "locales/en.default.json"), "utf-8"));

function getTranslation(key, fallback = "") {
  const parts = key.split(".");
  let cur = enLocale;
  for (const part of parts) {
    if (cur && typeof cur === "object" && part in cur) {
      cur = cur[part];
    } else {
      return fallback || key;
    }
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

// Register filters
engine.registerFilter("t", (key, opts) => {
  const fallback = opts?.default || "";
  return getTranslation(key, fallback);
});

engine.registerFilter("asset_url", (name) => `/assets/${name}`);
engine.registerFilter("stylesheet_tag", (url) => `<link rel="stylesheet" href="${url}">`);
engine.registerFilter("image_url", (img, opts) => {
  if (!img) return "/assets/ram-ji-bhaya-founder.jpg";
  if (typeof img === "string") return img.startsWith("/") || img.startsWith("http") ? img : `/assets/${img}`;
  return "/assets/ram-ji-bhaya-founder.jpg";
});
engine.registerFilter("money", (cents) => `₹${((cents || 0) / 100).toFixed(0)}`);
engine.registerFilter("money_without_trailing_zeros", (cents) => `₹${((cents || 0) / 100).toFixed(0)}`);
engine.registerFilter("escape", (val) => val || "");

// Register Shopify 'form' tag
engine.registerTag("form", {
  parse(tagToken, remainTokens) {
    this.templates = [];
    const stream = this.liquid.parser.parseStream(remainTokens);
    stream
      .on("tag:endform", () => stream.stop())
      .on("template", (tpl) => this.templates.push(tpl))
      .on("end", () => {
        throw new Error("tag endform not found");
      });
    stream.start();
  },
  *render(ctx, emitter) {
    emitter.write('<form method="post" action="#" class="shopify-form">');
    yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter);
    emitter.write("</form>");
  }
});

// Mock global context
const globalContext = {
  request: { locale: { iso_code: "en" } },
  settings: {
    favicon: null,
    enable_cart_drawer: true,
    support_email: "support@bhayaindia.com",
    phone_number: "+91 87266 90926",
    whatsapp_number: "918726690926"
  },
  page: {
    title: "राम जी भाया — Founder & Visionary",
    handle: "founder-profile",
    content: ""
  },
  routes: {
    root_url: "/",
    search_url: "/search",
    cart_url: "/cart",
    cart_add_url: "/cart/add",
    cart_change_url: "/cart/change",
    cart_clear_url: "/cart/clear",
    account_url: "/account",
    account_login_url: "/account/login",
    account_register_url: "/account/register",
    all_products_collection_url: "/collections/all",
    collections_url: "/collections",
    predictive_search_url: "/search/suggest"
  },
  cart: {
    item_count: 0,
    total_price: 0,
    items: []
  },
  customer: null,
  search: { terms: "", results: [] },
  linklists: {
    "main-menu": {
      links: [
        { title: "Home", url: "/" },
        { title: "Catalog", url: "/collections/all" },
        { title: "About Us", url: "/pages/about" },
        { title: "Contact", url: "/pages/contact" }
      ]
    }
  },
  content_for_header: "<!-- Shopify Header Injection Mock -->"
};

async function renderSection(sectionName, sectionSettings = {}) {
  const filePath = path.resolve(themeDir, "sections", `${sectionName}.liquid`);
  if (!fs.existsSync(filePath)) {
    console.warn(`Section not found: ${sectionName}`);
    return `<!-- Missing section: ${sectionName} -->`;
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const cleaned = content.replace(/\{%-?\s*schema\s*-?%\}[\s\S]*?\{%-?\s*endschema\s*-?%\}/g, "");
  
  const ctx = {
    ...globalContext,
    section: {
      id: `section-${sectionName}`,
      settings: sectionSettings
    }
  };
  
  return engine.parseAndRender(cleaned, ctx);
}

async function renderSnippet(snippetName) {
  const filePath = path.resolve(themeDir, "snippets", `${snippetName}.liquid`);
  if (!fs.existsSync(filePath)) return `<!-- Missing snippet: ${snippetName} -->`;
  const content = fs.readFileSync(filePath, "utf-8");
  return engine.parseAndRender(content, globalContext);
}

async function buildFounderPage() {
  const templateConfig = JSON.parse(fs.readFileSync(path.resolve(themeDir, "templates/page.founder-profile.json"), "utf-8"));
  
  console.log("Rendering header...");
  const headerHtml = await renderSection("header", {});
  
  console.log("Rendering founder-profile sections...");
  let layoutHtml = "";
  for (const sectionKey of templateConfig.order) {
    const secConfig = templateConfig.sections[sectionKey];
    console.log(`- ${secConfig.type}...`);
    layoutHtml += await renderSection(secConfig.type, secConfig.settings || {});
  }
  
  console.log("Rendering footer...");
  const footerHtml = await renderSection("footer", {});
  
  console.log("Rendering modals & drawers...");
  const cartDrawerHtml = await renderSnippet("cart-drawer");
  const searchModalHtml = await renderSnippet("search-modal");
  const enquiryModalHtml = await renderSnippet("enquiry-modal");
  
  const themeLiquid = fs.readFileSync(path.resolve(themeDir, "layout/theme.liquid"), "utf-8");
  
  let fullHtml = themeLiquid
    .replace(/\{%\s*section\s+'header'\s*%\}/g, headerHtml)
    .replace(/\{\{\s*content_for_layout\s*\}\}/g, layoutHtml)
    .replace(/\{%\s*section\s+'footer'\s*%\}/g, footerHtml)
    .replace(/\{%-?\s*render\s+'cart-drawer'\s*-?%\}/g, cartDrawerHtml)
    .replace(/\{%-?\s*render\s+'search-modal'\s*-?%\}/g, searchModalHtml)
    .replace(/\{%-?\s*render\s+'enquiry-modal'\s*-?%\}/g, enquiryModalHtml)
    .replace(/\{%-?\s*render\s+'seo-tags'\s*-?%\}/g, "<title>राम जी भाया — Founder & Visionary | BHAYA INDIA</title>")
    .replace(/\{\{\s*'base\.css'\s*\|\s*asset_url\s*\|\s*stylesheet_tag\s*\}\}/g, '<link rel="stylesheet" href="/assets/base.css">')
    .replace(/\{\{\s*'theme\.css'\s*\|\s*asset_url\s*\|\s*stylesheet_tag\s*\}\}/g, '<link rel="stylesheet" href="/assets/theme.css">')
    .replace(/\{\{\s*'theme\.js'\s*\|\s*asset_url\s*\}\}/g, '/assets/theme.js')
    .replace(/\{\{\s*content_for_header\s*\}\}/g, '')
    .replace(/\{\{\s*request\.locale\.iso_code\s*\}\}/g, 'en')
    .replace(/\{%-?\s*if\s+settings\.favicon[\s\S]*?\{%-?\s*endif\s*-?%\}/g, '')
    .replace(/\{%-?\s*if\s+settings\.enable_cart_drawer[\s\S]*?\{%-?\s*endif\s*-?%\}/g, cartDrawerHtml);

  const outPath = path.resolve(rootDir, "scratch/rendered-founder-profile.html");
  if (!fs.existsSync(path.dirname(outPath))) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
  }
  fs.writeFileSync(outPath, fullHtml, "utf-8");
  console.log(`Rendered founder profile written to ${outPath} (${fullHtml.length} bytes)`);
  return fullHtml;
}

buildFounderPage().catch(console.error);
