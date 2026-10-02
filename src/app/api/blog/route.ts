import { NextResponse } from "next/server";
import { getBlogs, saveBlog, deleteBlog, getBlogBySlug } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const query = searchParams.get("q")?.toLowerCase();

    if (slug) {
      const blog = getBlogBySlug(slug);
      if (!blog) {
        return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, blog });
    }

    let blogs = getBlogs();

    if (category && category !== "all") {
      blogs = blogs.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }

    if (query) {
      blogs = blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.excerpt.toLowerCase().includes(query) ||
          b.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({ success: true, blogs, count: blogs.length });
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    const blog = saveBlog(body);
    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error) {
    console.error("POST /api/blog error:", error);
    return NextResponse.json({ success: false, error: "Failed to create publication" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Article ID is required" }, { status: 400 });
    }

    const blog = saveBlog(body);
    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error("PUT /api/blog error:", error);
    return NextResponse.json({ success: false, error: "Failed to update publication" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Article ID required" }, { status: 400 });
    }

    const deleted = deleteBlog(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("DELETE /api/blog error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete publication" }, { status: 500 });
  }
}
