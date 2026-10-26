import { getUsers, getOrders } from "@/lib/db";
import { Users, ShoppingBag, MapPin, Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminCustomersPage() {
  const users = getUsers();
  const orders = getOrders();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.6rem", color: "var(--navy)", fontWeight: 700, margin: "0 0 0.25rem" }}>
          Customers & Client Accounts
        </h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
          Registered customer accounts, saved delivery addresses, and connected order histories.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "rgba(18, 52, 86, 0.08)", color: "var(--navy)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600, display: "block" }}>Total Accounts</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)" }}>{users.length}</span>
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.1)", color: "#059669", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: 600, display: "block" }}>Total Placed Orders</span>
            <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--navy)" }}>{orders.length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase" }}>
                <th style={{ padding: "0.85rem 1rem" }}>Customer</th>
                <th style={{ padding: "0.85rem 1rem" }}>Contact</th>
                <th style={{ padding: "0.85rem 1rem" }}>Saved Addresses</th>
                <th style={{ padding: "0.85rem 1rem" }}>Orders Placed</th>
                <th style={{ padding: "0.85rem 1rem" }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#64748b" }}>
                    No customer accounts registered yet. Guest orders and accounts appear here dynamically as customers register.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const customerOrders = orders.filter(
                    (o) => o.phone.includes(u.phone) || (u.email && o.email.toLowerCase() === u.email.toLowerCase())
                  );

                  return (
                    <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "1rem" }}>
                        <strong style={{ color: "var(--navy)", display: "block" }}>{u.name}</strong>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>ID: {u.id}</span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#334155" }}>
                          <Phone size={13} color="#64748b" />
                          <span>{u.phone}</span>
                        </div>
                        {u.email && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#64748b", fontSize: "0.78rem", marginTop: "2px" }}>
                            <Mail size={13} color="#94a3b8" />
                            <span>{u.email}</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600 }}>
                          <MapPin size={12} />
                          <span>{u.addresses ? u.addresses.length : 0} saved</span>
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ fontWeight: 600, color: "var(--navy)" }}>{customerOrders.length} orders</span>
                      </td>
                      <td style={{ padding: "1rem", color: "#64748b", fontSize: "0.8rem" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
