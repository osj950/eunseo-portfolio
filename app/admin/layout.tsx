"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin",             label: "대시보드",   icon: "◆" },
  { href: "/admin/journal",     label: "기록",       icon: "✍️" },
  { href: "/admin/works",       label: "작업물",     icon: "🌐" },
  { href: "/admin/inquiries",   label: "문의",       icon: "✉️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f5e6ed" }}>
      {/* 사이드바 */}
      <aside style={{ width: 220, flexShrink: 0, background: "#2d1a35", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" style={{ textDecoration: "none", fontFamily: "var(--font-playfair-display)", fontSize: 16, color: "#f0aece", display: "block" }}>
            Eunseo Ok
          </Link>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4, display: "block" }}>
            Admin
          </span>
        </div>
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {NAV.map(({ href, label, icon }) => {
            const exact = href === "/admin";
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 8, marginBottom: 2,
                  fontSize: 13, textDecoration: "none",
                  background: active ? "rgba(217,112,154,0.12)" : "transparent",
                  color: active ? "#f0aece" : "rgba(255,255,255,0.5)",
                  fontWeight: active ? 500 : 400,
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                <span style={{ fontSize: 14 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
            ← 사이트로 돌아가기
          </Link>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main style={{ flex: 1, padding: "48px 48px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
