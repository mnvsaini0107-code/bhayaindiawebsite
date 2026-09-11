import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("q");
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured");

    let items = getProducts();

    if (category && category !== "all") {
      items = items.filter((p) => p.categorySlug === category);
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (featured === "true") {
      items = items.filter((p) => p.isFeatured && p.isPublished);
    }

    if (sort === "price-low") {
      items.sort((a, b) => (a.price || 999999) - (b.price || 999999));
    } else if (sort === "price-high") {
      items.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === "newest") {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json({ success: true, count: items.length, products: items });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.categorySlug) {
      return NextResponse.json(
        { success: false, error: "Product name and category are required" },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newProduct = createProduct({
      name: body.name,
      slug,
      category: body.category || "General",
      categorySlug: body.categorySlug,
      subcategory: body.subcategory || "General",
      tagline: body.tagline || "",
      description: body.description || "",
      images: body.images && body.images.length > 0 ? body.images : ["/assets/category-textiles.jpg"],
      price: body.price !== undefined ? body.price : null,
      priceNote: body.priceNote || "",
      specs: body.specs || [],
      features: body.features || [],
      benefits: body.benefits || [],
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      isNew: Boolean(body.isNew),
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
      minOrder: body.minOrder ? Number(body.minOrder) : 1,
      sku: body.sku || `BI-${Date.now().toString().slice(-4)}`,
      seoTitle: body.seoTitle || `${body.name} — Bhaya India`,
      seoDescription: body.seoDescription || body.description?.slice(0, 150) || "",
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}
