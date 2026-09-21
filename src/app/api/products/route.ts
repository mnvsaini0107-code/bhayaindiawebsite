import { NextResponse } from "next/server";
import { getShopifyProducts, searchShopifyProducts, isShopifyConfigured } from "@/lib/shopify";
import { createProduct } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("q");
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured");

    if (search) {
      // Use Shopify search
      const results = await searchShopifyProducts(search);
      return NextResponse.json({
        success: true,
        count: results.length,
        isShopify: isShopifyConfigured(),
        products: results,
      });
    }

    let items = await getShopifyProducts({
      category: category || undefined,
      sortKey: sort === "price-low" || sort === "price-high" ? "PRICE" : "RELEVANCE",
      reverse: sort === "price-high",
    });

    if (featured === "true") {
      items = items.filter((p) => p.isFeatured);
    }

    return NextResponse.json({
      success: true,
      count: items.length,
      isShopify: isShopifyConfigured(),
      products: items,
    });
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
      images: body.images || ["/assets/category-textiles.jpg"],
      price: body.price !== undefined ? Number(body.price) : null,
      priceNote: body.priceNote || "Per piece",
      specs: body.specs || [],
      features: body.features || [],
      benefits: body.benefits || [],
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      isNew: Boolean(body.isNew),
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
      minOrder: body.minOrder ? Number(body.minOrder) : 1,
      sku: body.sku || `BI-${Date.now().toString().slice(-4)}`,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}
