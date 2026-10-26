import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const themeDir = path.resolve(rootDir, "shopify-theme");
const artifactDir = "C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\11f8af83-03c2-4a9d-a52b-abf4d61a6323";

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

// 1. Mock Server supporting Shopify Cart API endpoints
let mockCart = {
  item_count: 0,
  total_price: 0,
  items: []
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0];

  // API endpoints
  if (urlPath === "/cart/add.js" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const id = data.id || 101;
      const qty = parseInt(data.quantity || 1, 10);
      const existing = mockCart.items.find(i => i.id === id);
      if (existing) {
        existing.quantity += qty;
      } else {
        mockCart.items.push({
          id,
          title: "Banarasi Pure Silk Katan Saree",
          price: 1850000,
          quantity: qty,
          image: "/assets/category-textiles.jpg"
        });
      }
      mockCart.item_count = mockCart.items.reduce((s, i) => s + i.quantity, 0);
      mockCart.total_price = mockCart.items.reduce((s, i) => s + (i.price * i.quantity), 0);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(mockCart));
    });
    return;
  }

  if (urlPath === "/cart.js" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(mockCart));
    return;
  }

  if (urlPath === "/cart/change.js" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const id = data.id;
      const qty = parseInt(data.quantity || 0, 10);
      if (qty <= 0) {
        mockCart.items = mockCart.items.filter(i => i.id !== id);
      } else {
        const item = mockCart.items.find(i => i.id === id);
        if (item) item.quantity = qty;
      }
      mockCart.item_count = mockCart.items.reduce((s, i) => s + i.quantity, 0);
      mockCart.total_price = mockCart.items.reduce((s, i) => s + (i.price * i.quantity), 0);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(mockCart));
    });
    return;
  }

  if (urlPath === "/" || urlPath === "/index.html") {
    const html = fs.readFileSync(path.resolve(rootDir, "scratch/rendered-preview.html"), "utf-8");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
    return;
  }

  if (urlPath.startsWith("/assets/")) {
    const assetName = path.basename(urlPath);
    const assetPath = path.resolve(themeDir, "assets", assetName);
    if (fs.existsSync(assetPath)) {
      let ext = path.extname(assetPath).toLowerCase();
      let contentType = "application/octet-stream";
      if (ext === ".css") contentType = "text/css";
      if (ext === ".js") contentType = "application/javascript";
      if (ext === ".png") contentType = "image/png";
      if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      if (ext === ".svg") contentType = "image/svg+xml";
      if (ext === ".json") contentType = "application/json";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(fs.readFileSync(assetPath));
      return;
    }
  }

  res.writeHead(404);
  res.end("Not found");
});

