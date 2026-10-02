import { NextResponse } from "next/server";
import { getTeam, saveTeam, deleteTeam } from "@/lib/db";

export async function GET() {
  try {
    const team = getTeam();
    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error("GET /api/team error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch team" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.role) {
      return NextResponse.json({ success: false, error: "Name and role are required" }, { status: 400 });
    }

    const member = saveTeam(body);
    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (error) {
    console.error("POST /api/team error:", error);
    return NextResponse.json({ success: false, error: "Failed to create team member" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Member ID is required" }, { status: 400 });
    }

    const member = saveTeam(body);
    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error("PUT /api/team error:", error);
    return NextResponse.json({ success: false, error: "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Member ID required" }, { status: 400 });
    }

    const deleted = deleteTeam(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error("DELETE /api/team error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete team member" }, { status: 500 });
  }
}
