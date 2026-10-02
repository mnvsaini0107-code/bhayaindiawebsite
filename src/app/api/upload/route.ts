import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { saveMedia } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Clean up filename and append timestamp
    const ext = path.extname(file.name) || ".jpg";
    const base = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const fileName = `${base}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    // Automatically index in Media Library
    const cleanTitle = path
      .basename(file.name, ext)
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const asset = saveMedia({
      filename: fileName,
      originalName: file.name,
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
