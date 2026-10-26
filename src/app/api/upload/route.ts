import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { saveMedia } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".svg"]);

function validateImageContent(buffer: Buffer, ext: string): { valid: boolean; error?: string } {
  if (buffer.length < 4) {
    return { valid: false, error: "File buffer too small to be a valid image." };
  }

  // 1. JPEG: FF D8 FF
  if (ext === ".jpg" || ext === ".jpeg") {
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return { valid: true };
    }
    return { valid: false, error: "File extension is JPEG but content signature does not match." };
  }

  // 2. PNG: 89 50 4E 47
  if (ext === ".png") {
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return { valid: true };
    }
    return { valid: false, error: "File extension is PNG but content signature does not match." };
  }

  // 3. WebP: RIFF ... WEBP
  if (ext === ".webp") {
    if (
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    ) {
      return { valid: true };
    }
    return { valid: false, error: "File extension is WebP but content signature does not match." };
  }

  // 4. SVG: Must be clean XML with <svg and no executable scripts
  if (ext === ".svg") {
    const text = buffer.toString("utf-8").toLowerCase();
    if (!text.includes("<svg")) {
      return { valid: false, error: "SVG file missing root <svg> element." };
    }
    // Block XSS payloads
    const dangerousPatterns = [
      "<script",
      "javascript:",
      "onload",
      "onerror",
      "onclick",
      "<foreignobject",
      "xlink:href=\"data:text/html",
    ];
    for (const pattern of dangerousPatterns) {
      if (text.includes(pattern)) {
        return { valid: false, error: `Dangerous SVG content detected (${pattern}).` };
      }
    }
    return { valid: true };
  }

  return { valid: false, error: "Unsupported file type." };
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required." },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: `File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB)` },
        { status: 400 }
      );
    }

    const rawExt = path.extname(file.name).toLowerCase();
    const ext = rawExt || ".jpg";

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, error: `File type '${ext}' is not permitted. Only images (.jpg, .jpeg, .png, .webp, .svg) are allowed.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Deep content validation against magic bytes
    const check = validateImageContent(buffer, ext);
    if (!check.valid) {
      return NextResponse.json({ success: false, error: check.error || "Invalid image content." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitize filename to prevent directory traversal
    const safeBase = path
      .basename(file.name, rawExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 30) || "asset";

    const fileName = `${safeBase}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    // Automatically index in Media Library
    const cleanTitle = safeBase
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const asset = saveMedia({
      filename: fileName,
      originalName: file.name.slice(0, 100),
      fileType: file.type || `image/${ext.replace(".", "")}`,
      fileSize: buffer.length,
      url: publicUrl,
      title: cleanTitle,
      altEn: `${cleanTitle} — BHAYA INDIA`,
      altHi: `${cleanTitle} — भाया इंडिया`,
      usage: "Uploaded Asset",
      uploadedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, url: publicUrl, fileName, asset });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
