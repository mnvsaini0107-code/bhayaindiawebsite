"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Inbox,
  House,
  Briefcase,
  Newspaper,
  MessageSquareQuote,
  CircleHelp,
  Images,
  SearchCheck,
  ChartNoAxesCombined,
  Activity,
  Clock,
  Settings,
  ExternalLink,
  LogOut,
  Search,
  Languages,
  Menu,
  X,
  ChevronDown,
  Shield,
  User,
  ChevronRight,
} from "lucide-react";
import { AdminLanguageProvider, useAdminLanguage } from "@/context/AdminLanguageContext";
import styles from "./admin.module.css";

interface SearchResult {
  type: string;
  title: string;
  subtitle: string;
  href: string;
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, toggleLang, t } = useAdminLanguage();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close search and profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Debounced live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.results || []);
          setSearchOpen(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  // Nav Groups strictly aligned with user specifications
  const navGroups = [
    {
      title: "OVERVIEW",
      items: [
        { label: t("dashboard"), href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      title: "CATALOG",
      items: [
        { label: t("products"), href: "/admin/products", icon: Package },
        { label: t("categories"), href: "/admin/categories", icon: Tags },
      ],
    },
    {
      title: "COMMERCE",
      items: [
        { label: t("orders"), href: "/admin/orders", icon: ShoppingBag },
        { label: t("customers"), href: "/admin/customers", icon: Users },
        { label: t("leadsCrm"), href: "/admin/enquiries", icon: Inbox },
      ],
    },
    {
      title: "CONTENT",
      items: [
        { label: "Homepage CMS", href: "/admin/content", icon: House },
        { label: t("services"), href: "/admin/services", icon: Briefcase },
        { label: t("publicationsBlog"), href: "/admin/blog", icon: Newspaper },
        { label: t("testimonials"), href: "/admin/testimonials", icon: MessageSquareQuote },
        { label: t("faqs"), href: "/admin/faqs", icon: CircleHelp },
        { label: t("portfolio"), href: "/admin/gallery", icon: Images },
      ],
    },
    {
      title: "SEO & SYSTEM",
      items: [
        { label: t("seoControlCenter"), href: "/admin/seo", icon: SearchCheck },
        { label: t("analytics"), href: "/admin/analytics", icon: ChartNoAxesCombined },
        { label: t("mediaLibrary"), href: "/admin/media", icon: Images },
        { label: t("siteHealth"), href: "/admin/site-health", icon: Activity },
        { label: t("activityLogs"), href: "/admin/activity-logs", icon: Clock },
        { label: t("globalSettings"), href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  // Helper to resolve current page title and breadcrumb
  const currentSection = navGroups.flatMap(g => g.items).find(i => i.href === pathname);
  const breadcrumbTitle = currentSection ? currentSection.label : "Admin Control Center";

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`${styles.drawerOverlay} ${mobileOpen ? styles.drawerOverlayOpen : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Luxury Dark Navy Sidebar */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brandHeader}>
          <div className={styles.logoWrapper}>
            <Image
              src="/assets/bhaya-india-logo.png"
              alt="Bhaya India Logo"
              width={34}
              height={34}
              className={styles.logoImg}
              priority
            />
          </div>
          <div className={styles.brandInfo}>
            <span className={styles.brandName}>BHAYA INDIA</span>
            <span className={styles.adminBadge}>Admin CMS</span>
          </div>
        </div>

        <nav className={styles.navMenu}>
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className={styles.navGroup}>
              <div className={styles.navGroupTitle}>
                <span>{group.title}</span>
              </div>
              {group.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.navActive : ""}`}
                  >
                    <span className={styles.navIcon}>
                      <IconComponent size={18} />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" target="_blank" className={styles.viewSiteBtn}>
            <ExternalLink size={16} />
            <span>{t("viewPublicSite")}</span>
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <header className={styles.topHeader}>
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className={styles.headerLeft}>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={styles.mobileMenuToggle}
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className={styles.headerBreadcrumbs}>
              <div className={styles.breadcrumbTrail}>
                <span>Dashboard</span>
                <ChevronRight size={12} color="#94a3b8" />
                <span className={styles.breadcrumbCurrent}>{breadcrumbTitle}</span>
              </div>
              <h1 className={styles.headerPageTitle}>{breadcrumbTitle}</h1>
            </div>
          </div>

          {/* Center: Global Admin Search */}
          <div className={styles.searchContainer} ref={searchRef}>
            <div className={styles.searchBar}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Search products, orders, leads, pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
                className={styles.searchInput}
              />
              <span className={styles.searchShortcut}>⌘K</span>
            </div>

            {searchOpen && searchResults.length > 0 && (
              <div className={styles.searchResultsDropdown}>
                {searchResults.map((res, i) => (
                  <Link
                    key={i}
                    href={res.href}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className={styles.searchResultItem}
                  >
                    <span className={styles.searchBadge}>{res.type}</span>
                    <div className={styles.searchResultContent}>
                      <div className={styles.searchResultTitle}>{res.title}</div>
                      <div className={styles.searchResultSubtitle}>{res.subtitle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className={styles.headerActions}>
            {/* Live Sync Status */}
            <div className={styles.syncPill} title="Storefront API & Local Catalog Active">
              <span className={styles.pulseDot} />
              <span>LIVE SYNC ACTIVE</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className={styles.langToggleBtn}
              title="Switch language between English and Hindi"
            >
              <Languages size={15} />
              <span>{lang === "en" ? "हिन्दी" : "English"}</span>
            </button>

            {/* Administrator Profile Pill */}
            <div className={styles.profileContainer} ref={profileRef}>
              <button
                className={styles.profilePill}
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
              >
                <div className={styles.profileAvatar}>A</div>
                <div className={styles.profileDetails}>
                  <span className={styles.profileName}>Administrator</span>
                  <span className={styles.profileRole}>Store Admin</span>
                </div>
                <ChevronDown size={14} color="#64748b" />
              </button>

              {profileOpen && (
                <div className={styles.profileDropdown}>
                  <Link
                    href="/admin/settings"
                    className={styles.profileDropdownItem}
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={15} />
                    <span>Store Profile</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    className={styles.profileDropdownItem}
                    onClick={() => setProfileOpen(false)}
                  >
                    <Shield size={15} />
                    <span>Security & Keys</span>
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <button
                    onClick={handleLogout}
                    className={`${styles.profileDropdownItem} ${styles.profileDropdownItemDanger}`}
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLanguageProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminLanguageProvider>
  );
}
