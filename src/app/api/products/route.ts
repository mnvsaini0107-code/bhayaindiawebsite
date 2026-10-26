import { NextResponse } from "next/server";
import { getShopifyProducts, isShopifyConfigured } from "@/lib/shopify";
import { executeIntentSearch } from "@/lib/search/intentSearch";
import { createProduct, getProducts } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");

    // Secure Admin Catalogue Query: returns all products across all statuses
    if (scope === "admin") {
      const isAdmin = await verifyAdminRequest(request);
      if (!isAdmin) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Admin session required." },
          { status: 401 }
        );
      }
      const allProducts = getProducts();
      return NextResponse.json({
        success: true,
        count: allProducts.length,
        products: allProducts,
      });
    }

    const category = searchParams.get("category");
    const search = searchParams.get("q");
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured");

    // Fetch baseline products from Shopify
    let items = await getShopifyProducts({
      category: !search && category ? category : undefined,
      sortKey: sort === "price-low" || sort === "price-high" ? "PRICE" : "RELEVANCE",
      reverse: sort === "price-high",
    });

    if (featured === "true") {
      items = items.filter((p) => p.isFeatured);
    }

    if (search && search.trim()) {
      // Execute intelligent intent-based search & server-side ranking
      const searchResult = executeIntentSearch(search.trim(), items);

      return NextResponse.json({
        success: true,
        count: searchResult.totalFound,
        isShopify: isShopifyConfigured(),
        products: searchResult.products,
        matchedCategory: searchResult.matchedCategory,
        matchedSubcategories: searchResult.matchedSubcategories,
        relatedSearches: searchResult.relatedSearches,
      });
    }

    return NextResponse.json({
      success: true,
      count: items.length,
      isShopify: isShopifyConfigured(),
      products: items,
      matchedCategory: null,
      matchedSubcategories: [],
      relatedSearches: [],
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required." },
      { status: 401 }
    );
  }

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

    const priceVal = body.price !== undefined && body.price !== null && body.price !== "" && Number(body.price) > 0 ? Number(body.price) : null;
    const comparePriceVal = body.compareAtPrice !== undefined && body.compareAtPrice !== null && body.compareAtPrice !== "" && Number(body.compareAtPrice) > 0 ? Number(body.compareAtPrice) : null;
    const stockVal = body.stockQuantity !== undefined ? Number(body.stockQuantity) : (body.inStock !== false ? 50 : 0);

    const newProduct = createProduct({
      name: body.name,
      slug,
      category: body.category || "General",
      categorySlug: body.categorySlug,
      subcategory: body.subcategory || "General",
      tagline: body.tagline || "",
      description: body.description || "",
      images: body.images && body.images.length > 0 ? body.images : ["/assets/image-coming-soon.svg"],
      price: priceVal,
      compareAtPrice: comparePriceVal,
      stockQuantity: stockVal,
      status: body.status || (body.isPublished !== false ? "published" : "draft"),
      shopifyReferenceId: body.shopifyReferenceId || null,
      priceNote: body.priceNote || (priceVal ? "Per piece" : "Price on Enquiry"),
      specs: body.specs || [],
      features: body.features || [],
      benefits: body.benefits || [],
      isFeatured: Boolean(body.isFeatured),
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      isNew: Boolean(body.isNew),
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : stockVal > 0,
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
