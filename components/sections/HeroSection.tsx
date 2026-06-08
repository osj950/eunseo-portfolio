"use client";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="hero-pad"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "100px 60px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 배경 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 50% 60% at 80% 40%, rgba(217,112,154,0.2) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 10% 80%, rgba(192,57,94,0.08) 0%, transparent 50%), #f5e6ed",
        }}
      />

      {/* 떠다니는 큰 원 */}
      <div
        className="anim-float hidden md:block"
        style={{
          position: "absolute",
          right: "8%",
          top: "50%",
          width: "clamp(280px,35vw,480px)",
          height: "clamp(280px,35vw,480px)",
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 40%, #f0aece, #d9709a)",
          opacity: 0.25,
        }}
      />

      {/* 떠다니는 작은 원 */}
      <div
        className="anim-float-2 hidden md:block"
        style={{
          position: "absolute",
          right: "15%",
          top: "30%",
          width: "clamp(100px,12vw,160px)",
          height: "clamp(100px,12vw,160px)",
          borderRadius: "50%",
          background: "#c0395e",
          opacity: 0.08,
        }}
      />

      {/* 콘텐츠 */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 600 }}>
        {/* eyebrow */}
        <div
          className="anim-fade-1 eyebrow-line-lg eyebrow-line"
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontStyle: "italic",
            fontSize: 13,
            color: "#c47a9a",
            letterSpacing: "0.1em",
            marginBottom: 24,
          }}
        >
          안녕하세요
        </div>

        {/* 이름 (한국어) */}
        <h1
          className="anim-fade-2"
          style={{
            fontFamily: "var(--font-nanum-myeongjo)",
            fontSize: "clamp(52px,8vw,88px)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#2d1a35",
            marginBottom: 8,
          }}
        >
          은서
        </h1>

        {/* 이름 (영문) */}
        <p
          className="anim-fade-3"
          style={{
            fontFamily: "var(--font-playfair-display)",
            fontSize: "clamp(20px,3vw,32px)",
            color: "#c47a9a",
            marginBottom: 32,
            letterSpacing: "0.05em",
          }}
        >
          Eunseo Ok
        </p>

        {/* 한 줄 소개 */}
        <p
          className="anim-fade-4"
          style={{
            fontFamily: "var(--font-nanum-myeongjo)",
            fontSize: "clamp(18px,2.5vw,26px)",
            fontWeight: 700,
            color: "#7d3558",
            marginBottom: 20,
          }}
        >
          배우고, <em style={{ fontStyle: "normal", color: "#c0395e" }}>가르치고</em>, 만드는 사람
        </p>

        {/* 태그 */}
        <div className="anim-fade-5" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 44 }}>
          {[
            { label: "🌱 대안학교 교사", red: false },
            { label: "📖 대학원생", red: false },
            { label: "🌐 웹 제작", red: false },
            { label: "📱 어플 제작", red: false },
            { label: "🎬 영상", red: false },
            { label: "🧵 프랑스자수", red: true },
          ].map(({ label, red }) => (
            <span
              key={label}
              style={{
                background: red ? "rgba(192,57,94,0.08)" : "#edd6e4",
                color: red ? "#c0395e" : "#7d3558",
                padding: "6px 16px",
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 500,
                border: `1px solid ${red ? "rgba(192,57,94,0.2)" : "rgba(125,53,88,0.15)"}`,
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* 버튼 */}
        <div className="anim-fade-6" style={{ display: "flex", gap: 14 }}>
          <a
            href="#work"
            style={{
              background: "#7d3558",
              color: "#fce8f4",
              padding: "13px 32px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              transition: "background 0.2s, transform 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#8b4a72";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#7d3558";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            작업물 보기
          </a>
          <a
            href="#contact"
            style={{
              border: "1.5px solid #c47a9a",
              color: "#7d3558",
              padding: "13px 32px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#7d3558";
              e.currentTarget.style.color = "#fce8f4";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#7d3558";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            연락하기
          </a>
        </div>
      </div>
    </section>
  );
}
