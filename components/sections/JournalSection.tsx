"use client";

import { JournalPost } from "@/lib/types";

const FALLBACK: (JournalPost & { tag: string })[] = [
  { id: "1", slug: "body-knows-first", title: "몸이 먼저 안다는 것",  excerpt: "SP를 공부하며 자꾸 생각하게 되는 것들. 언어보다 먼저 도착하는 감각에 대해.", date: "2026. 05", tag: "SP · 감각",    content: "", createdAt: "" },
  { id: "2", slug: "childrens-pace",   title: "아이들의 속도로 걷기", excerpt: "우다다에서 배운 것. 기다리는 것도 가르치는 것이라는 사실.",           date: "2026. 04", tag: "교육 · 청소년", content: "", createdAt: "" },
  { id: "3", slug: "healing-making",   title: "만드는 것의 치유",     excerpt: "프랑스자수를 놓으면서, 홈페이지를 만들면서 느끼는 것들.",             date: "2026. 03", tag: "만들기 · 치유", content: "", createdAt: "" },
];

interface Props {
  posts?: (JournalPost & { tag?: string })[];
}

export default function JournalSection({ posts }: Props) {
  const items = ((posts && posts.length > 0 ? posts : FALLBACK).slice(0, 3)) as typeof FALLBACK;

  return (
    <section
      id="journal"
      className="r-section"
      style={{ padding: "96px 60px", background: "#2C1810", color: "white" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div
            className="eyebrow-line"
            style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#E8B84B", marginBottom: 14 }}
          >
            기록
          </div>
          <h2 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#F5D98A", lineHeight: 1.25, marginBottom: 12 }}>
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
                border: "1px solid rgba(232,184,75,0.15)",
                borderRadius: 16, padding: "28px 24px",
                display: "block", textDecoration: "none",
                transition: "background 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(232,184,75,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 11, color: "#E8B84B", letterSpacing: "0.1em", marginBottom: 12 }}>
                {post.date}
              </div>
              <h3 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 10, lineHeight: 1.5 }}>
                {post.title}
              </h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 300 }}>
                {post.excerpt}
              </p>
              {post.tag && (
                <span style={{ display: "inline-block", marginTop: 16, border: "1px solid rgba(232,184,75,0.3)", color: "#F5D98A", padding: "3px 10px", borderRadius: 100, fontSize: 11 }}>
                  {post.tag}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
