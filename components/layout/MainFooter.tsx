import Link from "next/link";

export default function MainFooter() {
  return (
    <footer
      className="footer-pad"
      style={{
        background: "#2C1810",
        color: "rgba(255,255,255,0.4)",
        padding: "32px 60px",
        fontSize: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <span style={{ fontFamily: "var(--font-playfair-display)", color: "#F5D98A", fontSize: 14 }}>
        Eunseo Ok · 옥은서
      </span>
      <span>배우고, 가르치고, 만드는 사람 🌻</span>
      <Link href="/admin/login" style={{ color: "rgba(255,255,255,0.15)", fontSize: 11, textDecoration: "none", letterSpacing: "0.08em" }}>
        ◆
      </Link>
    </footer>
  );
}
