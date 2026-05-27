"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/work",    label: "작업물" },
  { href: "/journal", label: "기록" },
  { href: "/contact", label: "연락" },
];

export default function SubHeader() {
  const pathname = usePathname();

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
      <Link
        href="/"
        style={{ textDecoration: "none", fontFamily: "var(--font-playfair-display)", fontSize: 18, color: "#6B4226" }}
      >
        Eunseo Ok
        <span style={{ display: "block", fontSize: 11, color: "#C4956A", letterSpacing: "0.1em" }}>옥은서</span>
      </Link>

      <ul className="r-nav-links" style={{ display: "flex", gap: 32, listStyle: "none" }}>
        {NAV.map(({ href, label }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className="nav-link"
                style={{
                  textDecoration: "none",
                  fontSize: 13,
                  color: active ? "#6B4226" : "#7A5C4A",
                  fontWeight: active ? 500 : 400,
                  transition: "color 0.2s",
                }}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
