import { NextResponse } from "next/server";
import {
  getUserByPhoneOrEmail,
  saveUser,
  addUserAddress,
  deleteUserAddress,
} from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "register") {
      const { name, phone, email, password } = body;
      if (!name || !phone) {
        return NextResponse.json({ success: false, error: "Name and phone number are required." }, { status: 400 });
      }

      const existing = getUserByPhoneOrEmail(phone);
      if (existing) {
        return NextResponse.json({ success: false, error: "An account with this phone number already exists. Please sign in." }, { status: 400 });
      }

      const newUser = saveUser({
        name,
        phone,
        email: email || "",
        password: password || "",
        addresses: [],
      });

      return NextResponse.json({ success: true, user: newUser });
    }

    if (action === "login") {
      const { identifier } = body;
      if (!identifier) {
        return NextResponse.json({ success: false, error: "Phone number or email is required." }, { status: 400 });
      }

      let user = getUserByPhoneOrEmail(identifier);
      if (!user) {
        // Auto-provision customer profile for first-time phone lookup
        const cleanPhone = identifier.replace(/[^0-9]/g, "");
        if (cleanPhone.length >= 10) {
          user = saveUser({
            name: "Customer",
            phone: cleanPhone,
            email: "",
            addresses: [],
          });
        } else {
          return NextResponse.json({ success: false, error: "Account not found. Please register first." }, { status: 404 });
        }
      }

      return NextResponse.json({ success: true, user });
    }

    if (action === "add_address") {
      const { userId, address } = body;
      if (!userId || !address) {
        return NextResponse.json({ success: false, error: "Invalid address payload." }, { status: 400 });
      }

      const updated = addUserAddress(userId, address);
      if (!updated) {
        return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
      }

      return NextResponse.json({ success: true, user: updated });
    }

    if (action === "delete_address") {
      const { userId, addressId } = body;
      if (!userId || !addressId) {
        return NextResponse.json({ success: false, error: "Invalid address ID." }, { status: 400 });
      }

      const updated = deleteUserAddress(userId, addressId);
      return NextResponse.json({ success: true, user: updated });
    }

    if (action === "update_profile") {
      const { userId, name, email } = body;
      const user = saveUser({
        id: userId,
        name,
        email,
        phone: body.phone,
        addresses: body.addresses || [],
      });
      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (err) {
    console.error("Customer auth API error:", err);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
