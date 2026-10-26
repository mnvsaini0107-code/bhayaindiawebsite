import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const themeDir = path.resolve(rootDir, "shopify-theme");
const artifactDir = "C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\dd34f161-9067-49ab-bdcd-8e9ab8dd6e01";

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

async function main() {
  await new Promise((resolve) => server.listen(3456, resolve));
  console.log("Local preview server running at http://localhost:3456");

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  // ==========================================
  // TEST 1: DESKTOP (1440 x 900)
  // ==========================================
  console.log("\n==========================================");
  console.log("TESTING DESKTOP: 1440 x 900");
  console.log("==========================================");
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto("http://localhost:3456/", { waitUntil: "networkidle0" });

  // Evaluate Desktop DOM State
  const desktopChecks = await page.evaluate(() => {
    const drawer = document.getElementById("bhaya-mobile-drawer");
    const overlay = document.getElementById("bhaya-mobile-overlay");
    const hamburger = document.getElementById("mobile-menu-btn");
    const drawerStyle = drawer ? window.getComputedStyle(drawer) : null;
    const overlayStyle = overlay ? window.getComputedStyle(overlay) : null;
    const hamburgerStyle = hamburger ? window.getComputedStyle(hamburger) : null;

    const heroTitle = document.querySelector(".heroTitle, [data-t='sections.hero.title']")?.innerText?.trim();
    const heroEyebrow = document.querySelector(".heroEyebrow, [data-t='sections.hero.eyebrow']")?.innerText?.trim();
    const headers = Array.from(document.querySelectorAll("header")).filter(el => el.offsetParent !== null);
    const visibleSearchInputs = Array.from(document.querySelectorAll(".searchInput, .mobileSearchInput")).filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    });
    const visibleLangSwitchers = Array.from(document.querySelectorAll(".langSwitcher")).filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    });

    return {
      drawerVisible: drawerStyle ? drawerStyle.display !== "none" && drawerStyle.visibility !== "hidden" : false,
      drawerDisplay: drawerStyle?.display,
      overlayDisplay: overlayStyle?.display,
      hamburgerDisplay: hamburgerStyle?.display,
      heroTitle,
      heroEyebrow,
      visibleHeadersCount: headers.length,
      visibleSearchCount: visibleSearchInputs.length,
      visibleLangSwitcherCount: visibleLangSwitchers.length
    };
  });

  console.log("Desktop Checks:", JSON.stringify(desktopChecks, null, 2));

  // Desktop Screenshot (Full page and above the fold)
  const desktopAboveFoldPath = path.resolve(artifactDir, "shopify_preview_desktop_1440x900.png");
  await page.screenshot({ path: desktopAboveFoldPath, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log(`Desktop Screenshot saved: ${desktopAboveFoldPath}`);

  // ==========================================
  // TEST 2: MOBILE (390 x 844) - STATE A: CLOSED
  // ==========================================
  console.log("\n==========================================");
  console.log("TESTING MOBILE: 390 x 844 (STATE A: CLOSED)");
  console.log("==========================================");
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await new Promise((r) => setTimeout(r, 500));

  const mobileClosedChecks = await page.evaluate(() => {
    const drawer = document.getElementById("bhaya-mobile-drawer");
    const overlay = document.getElementById("bhaya-mobile-overlay");
    const hamburger = document.getElementById("mobile-menu-btn");
    const drawerStyle = drawer ? window.getComputedStyle(drawer) : null;
    const overlayStyle = overlay ? window.getComputedStyle(overlay) : null;
    const rect = drawer ? drawer.getBoundingClientRect() : null;

    return {
      drawerTransform: drawerStyle?.transform,
      drawerIsOpen: drawer?.classList.contains("open"),
      overlayOpacity: overlayStyle?.opacity,
      overlayPointerEvents: overlayStyle?.pointerEvents,
      drawerRect: rect ? { left: rect.left, right: rect.right, width: rect.width } : null,
      isOffscreen: rect ? rect.left >= 390 : false
    };
  });
  console.log("Mobile Closed Checks:", JSON.stringify(mobileClosedChecks, null, 2));

  const mobileClosedPath = path.resolve(artifactDir, "shopify_preview_mobile_closed_390x844.png");
  await page.screenshot({ path: mobileClosedPath, clip: { x: 0, y: 0, width: 390, height: 844 } });
  console.log(`Mobile Closed Screenshot saved: ${mobileClosedPath}`);

  // ==========================================
  // TEST 3: MOBILE - STATE B: OPEN (Click Hamburger)
  // ==========================================
  console.log("\n==========================================");
  console.log("TESTING MOBILE: 390 x 844 (STATE B: OPEN)");
  console.log("==========================================");
  await page.click("#mobile-menu-btn");
  await new Promise((r) => setTimeout(r, 400)); // wait for CSS transition

  const mobileOpenChecks = await page.evaluate(() => {
    const drawer = document.getElementById("bhaya-mobile-drawer");
    const overlay = document.getElementById("bhaya-mobile-overlay");
    const drawerStyle = drawer ? window.getComputedStyle(drawer) : null;
    const overlayStyle = overlay ? window.getComputedStyle(overlay) : null;
    const rect = drawer ? drawer.getBoundingClientRect() : null;

    return {
      drawerIsOpen: drawer?.classList.contains("open"),
      overlayOpacity: overlayStyle?.opacity,
      overlayPointerEvents: overlayStyle?.pointerEvents,
      drawerRect: rect ? { left: rect.left, right: rect.right, width: rect.width } : null,
      isOnScreen: rect ? rect.right <= 390 && rect.left < 390 : false
    };
  });
  console.log("Mobile Open Checks:", JSON.stringify(mobileOpenChecks, null, 2));

  const mobileOpenPath = path.resolve(artifactDir, "shopify_preview_mobile_open_390x844.png");
  await page.screenshot({ path: mobileOpenPath, clip: { x: 0, y: 0, width: 390, height: 844 } });
  console.log(`Mobile Open Screenshot saved: ${mobileOpenPath}`);

  // ==========================================
  // TEST 4: MOBILE - STATE C: CLOSE (Click Close button)
  // ==========================================
  console.log("\n==========================================");
  console.log("TESTING MOBILE: 390 x 844 (STATE C: RE-CLOSED)");
  console.log("==========================================");
  await page.click("#mobile-drawer-close");
  await new Promise((r) => setTimeout(r, 400)); // wait for CSS transition

  const mobileReclosedChecks = await page.evaluate(() => {
    const drawer = document.getElementById("bhaya-mobile-drawer");
    const overlay = document.getElementById("bhaya-mobile-overlay");
    const drawerStyle = drawer ? window.getComputedStyle(drawer) : null;
    const overlayStyle = overlay ? window.getComputedStyle(overlay) : null;
    const rect = drawer ? drawer.getBoundingClientRect() : null;

    return {
      drawerIsOpen: drawer?.classList.contains("open"),
      overlayOpacity: overlayStyle?.opacity,
      overlayPointerEvents: overlayStyle?.pointerEvents,
      isOffscreen: rect ? rect.left >= 390 : false
    };
  });
  console.log("Mobile Reclosed Checks:", JSON.stringify(mobileReclosedChecks, null, 2));

  const mobileReclosedPath = path.resolve(artifactDir, "shopify_preview_mobile_reclosed_390x844.png");
  await page.screenshot({ path: mobileReclosedPath, clip: { x: 0, y: 0, width: 390, height: 844 } });
  console.log(`Mobile Reclosed Screenshot saved: ${mobileReclosedPath}`);

  await browser.close();
  server.close();
  console.log("\nALL BROWSER PREVIEW TESTS FINISHED.");
}

main().catch((err) => {
  console.error("Error running browser preview tests:", err);
  process.exit(1);
});
