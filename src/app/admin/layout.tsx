"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./admin.module.css";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Products", href: "/admin/products", icon: "📦" },
  { label: "Categories", href: "/admin/categories", icon: "🏷️" },
  { label: "Leads & Enquiries", href: "/admin/enquiries", icon: "📩" },
  { label: "Orders", href: "/admin/orders", icon: "🛍️" },
  { label: "Homepage CMS", href: "/admin/content", icon: "✍️" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "⭐" },
  { label: "FAQs", href: "/admin/faqs", icon: "❓" },
  { label: "Gallery", href: "/admin/gallery", icon: "🖼️" },
  { label: "Business Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render children directly without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brandHeader}>
          <div className={styles.logoWrapper}>
            <Image
              src="/assets/bhaya-india-logo.png"
              alt="Bhaya India Logo"
              width={36}
              height={36}
              className={styles.logoImg}
            />
          </div>
          <div>
            <span className={styles.brandName}>BHAYA INDIA</span>
            <span className={styles.adminBadge}>Admin CMS</span>
          </div>
        </div>

        <nav className={styles.navMenu}>
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navActive : ""}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" target="_blank" className={styles.viewSiteBtn}>
            🌐 View Public Site
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <header className={styles.topHeader}>
          <div className={styles.headerTitle}>
            <span>Admin Control Center</span>
          </div>
          <div className={styles.headerUser}>
            <span className={styles.userDot} />
            <span>Store Administrator</span>
          </div>
        </header>

        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
}
