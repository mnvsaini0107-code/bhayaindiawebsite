import Link from "next/link";
import { getProducts, getCategories, getEnquiries, getOrders } from "@/lib/db";
import { getShopifyStoreDomain, isShopifyConfigured, isShopifyAdminConfigured } from "@/lib/shopify";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const products = getProducts();
  const categories = getCategories();
  const enquiries = getEnquiries();
  const orders = getOrders();

  const isConfigured = isShopifyConfigured();
  const isAdminConfigured = isShopifyAdminConfigured();
  const shopifyDomain = getShopifyStoreDomain() || "bhaya-india.myshopify.com";
  const cleanDomain = shopifyDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const shopifyAdminUrl = `https://admin.shopify.com/store/${cleanDomain.replace(".myshopify.com", "")}`;

  const activeLeads = enquiries.filter((e) => e.status !== "Closed");
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className={styles.container}>
      {/* Primary Shopify Hub Notice */}
      <div
        style={{
          background: "linear-gradient(135deg, #123456 0%, #0a1f33 100%)",
          color: "#ffffff",
          padding: "1.75rem",
          borderRadius: "var(--radius-md, 8px)",
          marginBottom: "1.75rem",
          border: "1px solid rgba(197, 160, 89, 0.4)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.25rem" }}>🛍️</span>
              <h2 style={{ fontSize: "1.25rem", margin: 0, color: "var(--gold, #c5a059)" }}>
                SHOPIFY ADMIN — Primary Commerce Source of Truth
              </h2>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: isConfigured ? "rgba(74, 222, 128, 0.2)" : "rgba(234, 179, 8, 0.2)",
                  color: isConfigured ? "#4ade80" : "#facc15",
                  fontWeight: 600,
                }}
              >
                {isConfigured && isAdminConfigured ? "Live Sync Active" : isConfigured ? "Connected" : "Setup Mode"}
              </span>
            </div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", maxWidth: "750px", lineHeight: 1.5 }}>
              All products, prices, variants, inventory, collections, orders, and customer accounts are managed primarily through{" "}
              <strong>Shopify Admin</strong>. Changes made in Shopify automatically synchronize to the BHAYA INDIA frontend.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <a
              href={shopifyAdminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ background: "var(--gold, #c5a059)", color: "#123456", fontWeight: 600, padding: "10px 20px" }}
            >
              Open Shopify Admin ↗
            </a>
            <a
              href="/data/shopify_products_import.csv"
              download="shopify_products_import.csv"
              className="btn btn-secondary"
              style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.3)", padding: "10px 16px" }}
              title="Download standard Shopify CSV export with all 6 products ready for 1-click import"
            >
              Download Shopify CSV
            </a>
          </div>
        </div>

        {/* Quick Shopify Deep Links */}
        <div
          style={{
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            gap: "1.25rem",
            flexWrap: "wrap",
            fontSize: "0.85rem",
          }}
        >
          <a
            href={`${shopifyAdminUrl}/products`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.9)", textDecoration: "underline" }}
          >
            Manage Products & Prices ↗
          </a>
          <a
            href={`${shopifyAdminUrl}/orders`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.9)", textDecoration: "underline" }}
          >
            Manage Orders & Dispatches ↗
          </a>
          <a
            href={`${shopifyAdminUrl}/customers`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.9)", textDecoration: "underline" }}
          >
            Manage Customers ↗
          </a>
          <a
            href={`${shopifyAdminUrl}/collections`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.9)", textDecoration: "underline" }}
          >
            Manage Collections ↗
          </a>
          <a
            href={`${shopifyAdminUrl}/discounts`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.9)", textDecoration: "underline" }}
          >
            Discounts & Coupons ↗
          </a>
        </div>
      </div>

      <div className={styles.welcomeBanner}>
        <div>
          <h1 className={styles.pageHeading}>Overview Dashboard</h1>
          <p className={styles.pageSub}>
            Catalogue items, customer enquiries, orders, and content overview.
          </p>
        </div>
        <a
          href={`${shopifyAdminUrl}/products/new`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.actionBtn}
        >
          + Add Product on Shopify ↗
        </a>
      </div>

      {/* Metrics Row */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📦</span>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Active Products</span>
            <span className={styles.statValue}>{products.length}</span>
            <span className={styles.statMeta}>{categories.length} Categories</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statIcon}>📩</span>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Active Leads</span>
            <span className={styles.statValue}>{activeLeads.length}</span>
            <span className={styles.statMeta}>{enquiries.length} Total Received</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statIcon}>🛍️</span>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Orders</span>
            <span className={styles.statValue}>{orders.length}</span>
            <span className={styles.statMeta}>
              {orders.filter((o) => o.orderStatus === "Processing").length} In Processing
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statIcon}>💰</span>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Paid Revenue</span>
            <span className={styles.statValue}>₹{totalRevenue.toLocaleString("en-IN")}</span>
            <span className={styles.statMeta}>Delivered / Verified</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className={styles.quickSection}>
        <h2 className={styles.sectionTitle}>Administrative & CMS Quick Actions</h2>
        <div className={styles.quickGrid}>
          <a href={`${shopifyAdminUrl}/products`} target="_blank" rel="noopener noreferrer" className={styles.quickCard}>
            <span className={styles.quickIcon}>📦</span>
            <div>
              <strong>Shopify Product Catalog ↗</strong>
              <p>Add products, change prices, edit descriptions, upload imagery</p>
            </div>
          </a>
          <a href={`${shopifyAdminUrl}/collections`} target="_blank" rel="noopener noreferrer" className={styles.quickCard}>
            <span className={styles.quickIcon}>🏷️</span>
            <div>
              <strong>Shopify Collections ↗</strong>
              <p>Organize product taxonomy, automated tags, and showcase categories</p>
            </div>
          </a>
          <Link href="/admin/content" className={styles.quickCard}>
            <span className={styles.quickIcon}>✍️</span>
            <div>
              <strong>Homepage CMS</strong>
              <p>Edit hero headlines, brand story, and why choose us copy</p>
            </div>
          </Link>
          <Link href="/admin/settings" className={styles.quickCard}>
            <span className={styles.quickIcon}>⚙️</span>
            <div>
              <strong>Business Contact & WhatsApp</strong>
              <p>Update phone numbers, WhatsApp, address, and social links</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Tables Row: Recent Leads & Recent Orders */}
      <div className={styles.tablesRow}>
        {/* Recent Enquiries */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3>Recent Customer Enquiries</h3>
            <Link href="/admin/enquiries" className={styles.viewLink}>
              View All ({enquiries.length}) →
            </Link>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.slice(0, 5).map((enq) => (
                  <tr key={enq.id}>
                    <td>
                      <strong>{enq.name}</strong>
                      <span className={styles.subText}>{enq.mobile}</span>
                    </td>
                    <td>{enq.productName}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          enq.status === "New"
                            ? styles.statusNew
                            : enq.status === "In Progress"
                            ? styles.statusProgress
                            : styles.statusClosed
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3>Recent Web Orders</h3>
            <Link href="/admin/orders" className={styles.viewLink}>
              View All ({orders.length}) →
            </Link>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                      <span className={styles.subText}>{order.paymentMethod}</span>
                    </td>
                    <td>{order.customerName}</td>
                    <td>
                      <strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles.statusProgress}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
