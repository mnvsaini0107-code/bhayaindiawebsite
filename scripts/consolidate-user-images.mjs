import fs from "node:fs";
import path from "node:path";

const targetDir = path.resolve("scratch/all_authentic_user_images");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Files from ZIP
const zipDir = path.resolve("scratch/uploaded_images_zip");
const zipFiles = fs.readdirSync(zipDir);
console.log("=== IMAGES FROM USER ZIP ===");
zipFiles.forEach((f, idx) => {
  const src = path.join(zipDir, f);
  const destName = `zip_img_${idx + 1}_${f.replace(/\s+/g, "_")}`;
  const dest = path.join(targetDir, destName);
  fs.copyFileSync(src, dest);
  console.log(`[ZIP ${idx + 1}] ${f} -> ${destName}`);
});

// 2. Files from Chat Upload
const uploadDir = "C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\11f8af83-03c2-4a9d-a52b-abf4d61a6323\\.user_uploaded";
if (fs.existsSync(uploadDir)) {
  console.log("\n=== IMAGES FROM CHAT ATTACHMENT ===");
  const chatFiles = fs.readdirSync(uploadDir).filter(f => f.endsWith(".jpg") || f.endsWith(".png"));
  chatFiles.forEach((f, idx) => {
    const src = path.join(uploadDir, f);
    const destName = `chat_img_${idx + 1}_${f}`;
    const dest = path.join(targetDir, destName);
    fs.copyFileSync(src, dest);
    console.log(`[CHAT ${idx + 1}] ${f} -> ${destName}`);
  });
}
