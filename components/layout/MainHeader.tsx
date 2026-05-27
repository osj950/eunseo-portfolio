"use client";

export default function MainHeader() {
  return (
    <nav
      className="r-nav"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 60px",
        background: "rgba(251,247,240,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(107,66,38,0.1)",
      }}
    >
      <a
        href="#home"
        style={{ textDecoration: "none", fontFamily: "var(--font-playfair-display)", fontSize: 18, color: "#6B4226" }}
      >
        Eunseo Ok
        <span style={{ display: "block", fontSize: 11, color: "#C4956A", letterSpacing: "0.1em" }}>옥은서</span>
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
              style={{ textDecoration: "none", fontSize: 13, color: "#7A5C4A", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#6B4226")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7A5C4A")}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
