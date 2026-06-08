"use client";

export default function MainHeader() {
  return (
    <nav
      className="r-nav"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 60px",
        background: "rgba(245,230,237,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(125,53,88,0.1)",
      }}
    >
      <a
        href="#home"
        style={{ textDecoration: "none", fontFamily: "var(--font-playfair-display)", fontSize: 18, color: "#7d3558" }}
      >
        Eunseo Ok
        <span style={{ display: "block", fontSize: 11, color: "#c47a9a", letterSpacing: "0.1em" }}>옥은서</span>
      </a>

      <ul className="r-nav-links" style={{ display: "flex", gap: 32, listStyle: "none" }}>
        {[
          { href: "#about",   label: "나는" },
          { href: "#work",    label: "작업물" },
          { href: "#journal", label: "기록" },
          { href: "#contact", label: "연락" },
        ].map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              className="nav-link"
              style={{ textDecoration: "none", fontSize: 13, color: "#8a5278", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#7d3558")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8a5278")}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
