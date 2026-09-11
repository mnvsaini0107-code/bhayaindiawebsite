import { NextResponse } from "next/server";
import { getFaqs, createFaq } from "@/lib/db";

export async function GET() {
  try {
    const faqs = getFaqs();
    return NextResponse.json({ success: true, faqs });
  } catch (error) {
    console.error("GET /api/faqs error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch faqs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.question || !body.answer) {
      return NextResponse.json({ success: false, error: "Question and answer are required" }, { status: 400 });
    }

    const item = createFaq({
      question: body.question,
      answer: body.answer,
      category: body.category || "General",
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      sortOrder: Number(body.sortOrder) || 1,
    });

    return NextResponse.json({ success: true, faq: item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/faqs error:", error);
    return NextResponse.json({ success: false, error: "Failed to create faq" }, { status: 500 });
  }
}
