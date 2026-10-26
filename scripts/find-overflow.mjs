import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import http from "node:http";

const rootDir = process.cwd();
const themeDir = path.resolve(rootDir, "shopify-theme");

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
  res.end();
});

await new Promise((resolve) => server.listen(3505, resolve));

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new"
});

async function checkViewport(w, h) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  await page.goto("http://localhost:3505/", { waitUntil: "networkidle0" });

  const report = await page.evaluate((docWidth) => {
    const elements = Array.from(document.body.querySelectorAll("*"));
    const culprits = elements.filter(el => {
      let parent = el.parentElement;
      let insideOverflow = false;
      while (parent && parent !== document.body) {
        const pStyle = window.getComputedStyle(parent);
        if (pStyle.overflowX === "auto" || pStyle.overflowX === "hidden" || pStyle.overflowX === "scroll") {
          insideOverflow = true;
          break;
        }
        parent = parent.parentElement;
      }
      if (insideOverflow) return false;
      
      const rect = el.getBoundingClientRect();
      return rect.right > docWidth + 1;
    });

    return {
      docWidth,
      scrollWidth: document.documentElement.scrollWidth,
      culprits: culprits.slice(0, 5).map(el => ({
        tag: el.tagName,
        class: el.className,
        id: el.id,
        right: Math.round(el.getBoundingClientRect().right)
      }))
    };
  }, w);

  console.log(`Viewport ${w}x${h}:`, JSON.stringify(report, null, 2));
  await page.close();
}

await checkViewport(320, 720);
await checkViewport(1440, 900);

await browser.close();
server.close();
