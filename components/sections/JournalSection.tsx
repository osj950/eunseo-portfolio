"use client";

import { JournalPost } from "@/lib/types";

interface Props {
  posts?: JournalPost[];
}

export default function JournalSection({ posts }: Props) {
  const items = (posts ?? []).slice(0, 3);

  return (
    <section
      id="journal"
      className="r-section"
      style={{ padding: "96px 60px", background: "#2d1a35", color: "white" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div
            className="eyebrow-line"
            style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#d9709a", marginBottom: 14 }}
          >
            기록
          </div>
          <h2 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#f0aece", lineHeight: 1.25, marginBottom: 12 }}>
            생각들
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, maxWidth: 500, fontWeight: 300 }}>
            배우고 가르치며 쌓이는 생각들을 기록합니다.
          </p>
        </div>

        {/* repeat(3,1fr) */}
        <div className="journal-card-grid">
          {items.map((post) => (
            <a
              key={post.id}
              href={`/journal/${post.slug}`}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(217,112,154,0.15)",
                borderRadius: 16, padding: "28px 24px",
                display: "block", textDecoration: "none",
                transition: "background 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(217,112,154,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 11, color: "#d9709a", letterSpacing: "0.1em", marginBottom: 12 }}>
                {post.date}
              </div>
              <h3 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 10, lineHeight: 1.5 }}>
                {post.title}
              </h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 300 }}>
                {post.excerpt}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
