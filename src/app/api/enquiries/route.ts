import { NextResponse } from "next/server";
import { getEnquiries, createEnquiry } from "@/lib/db";
import { isShopifyAdminConfigured, shopifyAdminFetch } from "@/lib/shopify";

export async function GET() {
  try {
    const enquiries = getEnquiries();
    return NextResponse.json({ success: true, enquiries });
  } catch (error) {
    console.error("GET /api/enquiries error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name || body.fullName || "";
    const mobile = body.mobile || body.phone || "";
    const email = body.email || "";
    const businessName = body.businessName || "";
    const message = body.message || body.requirement || body.notes || "";
    const enquiryType = body.type || "general";

    if (!name || !mobile) {
      return NextResponse.json(
        { success: false, error: "Name and contact phone number are required." },
        { status: 400 }
      );
    }

    // 1. Reliably save enquiry record
    const enquiry = createEnquiry({
      name,
      mobile,
      email,
      productName: body.productName || (businessName ? `Business: ${businessName}` : "General Lead"),
      productId: body.productId || "",
      quantity: body.quantity ? Number(body.quantity) : undefined,
      message: `${message}${businessName ? ` | Business: ${businessName}` : ""}${body.location ? ` | Location: ${body.location}` : ""}`,
    });

    // 2. Synchronize to Shopify Customer / Lead if Admin API is configured
    if (isShopifyAdminConfigured() && (email || mobile)) {
      try {
        const tagMap: Record<string, string> = {
          seller: "Lead - Become a Seller",
          manufacturer: "Lead - Manufacturer",
          wholesale: "Lead - Wholesale B2B",
          product: "Lead - Product Enquiry",
        };
        const leadTag = tagMap[enquiryType] || "Lead - General";

        const customerCreateMutation = `
          mutation customerCreate($input: CustomerInput!) {
            customerCreate(input: $input) {
              customer {
                id
                email
                phone
              }
              userErrors {
                field
                message
              }
            }
          }
        `;

        await shopifyAdminFetch({
          query: customerCreateMutation,
          variables: {
            input: {
              firstName: name.split(" ")[0] || name,
              lastName: name.split(" ").slice(1).join(" ") || "Lead",
              email: email || undefined,
              phone: mobile.startsWith("+") ? mobile : `+91${mobile.replace(/[^0-9]/g, "").slice(-10)}`,
              note: `BHAYA INDIA ${enquiryType.toUpperCase()} Enquiry: ${message}. Business: ${businessName || "N/A"}`,
              tags: [leadTag, "Bhaya India", "Storefront Lead"],
            },
          },
        });
      } catch (shopifyErr) {
        console.warn("Could not sync lead to Shopify Customer:", shopifyErr);
      }
    }

    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch (error) {
    console.error("POST /api/enquiries error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit enquiry" }, { status: 500 });
  }
}
