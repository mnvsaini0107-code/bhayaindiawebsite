import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const artifactDir = "C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\05fceb73-254c-45be-a0e6-d1e08305d281";
if (!fs.existsSync(artifactDir)) {
  fs.mkdirSync(artifactDir, { recursive: true });
}

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function runAudit() {
  console.log("Launching Puppeteer with Chrome...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  // Bypass BrandSplash overlay
  await page.evaluateOnNewDocument(() => {
    sessionStorage.setItem("bhaya_splash_shown", "true");
  });

  console.log("\n=======================================================");
  console.log("1. AUDITING HOMEPAGE FOUNDER SECTION (Desktop & Mobile)");
  console.log("=======================================================");
  
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1000));

  const homeFounderData = await page.evaluate(() => {
    const sec = document.querySelector("#founder-story-section");
    const heading = sec?.querySelector("h2")?.textContent?.trim();
    const portrait = sec?.querySelector("img");
    const introP = sec?.querySelector("p[class*='narrativeText'], p")?.textContent?.trim();
    const ctaBtn = sec?.querySelector("#founder-about-readmore-btn, a[href*='founder']");

    if (sec) {
      sec.scrollIntoView();
    }

    return {
      secFound: !!sec,
      heading,
      introSnippet: introP ? introP.slice(0, 100) + "..." : null,
      ctaText: ctaBtn?.textContent?.trim(),
      ctaHref: ctaBtn?.getAttribute("href"),
      portraitSrc: portrait?.getAttribute("src"),
      portraitLoaded: portrait?.complete && (portrait?.naturalWidth > 0)
    };
  });

  console.log("Homepage Founder Check:", JSON.stringify(homeFounderData, null, 2));
  const founderSec = await page.$("#founder-story-section");
  if (founderSec) {
    await founderSec.screenshot({ path: path.join(artifactDir, "audit_01_homepage_founder_desktop.png") });
  } else {
    await page.screenshot({ path: path.join(artifactDir, "audit_01_homepage_founder_desktop.png") });
  }

  console.log("\n=======================================================");
  console.log("2. AUDITING DEDICATED FOUNDER PROFILE PAGE");
  console.log("=======================================================");

  await page.goto("http://localhost:3000/founder-profile", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1000));

  const profileData = await page.evaluate(() => {
    const title = document.querySelector("h1")?.textContent?.trim();
    const pullquote = document.querySelector(".founder-profile-pullquote, blockquote")?.textContent?.trim();
    const visionHeading = document.querySelector(".vision-card-heading")?.textContent?.trim();
    const philosophyHeading = document.querySelector(".philosophy-heading")?.textContent?.trim();
    const closingMotto = document.querySelector(".closing-motto")?.textContent?.trim();
    const portrait = document.querySelector(".founder-profile-portrait-card img");

    return {
      title,
      pullquote: pullquote ? pullquote.slice(0, 60) + "..." : null,
      visionHeading,
      philosophyHeading,
      closingMotto,
      portraitSrc: portrait?.getAttribute("src"),
      portraitLoaded: portrait?.complete && (portrait?.naturalWidth > 0)
    };
  });

  console.log("Founder Profile Page Check:", JSON.stringify(profileData, null, 2));
  await page.screenshot({ path: path.join(artifactDir, "audit_02_founder_profile_desktop.png") });

  console.log("\n=======================================================");
  console.log("3. AUDITING PRODUCT CATALOGUE (Desktop multi-column)");
  console.log("=======================================================");

  await page.goto("http://localhost:3000/products", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1000));

  const catalogDesktop = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll("article[id*='product']"));
    const details = cards.slice(0, 6).map((c) => {
      const name = c.querySelector("h3")?.textContent?.trim();
      const cat = c.querySelector("[class*='category']")?.textContent?.trim();
      const price = c.querySelector("[class*='priceCurrent'], [class*='priceQuote']")?.textContent?.trim();
      const img = c.querySelector("img")?.getAttribute("src");
      const hasFakeDiscount = !!c.querySelector("[class*='priceCompare']");
      const rating = c.querySelector("[class*='ratingNumber']")?.textContent?.trim();
      return { name, cat, price, img, hasFakeDiscount, rating };
    });

    return {
      totalCards: cards.length,
      sampleCards: details
    };
  });

  console.log("Catalogue Desktop Check:", JSON.stringify(catalogDesktop, null, 2));
  await page.screenshot({ path: path.join(artifactDir, "audit_03_catalogue_desktop.png") });

  console.log("\n=======================================================");
  console.log("4. AUDITING PRODUCT CATALOGUE (Mobile 375px 2-column)");
  console.log("=======================================================");

  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/products", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1000));

  const mobileGridData = await page.evaluate(() => {
    const grid = document.querySelector("[class*='productGrid']");
    if (grid) grid.scrollIntoView();

    const style = window.getComputedStyle(grid);
    const cols = style.gridTemplateColumns;
    const colCount = cols ? cols.split(" ").length : 0;
    const cards = Array.from(document.querySelectorAll("article[id*='product']"));
    const cardRects = cards.slice(0, 2).map((c) => {
      const r = c.getBoundingClientRect();
      return { width: Math.round(r.width), left: Math.round(r.left), top: Math.round(r.top) };
    });

    return {
      gridTemplateColumns: cols,
      colCount,
      cardRects,
      isTwoColumns: colCount === 2,
      overflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });

  console.log("Catalogue Mobile Grid Check:", JSON.stringify(mobileGridData, null, 2));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(artifactDir, "audit_04_catalogue_mobile_2col.png") });

  await browser.close();
  console.log("\nAudit successfully finished! Real rendered screenshots saved to:", artifactDir);
}

runAudit().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
