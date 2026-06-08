import SubHeader from "@/components/layout/SubHeader";
import SubFooter from "@/components/layout/SubFooter";
import { getJournalPosts } from "@/lib/google-sheets";
import Link from "next/link";

export const dynamic = "force-dynamic";

const FALLBACK = [
  { id: "1", slug: "body-knows-first", title: "몸이 먼저 안다는 것",  excerpt: "SP를 공부하며 자꾸 생각하게 되는 것들. 언어보다 먼저 도착하는 감각에 대해.", date: "2026. 05", tag: "SP · 감각",    content: "", createdAt: "" },
  { id: "2", slug: "childrens-pace",   title: "아이들의 속도로 걷기", excerpt: "우다다에서 배운 것. 기다리는 것도 가르치는 것이라는 사실.",           date: "2026. 04", tag: "교육 · 청소년", content: "", createdAt: "" },
  { id: "3", slug: "healing-making",   title: "만드는 것의 치유",     excerpt: "프랑스자수를 놓으면서, 홈페이지를 만들면서 느끼는 것들.",             date: "2026. 03", tag: "만들기 · 치유", content: "", createdAt: "" },
];

export default async function JournalPage() {
  const raw = await getJournalPosts().catch(() => []);
  const posts = raw.length > 0 ? raw : FALLBACK;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SubHeader />
      <main style={{ paddingTop: 57, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* 페이지 헤더 — 다크 배경 (시안 journal 섹션과 동일) */}
        <section
          className="r-section"
          style={{ padding: "80px 60px 64px", background: "#2C1810", color: "white" }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div
              className="eyebrow-line"
              style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#E8B84B", marginBottom: 14 }}
            >
              기록
            </div>
            <h1 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#F5D98A", lineHeight: 1.25, marginBottom: 12 }}>
              생각들
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, maxWidth: 500, fontWeight: 300 }}>
              배우고 가르치며 쌓이는 생각들을 기록합니다.
            </p>
          </div>
        </section>

        {/* 기록 목록 */}
        <section
          className="r-section"
          style={{ padding: "64px 60px 96px", background: "#FBF7F0", flex: 1 }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                className="hover-fade"
                style={{
                  display: "block",
                  padding: "28px 0",
                  borderBottom: i < posts.length - 1 ? "1px solid rgba(107,66,38,0.1)" : "none",
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 10 }}>
                  <div style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 11, color: "#E8B84B", letterSpacing: "0.1em" }}>
                    {(post as typeof FALLBACK[0]).date || post.createdAt?.slice(0, 7)}
                  </div>
                  {(post as typeof FALLBACK[0]).tag && (
                    <span style={{ border: "1px solid rgba(107,66,38,0.2)", color: "#C4956A", padding: "2px 10px", borderRadius: 100, fontSize: 11, whiteSpace: "nowrap" }}>
                      {(post as typeof FALLBACK[0]).tag}
                    </span>
                  )}
                </div>
                <h2 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: "clamp(17px,2.5vw,22px)", fontWeight: 700, color: "#2C1810", lineHeight: 1.4, marginBottom: 10 }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: 14, color: "#7A5C4A", lineHeight: 1.75, fontWeight: 300 }}>
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SubFooter />
    </div>
  );
}
