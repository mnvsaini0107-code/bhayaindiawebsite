import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const themeDir = path.resolve(rootDir, "shopify-theme");
const artifactDir = "C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\ad75b55c-ce6b-4c7b-85fc-b46784db0ef5";

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

  if (urlPath === "/pages/founder-profile" || urlPath === "/founder-profile" || urlPath === "/pages/founder" || urlPath === "/founder") {
    const html = fs.readFileSync(path.resolve(rootDir, "scratch/rendered-founder-profile.html"), "utf-8");
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
  const port = 3499;
  await new Promise((resolve) => server.listen(port, resolve));
  console.log(`Local test server running on http://localhost:${port}`);

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  // Test matrix
  const viewports = [
    { name: "desktop_1440px", width: 1440, height: 900, dsf: 1 },
    { name: "mobile_414px", width: 414, height: 896, dsf: 2 },
    { name: "mobile_390px", width: 390, height: 844, dsf: 2 },
    { name: "mobile_360px", width: 360, height: 800, dsf: 2 },
    { name: "mobile_320px", width: 320, height: 720, dsf: 2 }
  ];

  console.log("\n==========================================");
  console.log("PHASE 1: AUDITING HOMEPAGE FOUNDER SECTION");
  console.log("==========================================");

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf });
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle0" });

    const checks = await page.evaluate(() => {
      const founderSec = document.querySelector(".bhaya-founder-section");
      const heading = founderSec?.querySelector(".bhaya-founder-heading")?.innerText?.trim();
      const name = founderSec?.querySelector(".bhaya-founder-name")?.innerText?.trim();
      const designation = founderSec?.querySelector(".bhaya-founder-designation")?.innerText?.trim();
      const intro = founderSec?.querySelector(".bhaya-founder-intro-text")?.innerText?.trim();
      const quote = founderSec?.querySelector(".bhaya-founder-quote-text")?.innerText?.trim();
      const cta = founderSec?.querySelector(".bhaya-founder-cta");
      const img = founderSec?.querySelector(".bhaya-founder-photo");
      const overflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        founderSectionPresent: !!founderSec,
        heading,
        name,
        designation,
        introSnippet: intro ? intro.slice(0, 60) + "..." : null,
        quote,
        ctaText: cta?.innerText?.trim(),
        ctaHref: cta?.getAttribute("href"),
        imgSrc: img?.getAttribute("src"),
        imgNaturalWidth: img?.naturalWidth,
        imgComplete: img?.complete,
        overflow,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });

    console.log(`\n[Homepage @ ${vp.name}]:`, JSON.stringify(checks, null, 2));

    // Scroll to founder section and screenshot
    const founderSecHandle = await page.$(".bhaya-founder-section");
    if (founderSecHandle) {
      await page.evaluate((el) => el.scrollIntoView({ behavior: "instant", block: "center" }), founderSecHandle);
      await new Promise((r) => setTimeout(r, 200));
      const ssPath = path.resolve(artifactDir, `homepage_founder_${vp.name}.png`);
      await page.screenshot({ path: ssPath });
      console.log(`Saved screenshot: ${ssPath}`);
    }
  }

  console.log("\n==========================================");
  console.log("PHASE 2: AUDITING FULL FOUNDER PROFILE PAGE");
  console.log("==========================================");

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf });
    await page.goto(`http://localhost:${port}/pages/founder-profile`, { waitUntil: "networkidle0" });

    const checks = await page.evaluate(() => {
      const title = document.querySelector(".founder-profile-title")?.innerText?.trim();
      const desig = document.querySelector(".founder-profile-designation")?.innerText?.trim();
      const quote = document.querySelector(".pullquote-text")?.innerText?.trim();
      const visionHeading = document.querySelector(".vision-card-heading")?.innerText?.trim();
      const philosophyCards = Array.from(document.querySelectorAll(".philosophy-card")).map(c => ({
        title: c.querySelector(".philosophy-card-title")?.innerText?.trim(),
        desc: c.querySelector(".philosophy-card-desc")?.innerText?.trim()
      }));
      const futureHeading = document.querySelector(".future-box-heading")?.innerText?.trim();
      const ctas = Array.from(document.querySelectorAll(".founder-profile-actions a")).map(a => ({
        text: a.innerText?.trim(),
        href: a.getAttribute("href")
      }));
      const img = document.querySelector(".founder-profile-photo");
      const overflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        title,
        desig,
        quote,
        visionHeading,
        philosophyCardsCount: philosophyCards.length,
        philosophyTitles: philosophyCards.map(p => p.title),
        futureHeading,
        ctas,
        imgSrc: img?.getAttribute("src"),
        imgComplete: img?.complete,
        overflow,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });

    console.log(`\n[Founder Profile @ ${vp.name}]:`, JSON.stringify(checks, null, 2));

    const ssPath = path.resolve(artifactDir, `founder_profile_page_${vp.name}.png`);
    await page.screenshot({ path: ssPath, fullPage: true });
    console.log(`Saved full-page screenshot: ${ssPath}`);
  }

  await browser.close();
  server.close();
  console.log("\nAudit complete!");
}

runAudit().catch(console.error);
