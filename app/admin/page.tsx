import Link from "next/link";
import { getJournalPosts, getWorks, getInquiries } from "@/lib/google-sheets";

export const revalidate = 0;

export default async function AdminDashboard() {
  const [posts, works, inquiries] = await Promise.all([
    getJournalPosts().catch(() => []),
    getWorks().catch(() => []),
    getInquiries().catch(() => []),
  ]);
  const unread = inquiries.filter((i) => i.status === "unread").length;

  const stats = [
    { label: "기록",     count: posts.length,  href: "/admin/journal",   icon: "✍️" },
    { label: "작업물",   count: works.length,  href: "/admin/works",     icon: "🌐" },
    { label: "미확인 문의", count: unread,     href: "/admin/inquiries", icon: "✉️" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <div
          className="eyebrow-line"
          style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#C4956A", marginBottom: 12 }}
        >
          관리자
        </div>
        <h1 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 32, fontWeight: 800, color: "#2C1810" }}>
          대시보드
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 48 }}>
        {stats.map(({ label, count, href, icon }) => (
          <Link
            key={label}
            href={href}
            className="admin-stat-card"
            style={{ background: "white", border: "1px solid rgba(107,66,38,0.1)", borderRadius: 16, padding: "28px 24px", textDecoration: "none", display: "block" }}
          >
            <div style={{ fontSize: 20, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontSize: 11, color: "#C4956A", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, marginBottom: 8 }}>{label}</div>
            <div style={{ fontFamily: "var(--font-playfair-display)", fontSize: 44, fontWeight: 700, color: "#2C1810", lineHeight: 1 }}>{count}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/admin/journal/new" style={{ background: "#6B4226", color: "#FDF3DC", padding: "11px 24px", borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "background 0.2s" }}>
          ✍️ 새 기록 작성
        </Link>
        <Link href="/admin/works" style={{ background: "#F2E8DC", color: "#6B4226", padding: "11px 24px", borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: "none", border: "1px solid rgba(107,66,38,0.15)", transition: "background 0.2s" }}>
          🌐 작업물 관리
        </Link>
      </div>
    </div>
  );
}