async function runFullVerification() {
  await new Promise(resolve => server.listen(3490, resolve));
  console.log("Suite verification server running at http://localhost:3490");

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", msg => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  const viewports = [
    { width: 320, height: 720, name: "mobile_320x720" },
    { width: 360, height: 800, name: "mobile_360x800" },
    { width: 375, height: 812, name: "mobile_375x812" },
    { width: 390, height: 844, name: "mobile_390x844" },
    { width: 414, height: 896, name: "mobile_414x896" },
    { width: 430, height: 932, name: "mobile_430x932" },
    { width: 1440, height: 900, name: "desktop_1440x900" }
  ];

  const suiteResults = {
    viewports: [],
    drawerTests: {},
    searchTests: {},
    cartTests: {},
    languageTests: {},
    consoleErrors: []
  };

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    await page.goto("http://localhost:3490/", { waitUntil: "networkidle0" });

    const metrics = await page.evaluate(w => {
      const sw = document.documentElement.scrollWidth;
      const cw = document.documentElement.clientWidth;
      const logo = document.querySelector(".logoLink")?.getBoundingClientRect();
      const util = document.querySelector(".utilActions")?.getBoundingClientRect();
      const overlap = logo && util ? Math.max(0, Math.round(logo.right - util.left)) : 0;
      return {
        viewportWidth: w,
        scrollWidth: sw,
        clientWidth: cw,
        hasHorizontalOverflow: sw > w,
        overflowDelta: sw - w,
        logoRight: logo ? Math.round(logo.right) : 0,
        utilLeft: util ? Math.round(util.left) : 0,
        overlapPixels: overlap
      };
    }, vp.width);

    // Save viewport screenshot
    const shotPath = path.resolve(artifactDir, `after_${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    metrics.screenshot = shotPath;
    suiteResults.viewports.push(metrics);
    console.log(`Viewport ${vp.width}x${vp.height}: overflowDelta=${metrics.overflowDelta}, overlap=${metrics.overlapPixels}`);
  }

  // ==========================================
  // TEST: DRAWER OPEN / CLOSE / ESCAPE (390 x 844)
  // ==========================================
  console.log("\n--- Testing Mobile Drawer Lifecycle ---");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3490/", { waitUntil: "networkidle0" });

  // 1. Initial Closed state
  const initialDrawerState = await page.evaluate(() => {
    const d = document.getElementById("bhaya-mobile-drawer");
    const o = document.getElementById("bhaya-mobile-overlay");
    const style = window.getComputedStyle(d);
    return {
      isOpen: d?.classList.contains("open"),
      visibility: style.visibility,
      bodyOverflow: document.body.style.overflow
    };
  });

  // 2. Open via hamburger
  await page.click("#mobile-menu-btn");
  await new Promise(r => setTimeout(r, 350));
  const openDrawerShot = path.resolve(artifactDir, "after_mobile_drawer_open_390x844.png");
  await page.screenshot({ path: openDrawerShot });

  const openedDrawerState = await page.evaluate(() => {
    const d = document.getElementById("bhaya-mobile-drawer");
    const o = document.getElementById("bhaya-mobile-overlay");
    const style = window.getComputedStyle(d);
    return {
      isOpen: d?.classList.contains("open"),
      visibility: style.visibility,
      bodyOverflow: document.body.style.overflow,
      overlayOpacity: window.getComputedStyle(o).opacity
    };
  });

  // 3. Close via close button
  await page.click("#mobile-drawer-close");
  await new Promise(r => setTimeout(r, 350));
  const closedDrawerState = await page.evaluate(() => {
    const d = document.getElementById("bhaya-mobile-drawer");
    const style = window.getComputedStyle(d);
    return {
      isOpen: d?.classList.contains("open"),
      visibility: style.visibility,
      bodyOverflow: document.body.style.overflow
    };
  });

  // 4. Open and close via Escape key
  await page.click("#mobile-menu-btn");
  await new Promise(r => setTimeout(r, 350));
  await page.keyboard.press("Escape");
  await new Promise(r => setTimeout(r, 350));
  const escapeDrawerState = await page.evaluate(() => {
    const d = document.getElementById("bhaya-mobile-drawer");
    const style = window.getComputedStyle(d);
    return {
      isOpen: d?.classList.contains("open"),
      visibility: style.visibility,
      bodyOverflow: document.body.style.overflow
    };
  });

  suiteResults.drawerTests = {
    initial: initialDrawerState,
    opened: openedDrawerState,
    closedByButton: closedDrawerState,
    closedByEscape: escapeDrawerState
  };

  // ==========================================
  // TEST: SEARCH FUNCTIONALITY (390 x 844)
  // ==========================================
  console.log("\n--- Testing Mobile Search Toggle ---");
  await page.click("#header-mobile-search-toggle");
  await new Promise(r => setTimeout(r, 200));
  const searchOpenShot = path.resolve(artifactDir, "after_mobile_search_expanded_390x844.png");
  await page.screenshot({ path: searchOpenShot });

  const searchState = await page.evaluate(() => {
    const row = document.getElementById("mobile-search-row");
    const input = document.getElementById("mobile-expanded-search-input");
    return {
      rowVisible: row && window.getComputedStyle(row).display !== "none",
      inputFound: !!input
    };
  });
  suiteResults.searchTests = searchState;

  // ==========================================
  // TEST: CART DRAWER & AJAX ADD (390 x 844)
  // ==========================================
  console.log("\n--- Testing Cart Drawer & AJAX Add ---");
  const cartTestResult = await page.evaluate(async () => {
    // Call addToCart
    await window.addToCart(101, 1);
    await new Promise(r => setTimeout(r, 400));
    const drawer = document.querySelector(".cart-drawer");
    const active = drawer && drawer.classList.contains("active");
    const total = document.querySelector(".cart-drawer__total")?.innerText;
    return {
      cartDrawerOpened: active,
      subtotalText: total
    };
  });

  const cartDrawerShot = path.resolve(artifactDir, "after_mobile_cart_drawer_390x844.png");
  await page.screenshot({ path: cartDrawerShot });

  // Close cart drawer via Escape
  await page.keyboard.press("Escape");
  await new Promise(r => setTimeout(r, 350));
  const cartClosedResult = await page.evaluate(() => {
    const drawer = document.querySelector(".cart-drawer");
    return {
      active: drawer ? drawer.classList.contains("active") : false,
      bodyOverflow: document.body.style.overflow
    };
  });
  suiteResults.cartTests = { ...cartTestResult, closedByEscape: cartClosedResult };

  // ==========================================
  // TEST: LANGUAGE TRANSLATION (EN <-> HI)
  // ==========================================
  console.log("\n--- Testing Language Switcher (EN <-> HI) ---");
  // Toggle to Hindi
  await page.evaluate(() => {
    window.setStoreLanguage("hi");
  });
  await new Promise(r => setTimeout(r, 300));
  const hindiShot = path.resolve(artifactDir, "after_mobile_hindi_390x844.png");
  await page.screenshot({ path: hindiShot });

  const hindiMetrics = await page.evaluate(() => {
    const sw = document.documentElement.scrollWidth;
    const cw = document.documentElement.clientWidth;
    const heroTitle = document.getElementById("hero-heading-text")?.innerText;
    const htmlLang = document.documentElement.lang;
    return {
      lang: htmlLang,
      hasOverflow: sw > cw,
      scrollWidth: sw,
      heroTitle
    };
  });

  // Toggle back to English
  await page.evaluate(() => {
    window.setStoreLanguage("en");
  });
  await new Promise(r => setTimeout(r, 300));
  const enMetrics = await page.evaluate(() => {
    const sw = document.documentElement.scrollWidth;
    const cw = document.documentElement.clientWidth;
    const heroTitle = document.getElementById("hero-heading-text")?.innerText;
    const htmlLang = document.documentElement.lang;
    return {
      lang: htmlLang,
      hasOverflow: sw > cw,
      scrollWidth: sw,
      heroTitle
    };
  });
  suiteResults.languageTests = { hindi: hindiMetrics, english: enMetrics };

  suiteResults.consoleErrors = consoleErrors;

  console.log("\n==========================================");
  console.log("FULL TEST SUITE RESULTS:");
  console.log("==========================================");
  console.log(JSON.stringify(suiteResults, null, 2));

  await browser.close();
  server.close();
}

runFullVerification().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
