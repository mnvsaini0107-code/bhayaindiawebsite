import { NextResponse } from "next/server";
import { getServices, saveService, deleteService } from "@/lib/db";

export async function GET() {
  try {
    const services = getServices();
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: "Service title is required" }, { status: 400 });
    }

    const service = saveService(body);
    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json({ success: false, error: "Failed to create service" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Service ID is required" }, { status: 400 });
    }

    const service = saveService(body);
    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("PUT /api/services error:", error);
    return NextResponse.json({ success: false, error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Service ID required" }, { status: 400 });
    }

    const deleted = deleteService(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("DELETE /api/services error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete service" }, { status: 500 });
  }
}
