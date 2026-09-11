import { NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/db";

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newCat = createCategory({
      name: body.name,
      slug,
      description: body.description || "",
      image: body.image || "/assets/category-textiles.jpg",
      subcategories: body.subcategories || [],
    });

    return NextResponse.json({ success: true, category: newCat }, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 });
  }
}
