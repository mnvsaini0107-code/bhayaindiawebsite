import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const themeDir = path.resolve(rootDir, "shopify-theme");
const artifactDir = "C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\7c51c6b4-c76d-41ed-8435-96ed095e72f6";

if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

// 1. Create HTTP Server
const server = http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0];
  
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

async function runAudit() {
  await new Promise((resolve) => server.listen(3457, resolve));
  console.log("Audit server running at http://localhost:3457");

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  const widths = [320, 360, 375, 390, 414, 430];
  const auditReport = [];

  for (const width of widths) {
    const height = Math.round(width * 2.16);
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto("http://localhost:3457/", { waitUntil: "networkidle0" });

    // Collect overflow info and layout defects
    const details = await page.evaluate((vw) => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      const hasOverflow = scrollWidth > vw;

      // Find overflowing elements
      const overflowingElements = [];
      const allElements = document.querySelectorAll("body *");
      allElements.forEach((el) => {
        // Skip drawer and overlay if positioned fixed
        const style = window.getComputedStyle(el);
        if (style.position === "fixed") return;
        
        const rect = el.getBoundingClientRect();
        if (rect.right > vw + 1 || rect.width > vw + 1) {
          // get simple identifier
          let id = el.id ? `#${el.id}` : "";
          let cls = el.className && typeof el.className === "string" ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
          overflowingElements.push({
            tag: el.tagName.toLowerCase(),
            selector: `${el.tagName.toLowerCase()}${id}${cls}`,
            width: Math.round(rect.width),
            right: Math.round(rect.right),
            delta: Math.round(rect.right - vw)
          });
        }
      });

      // Header inspection
      const header = document.querySelector("header");
      const logo = document.querySelector(".logoArea");
      const search = document.querySelector(".searchContainer");
      const utilActions = document.querySelector(".utilActions");
      const hamburger = document.querySelector("#mobile-menu-btn");
      const langBtn = document.querySelector("#header-lang-btn");
      const accountBtn = document.querySelector("#header-account-btn");
      const cartBtn = document.querySelector("#header-cart-btn");
      const enquireBtn = document.querySelector("#header-enquire-btn");
      const categoryBar = document.querySelector(".categoryBar");

      return {
        viewportWidth: vw,
        scrollWidth,
        clientWidth,
        hasOverflow,
        overflowDelta: scrollWidth - vw,
        overflowingElementCount: overflowingElements.length,
        topOverflowing: overflowingElements.slice(0, 10),
        headerState: {
          searchDisplay: search ? window.getComputedStyle(search).display : "none",
          enquireDisplay: enquireBtn ? window.getComputedStyle(enquireBtn).display : "none",
          categoryBarDisplay: categoryBar ? window.getComputedStyle(categoryBar).display : "none",
          hamburgerVisible: hamburger ? window.getComputedStyle(hamburger).display !== "none" : false,
          headerHeight: header ? header.offsetHeight : 0
        }
      };
    }, width);

    auditReport.push(details);

    // Save initial screenshot
    const shotPath = path.resolve(artifactDir, `before_mobile_${width}px.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`Audited ${width}px: scrollWidth=${details.scrollWidth}, delta=${details.overflowDelta}`);
  }

  console.log("\n=== AUDIT RESULTS SUMMARY ===");
  console.log(JSON.stringify(auditReport, null, 2));

  await browser.close();
  server.close();
}

runAudit().catch(console.error);
