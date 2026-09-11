import Link from "next/link";
import { getProducts, getCategories, getEnquiries, getOrders } from "@/lib/db";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const products = getProducts();
  const categories = getCategories();
  const enquiries = getEnquiries();
  const orders = getOrders();

  const activeLeads = enquiries.filter((e) => e.status !== "Closed");
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className={styles.container}>
      <div className={styles.welcomeBanner}>
        <div>
          <h1 className={styles.pageHeading}>Overview Dashboard</h1>
          <p className={styles.pageSub}>
            Manage all catalogue items, customer enquiries, orders, and content without editing code.
          </p>
        </div>
        <Link href="/admin/products?new=true" className={styles.actionBtn}>
          + Add New Product
        </Link>
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
        <h2 className={styles.sectionTitle}>Administrative Quick Actions</h2>
        <div className={styles.quickGrid}>
          <Link href="/admin/products" className={styles.quickCard}>
            <span className={styles.quickIcon}>📦</span>
            <div>
              <strong>Manage Products</strong>
              <p>Add, edit prices, upload images, update specifications</p>
            </div>
          </Link>
          <Link href="/admin/categories" className={styles.quickCard}>
            <span className={styles.quickIcon}>🏷️</span>
            <div>
              <strong>Categories & Subcategories</strong>
              <p>Organize product taxonomy and showcase categories</p>
            </div>
          </Link>
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
