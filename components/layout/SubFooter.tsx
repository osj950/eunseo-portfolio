import Link from "next/link";

export default function SubFooter() {
  return (
    <footer
      className="r-footer"
      style={{
        background: "#2C1810", color: "rgba(255,255,255,0.4)",
        padding: "32px 60px", fontSize: 12,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}
    >
      <span style={{ fontFamily: "var(--font-playfair-display)", color: "#F5D98A", fontSize: 14 }}>
        Eunseo Ok · 옥은서
      </span>
      <div style={{ display: "flex", gap: 24 }}>
        {[
          { href: "/work",    label: "작업물" },
          { href: "/journal", label: "기록" },
          { href: "/contact", label: "연락" },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 12, transition: "color 0.2s" }}>
            {label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
