import { NextResponse } from "next/server";
import { getActivityLogs, logActivity } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin session required." },
      { status: 401 }
    );
  }

  try {
    const logs = getActivityLogs();
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("GET /api/activity-logs error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch activity logs" }, { status: 500 });
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
