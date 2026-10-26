import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const artifactDir = "C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\05fceb73-254c-45be-a0e6-d1e08305d281";
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function captureEvidence() {
  console.log("Launching Puppeteer for Homepage Visual Audit...");
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

  // 1. Desktop Viewport (1440 x 900)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));

  // Screenshot 1: Hero Carousel
  const heroEl = await page.$("section[class*='hero']");
  if (heroEl) {
    await heroEl.screenshot({ path: path.join(artifactDir, "audit_fresh_hero_desktop.png") });
    console.log("Saved audit_fresh_hero_desktop.png");
  }

  // Screenshot 2: Our Story (BrandStory)
  const storyEl = await page.$("section[class*='storySection']");
  if (storyEl) {
    await storyEl.scrollIntoView();
    await new Promise((r) => setTimeout(r, 600));
    await storyEl.screenshot({ path: path.join(artifactDir, "audit_fresh_story_desktop.png") });
    console.log("Saved audit_fresh_story_desktop.png");
  }

  // Screenshot 3: Category Showcase (Categories Grid & Circular Strip)
  const catEl = await page.$("section[class*='categorySection']");
  if (catEl) {
    await catEl.scrollIntoView();
    await new Promise((r) => setTimeout(r, 600));
    await catEl.screenshot({ path: path.join(artifactDir, "audit_fresh_categories_desktop.png") });
    console.log("Saved audit_fresh_categories_desktop.png");
  }

  // Screenshot 4: Featured Products
  const featEl = await page.$("section[class*='featuredSection']");
  if (featEl) {
    await featEl.scrollIntoView();
    await new Promise((r) => setTimeout(r, 600));
    await featEl.screenshot({ path: path.join(artifactDir, "audit_fresh_featured_desktop.png") });
    console.log("Saved audit_fresh_featured_desktop.png");
  }

  // Screenshot 5: Founder Story Section
  const founderEl = await page.$("#founder-story-section");
  if (founderEl) {
    await founderEl.scrollIntoView();
    await new Promise((r) => setTimeout(r, 600));
    await founderEl.screenshot({ path: path.join(artifactDir, "audit_fresh_founder_desktop.png") });
    console.log("Saved audit_fresh_founder_desktop.png");
  }

  // 2. Mobile Viewport (375 x 812)
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 1200));

  // Capture Mobile Hero + Categories
  const mobileCatEl = await page.$("section[class*='categorySection']");
  if (mobileCatEl) {
    await mobileCatEl.scrollIntoView();
    await new Promise((r) => setTimeout(r, 600));
    await mobileCatEl.screenshot({ path: path.join(artifactDir, "audit_fresh_categories_mobile_375.png") });
    console.log("Saved audit_fresh_categories_mobile_375.png");
  }

  // Full Page Mobile Screenshot
  await page.screenshot({ path: path.join(artifactDir, "audit_fresh_homepage_mobile_375.png"), fullPage: false });
  console.log("Saved audit_fresh_homepage_mobile_375.png");

  await browser.close();
  console.log("Visual audit capture finished successfully!");
}

captureEvidence().catch((err) => {
  console.error("Puppeteer capture failed:", err);
  process.exit(1);
});
