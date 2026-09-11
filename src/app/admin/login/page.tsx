"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.brandArea}>
          <div className={styles.logoWrapper}>
            <Image
              src="/assets/bhaya-india-logo.png"
              alt="Bhaya India"
              width={72}
              height={72}
              className={styles.logoImg}
            />
          </div>
          <h1 className={styles.brandTitle}>BHAYA INDIA</h1>
          <p className={`${styles.tagline} font-devanagari`}>जहाँ भाया, वहाँ भरोसा</p>
          <span className={styles.panelBadge}>Admin Panel & CMS</span>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              required
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? "Authenticating..." : "Sign In to Admin Dashboard →"}
          </button>
        </form>

        <div className={styles.cardFooter}>
          <p>Default credentials: <strong>admin</strong> / <strong>bhaya@2026</strong></p>
        </div>
      </div>
    </div>
  );
}
