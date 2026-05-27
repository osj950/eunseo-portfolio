import { notFound } from "next/navigation";
import SubHeader from "@/components/layout/SubHeader";
import SubFooter from "@/components/layout/SubFooter";
import { getJournalPostBySlug, getJournalPosts } from "@/lib/google-sheets";
import Link from "next/link";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getJournalPosts().catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

const FALLBACK_POSTS: Record<string, { title: string; date: string; tag: string; content: string }> = {
  "body-knows-first": { title: "몸이 먼저 안다는 것",  date: "2026. 05", tag: "SP · 감각",    content: "<p>SP를 공부하며 자꾸 생각하게 되는 것들. 언어보다 먼저 도착하는 감각에 대해.</p>" },
  "childrens-pace":   { title: "아이들의 속도로 걷기", date: "2026. 04", tag: "교육 · 청소년", content: "<p>우다다에서 배운 것. 기다리는 것도 가르치는 것이라는 사실.</p>" },
  "healing-making":   { title: "만드는 것의 치유",     date: "2026. 03", tag: "만들기 · 치유", content: "<p>프랑스자수를 놓으면서, 홈페이지를 만들면서 느끼는 것들.</p>" },
};

export default async function JournalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug).catch(() => null);
  const fallback = FALLBACK_POSTS[slug];
  if (!post && !fallback) notFound();

  const title   = post?.title   ?? fallback.title;
  const date    = post?.date    ?? fallback.date;
  const tag     = (post as unknown as Record<string,string> | null)?.tag ?? fallback.tag;
  const content = post?.content ?? fallback.content;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SubHeader />
      <main style={{ paddingTop: 57, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* 다크 헤더 */}
        <section
          className="r-section"
          style={{ padding: "80px 60px 64px", background: "#2C1810", color: "white" }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Link
              href="/journal"
              style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, color: "#E8B84B", letterSpacing: "0.1em", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32, transition: "opacity 0.2s" }}
            >
              ← 기록으로
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 11, color: "#E8B84B", letterSpacing: "0.1em" }}>
                {date}
              </span>
              {tag && (
                <span style={{ border: "1px solid rgba(232,184,75,0.3)", color: "#F5D98A", padding: "2px 10px", borderRadius: 100, fontSize: 11 }}>
                  {tag}
                </span>
              )}
            </div>
            <h1 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, color: "#F5D98A", lineHeight: 1.35 }}>
              {title}
            </h1>
          </div>
        </section>

        {/* 본문 — flex: 1로 남은 공간 채워 푸터 하단 고정 */}
        <section
          className="r-section"
          style={{ padding: "64px 60px 96px", background: "#FBF7F0", flex: 1 }}
        >
          <div
            className="journal-content"
            style={{ maxWidth: 720, margin: "0 auto", fontSize: 16, color: "#3D2314", lineHeight: 1.9, fontWeight: 300 }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </section>
      </main>
      <SubFooter />
    </div>
  );
}
