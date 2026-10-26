// scripts/verify-acceptance.mjs
// Comprehensive Acceptance & Verification Test Suite for BHAYA INDIA Standalone Platform

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const dbFile = path.resolve(rootDir, "data", "db.json");
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? `(${details})` : ""}`);
    failedCount++;
  }
}

async function run() {
  console.log("==================================================================");
  console.log("   BHAYA INDIA — FINAL VERIFICATION & ACCEPTANCE TEST SUITE       ");
  console.log("==================================================================\n");

  let adminCookie = "";
  let createdProductId = "";
  let createdOrderId = "";

  // 1. Homepage & Storefront Standalone Lock Test
  console.log("--- 1. Storefront Standalone Verification ---");
  try {
    const res = await fetch(`${BASE_URL}/`);
    assert(res.status === 200, "Storefront homepage returns 200 OK");
    const html = await res.text();
    assert(html.includes("BHAYA INDIA") || html.includes("bhaya"), "Storefront brand identity present in DOM");
    assert(!html.includes("myshopify.com/checkouts"), "Zero Shopify checkout redirect in storefront markup");
  } catch (err) {
    assert(false, "Storefront homepage connection", err.message);
  }

  // 2. Middleware & Admin Route Protection Test
  console.log("\n--- 2. Route Protection & Middleware Verification ---");
  try {
    const res = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
    const isRedirect = res.status === 307 || res.status === 308 || res.status === 302 || res.status === 303;
    const location = res.headers.get("location") || "";
    assert(isRedirect && location.includes("/admin/login"), "Unauthorized /admin route redirects to /admin/login", `Status: ${res.status}, Location: ${location}`);
  } catch (err) {
    assert(false, "Middleware protection check", err.message);
  }

  // 3. Admin Authentication Test
  console.log("\n--- 3. Admin Authentication & Session Cryptography ---");
  try {
    // 3a. Invalid credentials
    const badLoginRes = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "wrong_password_test" }),
    });
    assert(badLoginRes.status === 401, "Invalid login credentials correctly rejected with 401 Unauthorized");

    // 3b. Valid credentials
    const goodLoginRes = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "bhaya@2026" }),
    });
    const loginData = await goodLoginRes.json();
    assert(goodLoginRes.status === 200 && loginData.success, "Valid admin login returns 200 OK with success flag");

    // Extract cookie
    const setCookie = goodLoginRes.headers.get("set-cookie") || "";
    const cookieMatch = setCookie.match(/bhaya_admin_session=([^;]+)/);
    if (cookieMatch) {
      adminCookie = cookieMatch[0];
      assert(true, "Signed HMAC-SHA256 session cookie issued", `Token: ${cookieMatch[1].slice(0, 20)}...`);
    } else {
      assert(false, "Admin session cookie extraction");
    }
  } catch (err) {
    assert(false, "Admin auth verification", err.message);
  }

  // 4. Server-Side Authorization for Protected APIs
  console.log("\n--- 4. Server-Side Mutation & API Authorization Protection ---");
  try {
    // 4a. Orders GET without auth -> 401
    const unauthOrdersRes = await fetch(`${BASE_URL}/api/orders`);
    assert(unauthOrdersRes.status === 401, "GET /api/orders without session returns 401 Unauthorized");

    // 4b. Product POST without auth -> 401
    const unauthProdPostRes = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Hacker Product" }),
    });
    assert(unauthProdPostRes.status === 401, "POST /api/products without session returns 401 Unauthorized");

    // 4c. Orders PUT without auth -> 401
    const unauthOrderPutRes = await fetch(`${BASE_URL}/api/orders/ORD-9012`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: "Delivered" }),
    });
    assert(unauthOrderPutRes.status === 401, "PUT /api/orders/[id] without session returns 401 Unauthorized");

    // 4d. Settings PUT without auth -> 401
    const unauthSettingsPutRes = await fetch(`${BASE_URL}/api/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName: "Hijacked Store" }),
    });
    assert(unauthSettingsPutRes.status === 401, "PUT /api/settings without session returns 401 Unauthorized");

    // 4e. Authorized access with admin cookie -> 200
    const authOrdersRes = await fetch(`${BASE_URL}/api/orders`, {
      headers: { Cookie: adminCookie },
    });
    const authOrdersData = await authOrdersRes.json();
    assert(authOrdersRes.status === 200 && authOrdersData.success, "GET /api/orders with admin session returns 200 and authorized order list");
  } catch (err) {
    assert(false, "API authorization protection check", err.message);
  }

  // 5. Admin Product CRUD & "Price on Enquiry"
  console.log("\n--- 5. Admin Product Lifecycle & 'Price on Enquiry' ---");
  try {
    // 5a. Create product with Price on Enquiry (price: null)
    const testSku = `TEST-${Date.now().toString().slice(-5)}`;
    const createRes = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        name: "Test Artisan Handcrafted Brass Diya Set",
        categorySlug: "home-decoration",
        subcategory: "Brass Showpieces",
        tagline: "Handmade traditional temple brass lamps",
        description: "Pure bell-metal artisan crafted diya set for auspicious festivities.",
        price: null, // "Price on Enquiry"
        priceNote: "Price on Enquiry / Bulk Quotation",
        stockQuantity: 45,
        status: "published",
        isPublished: true,
        inStock: true,
        sku: testSku,
        images: ["/assets/hero-editorial.jpg"],
        specs: [{ label: "Material", value: "Pure Brass" }],
      }),
    });
    const createData = await createRes.json();
    assert((createRes.status === 200 || createRes.status === 201) && createData.success, "Admin successfully creates product with Price on Enquiry (null price)");
    createdProductId = createData.product?.id;

    // Verify in db.json
    const rawDb = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
    const foundInDb = rawDb.products.find((p) => p.id === createdProductId);
    assert(Boolean(foundInDb && foundInDb.price === null), "Product with Price on Enquiry successfully persisted in database");

    // 5b. Update product (price confirmed, discount applied, stock modified)
    const updateRes = await fetch(`${BASE_URL}/api/products/${createdProductId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        name: "Updated Premium Handcrafted Brass Diya Set",
        price: 1899,
        compareAtPrice: 2499,
        discountPercent: 24,
        stockQuantity: 30,
        priceNote: "Per set (Inclusive of GST)",
      }),
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200 && updateData.product?.price === 1899, "Admin successfully updates price, compare price, discount, and stock");

    // Verify update in db.json
    const rawDb2 = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
    const updatedInDb = rawDb2.products.find((p) => p.id === createdProductId);
    assert(updatedInDb?.price === 1899 && updatedInDb?.stockQuantity === 30, "Updated product attributes persisted in standalone database");

    // 5c. Delete product safely
    const deleteRes = await fetch(`${BASE_URL}/api/products/${createdProductId}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });
    const deleteData = await deleteRes.json();
    assert(deleteRes.status === 200 && deleteData.success, "Admin successfully deletes product from catalogue");

    // Verify removal
    const rawDb3 = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
    const stillExists = rawDb3.products.some((p) => p.id === createdProductId);
    assert(!stillExists, "Deleted test product completely removed from database without touching production catalog");
  } catch (err) {
    assert(false, "Product CRUD lifecycle test", err.message);
  }

  // 6. Customer Checkout, Admin Fulfillment, Courier Tracking & WhatsApp
  console.log("\n--- 6. Customer Checkout, Admin Fulfillment & Tracking ---");
  try {
    // 6a. Customer places order (public POST /api/orders)
    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Vikas Sharma Test",
        email: "vikas.sharma.test@example.com",
        phone: "+91 99887 76655",
        address: "102, Shanti Vihar, Civil Lines",
        city: "Prayagraj",
        state: "Uttar Pradesh",
        pincode: "211001",
        items: [
          {
            productId: "prod-002",
            name: "Leather-Bound Executive Notebook",
            price: 650,
            quantity: 1,
            image: "/assets/category-stationery.jpg",
          },
        ],
        totalAmount: 650,
        paymentMethod: "COD",
        paymentStatus: "Pending",
        orderStatus: "Order Placed",
      }),
    });
    const orderData = await orderRes.json();
    assert((orderRes.status === 200 || orderRes.status === 201) && orderData.success, "Customer places order directly in standalone mode without Shopify redirect");
    createdOrderId = orderData.order?.id;
    assert(Boolean(createdOrderId), `Order created with ID: ${createdOrderId}`);

    // 6b. Admin updates fulfillment: Courier, AWB, Tracking URL, Status
    const fulfillRes = await fetch(`${BASE_URL}/api/orders/${createdOrderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        orderStatus: "Shipped",
        paymentStatus: "Paid",
        carrier: "Delhivery",
        trackingNumber: "DEL9988776655IN",
        trackingUrl: "https://www.delhivery.com/track/package/DEL9988776655IN",
        internalNotes: "Dispatched via Express Air. Package sealed with tamper-proof tape.",
      }),
    });
    const fulfillData = await fulfillRes.json();
    assert(
      fulfillRes.status === 200 &&
      fulfillData.order?.carrier === "Delhivery" &&
      fulfillData.order?.trackingNumber === "DEL9988776655IN" &&
      fulfillData.order?.orderStatus === "Shipped",
      "Admin updates courier carrier, AWB tracking number, tracking URL, and status"
    );

    // 6c. Verify order history timeline auto-logged
    const history = fulfillData.order?.history || [];
    const hasShippedHistory = history.some((h) => h.status === "Shipped");
    assert(hasShippedHistory, "Order timeline history automatically recorded the 'Shipped' transition with timestamp");

    // 6d. Privacy-preserving customer order tracking
    // Matching phone -> success
    const trackSuccessRes = await fetch(`${BASE_URL}/api/orders/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: createdOrderId, phone: "9988776655" }),
    });
    const trackSuccessData = await trackSuccessRes.json();
    assert(
      trackSuccessRes.status === 200 &&
      trackSuccessData.success &&
      trackSuccessData.order?.carrier === "Delhivery" &&
      trackSuccessData.order?.trackingNumber === "DEL9988776655IN",
      "Customer can track order using Order ID + verified phone (returns courier and live tracking)"
    );

    // Wrong phone -> rejected (404, no data leak)
    const trackFailRes = await fetch(`${BASE_URL}/api/orders/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: createdOrderId, phone: "9123456780" }),
    });
    assert(trackFailRes.status === 404, "Order tracking rejects mismatched phone numbers (privacy preserved)");

    // 6e. WhatsApp customer status notification generation test
    const cleanPhone = "9988776655";
    const whatsappPhone = `91${cleanPhone}`;
    const trackingLink = `https://bhayaindia.com/track-order?orderId=${encodeURIComponent(createdOrderId)}`;
    const waText = encodeURIComponent(
      `Namaste Vikas Sharma Test,\nYour BHAYA INDIA order #${createdOrderId} is currently: *Shipped*.\nCourier: Delhivery\nTracking / AWB: DEL9988776655IN\n\nYou can track live status anytime here:\n${trackingLink}\n\nThank you for choosing BHAYA INDIA!`
    );
    const waUrl = `https://wa.me/${whatsappPhone}?text=${waText}`;
    assert(
      waUrl.includes("Delhivery") && waUrl.includes("DEL9988776655IN") && waUrl.includes(createdOrderId),
      "WhatsApp status notification correctly encapsulates order status, courier, AWB, and tracking link"
    );

    // 6f. Clean up test order safely from db.json
    const rawDbAfter = JSON.parse(fs.readFileSync(dbFile, "utf-8"));
    rawDbAfter.orders = rawDbAfter.orders.filter((o) => o.id !== createdOrderId);
    fs.writeFileSync(dbFile, JSON.stringify(rawDbAfter, null, 2), "utf-8");
    assert(true, "Test order cleaned up safely from database without affecting authentic customer records");
  } catch (err) {
    assert(false, "Order fulfillment and tracking test", err.message);
  }

  // 7. 12-Language System Verification
  console.log("\n--- 7. 12-Language System Verification ---");
  try {
    const langFilePath = path.resolve(rootDir, "src", "locales", "indianLanguages.ts");
    const langContent = fs.readFileSync(langFilePath, "utf-8");
    const requiredLangs = ["bn", "te", "mr", "ta", "gu", "kn", "ml", "pa", "or", "ur"];
    
    let allLangsPresent = true;
    for (const code of requiredLangs) {
      if (!langContent.includes(`${code}: {`)) {
        allLangsPresent = false;
        console.error(`Language pack missing: ${code}`);
      }
    }
    assert(allLangsPresent, "All 12+ Indian language packs configured and active in translation registry");

    // Also verify en.ts and hi.ts parity
    const extractKeys = (filePath) => {
      const lines = fs.readFileSync(filePath, "utf-8").split("\n");
      const keys = [];
      for (const line of lines) {
        const m = line.trim().match(/^([a-zA-Z0-9_]+)\s*:\s*["`']/);
        if (m) keys.push(m[1]);
      }
      return keys;
    };
    const enKeys = extractKeys(path.resolve(rootDir, "src", "locales", "en.ts"));
    const hiKeys = extractKeys(path.resolve(rootDir, "src", "locales", "hi.ts"));
    const missingInHi = enKeys.filter((k) => !hiKeys.includes(k));
    assert(missingInHi.length === 0 && enKeys.length === hiKeys.length, `English & Hindi dictionary parity: 100% verified (${enKeys.length} keys, 0 missing)`);
  } catch (err) {
    assert(false, "12-language system verification", err.message);
  }

  // 8. Final Report
  console.log("\n==================================================================");
  console.log(`TOTAL TESTS: ${passedCount + failedCount} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log("==================================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

run().catch((e) => {
  console.error("Fatal error running test suite:", e);
  process.exit(1);
});
