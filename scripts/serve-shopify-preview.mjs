import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const themeDir = path.resolve(rootDir, "shopify-theme");

const server = http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0];
  
  if (urlPath === "/" || urlPath === "/index.html") {
    const filePath = path.resolve(rootDir, "scratch/rendered-preview.html");
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(fs.readFileSync(filePath));
      return;
    }
  }

  if (urlPath === "/pages/founder-profile" || urlPath === "/founder-profile") {
    const filePath = path.resolve(rootDir, "scratch/rendered-founder-profile.html");
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(fs.readFileSync(filePath));
      return;
    }
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
      if (ext === ".webp") contentType = "image/webp";
      if (ext === ".svg") contentType = "image/svg+xml";
      if (ext === ".json") contentType = "application/json";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(fs.readFileSync(assetPath));
      return;
    }
  }

  // Fallback for static assets in public
  const publicPath = path.resolve(rootDir, "public", urlPath.replace(/^\//, ""));
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    let ext = path.extname(publicPath).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".css") contentType = "text/css";
    if (ext === ".js") contentType = "application/javascript";
    if (ext === ".png") contentType = "image/png";
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    if (ext === ".webp") contentType = "image/webp";
    if (ext === ".svg") contentType = "image/svg+xml";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(fs.readFileSync(publicPath));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Page not found");
});

const PORT = 3456;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n======================================================`);
  console.log(`BHAYA INDIA Shopify Storefront Preview Server is RUNNING!`);
  console.log(`Homepage:        http://localhost:${PORT}/`);
  console.log(`Founder Profile: http://localhost:${PORT}/pages/founder-profile`);
  console.log(`======================================================\n`);
});
