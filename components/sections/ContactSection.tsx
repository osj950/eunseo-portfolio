"use client";

export default function ContactSection() {
  return (
    <section id="contact" className="section-pad" style={{ padding: "96px 60px", background: "#edd6e4" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>

        {/* eyebrow */}
        <div
          style={{ display: "flex", justifyContent: "center", fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#c47a9a", marginBottom: 14 }}
        >
          연락하기
        </div>

        <h2
          style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#2d1a35", lineHeight: 1.25, marginBottom: 12 }}
        >
          함께 만들어요
        </h2>

        <p
          style={{ fontSize: 15, color: "#8a5278", lineHeight: 1.85, maxWidth: 400, margin: "0 auto 44px", fontWeight: 300 }}
        >
          홈페이지 제작, 번역, 영상 작업 등 편하게 연락주세요.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <a
            href="mailto:osj950@gmail.com"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#c0395e",
              border: "1px solid #c0395e",
              color: "white",
              padding: "13px 26px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#a93256")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#c0395e")}
          >
            ✉️ 이메일 보내기
          </a>

          {[
            { label: "💬 카카오톡", href: "#" },
            { label: "📷 인스타그램", href: "https://www.instagram.com/eun.maker/" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href !== "#" ? "_blank" : undefined}
              rel={href !== "#" ? "noopener noreferrer" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "white",
                border: "1px solid rgba(125,53,88,0.12)",
                color: "#7d3558",
                padding: "13px 26px",
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#7d3558";
                e.currentTarget.style.color = "#fce8f4";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.color = "#7d3558";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
