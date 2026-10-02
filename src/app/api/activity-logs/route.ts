import { NextResponse } from "next/server";
import { getActivityLogs, logActivity } from "@/lib/db";

export async function GET() {
  try {
    const logs = getActivityLogs();
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("GET /api/activity-logs error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch activity logs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.action || !body.object) {
      return NextResponse.json({ success: false, error: "Action and object required" }, { status: 400 });
    }

    const log = logActivity(body.user || "Admin", body.action, body.object, body.details);
    return NextResponse.json({ success: true, log }, { status: 201 });
  } catch (error) {
    console.error("POST /api/activity-logs error:", error);
    return NextResponse.json({ success: false, error: "Failed to create activity log" }, { status: 500 });
  }
}
