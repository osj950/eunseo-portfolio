"use client";

import { useState } from "react";
import SubHeader from "@/components/layout/SubHeader";
import SubFooter from "@/components/layout/SubFooter";

type ThumbVariant = "yellow" | "brown" | "red" | "dark";
type WorkCat = "all" | "web" | "app" | "video" | "embroidery";

const THUMB_BG: Record<ThumbVariant, string> = {
  yellow: "linear-gradient(135deg, #FDF3DC, #F5D98A)",
  brown:  "linear-gradient(135deg, #F2E8DC, #d4a882)",
  red:    "linear-gradient(135deg, rgba(192,57,43,0.08), rgba(192,57,43,0.18))",
  dark:   "linear-gradient(135deg, #2C1810, #4A2A1A)",
};

const ALL_WORKS = [
  { cat: "web" as WorkCat,        thumb: "yellow" as ThumbVariant, icon: "🌱", tag: "홈페이지", title: "거침없는 우다다학교",   desc: "Next.js + Google Sheets 연동. 게시판, 후원 신청, 갤러리 포함.",  href: "https://udada-school.vercel.app", external: true,  comingSoon: false },
  { cat: "web" as WorkCat,        thumb: "brown"  as ThumbVariant, icon: "🌿", tag: "홈페이지", title: "한국타말파연구소",       desc: "Nuxt.js 기반 웹사이트. 프로그램 안내, 갤러리, 신청 폼 포함.",     href: "#",                              external: false, comingSoon: false },
  { cat: "video" as WorkCat,      thumb: "dark"   as ThumbVariant, icon: "🎬", tag: "영상",    title: "교육 소개 영상",         desc: "수업 스케치, 강사, 교육생 장면 구성의 5분 분량 영상.",            href: "#",                              external: false, comingSoon: true  },
  { cat: "embroidery" as WorkCat, thumb: "brown"  as ThumbVariant, icon: "🧵", tag: "자수",    title: "프랑스자수 작품 01",     desc: "손으로 천천히 만드는 시간의 기록.",                              href: "#",                              external: false, comingSoon: true  },
];

const FILTER_TABS: { value: WorkCat; label: string }[] = [
  { value: "all",        label: "전체" },
  { value: "web",        label: "🌐 홈페이지" },
  { value: "app",        label: "📱 앱" },
  { value: "video",      label: "🎬 영상" },
  { value: "embroidery", label: "🧵 자수" },
];

export default function WorkPage() {
  const [filter, setFilter] = useState<WorkCat>("all");
  const filtered = filter === "all" ? ALL_WORKS : ALL_WORKS.filter((w) => w.cat === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SubHeader />
      <main style={{ paddingTop: 57, flex: 1, display: "flex", flexDirection: "column" }}>
        <section className="r-section" style={{ padding: "80px 60px 96px", background: "#FBF7F0", flex: 1 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>

            {/* 페이지 헤더 */}
            <div style={{ marginBottom: 48 }}>
              <div
                className="eyebrow-line"
                style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#C4956A", marginBottom: 14 }}
              >
                포트폴리오
              </div>
              <h1 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#2C1810", lineHeight: 1.25, marginBottom: 12 }}>
                작업물 전체
              </h1>
              <p style={{ fontSize: 15, color: "#7A5C4A", lineHeight: 1.85, maxWidth: 500, fontWeight: 300 }}>
                홈페이지 제작, 번역, 영상, 자수까지 모든 작업물이에요.
              </p>
            </div>

            {/* 필터 탭 */}
            <div style={{ display: "flex", gap: 10, marginBottom: 36, flexWrap: "wrap" }}>
              {FILTER_TABS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  style={{
                    background: filter === value ? "#6B4226" : "#F2E8DC",
                    border: `1px solid ${filter === value ? "#6B4226" : "rgba(107,66,38,0.15)"}`,
                    color: filter === value ? "#FDF3DC" : "#6B4226",
                    padding: "7px 18px", borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { if (filter !== value) { (e.currentTarget as HTMLButtonElement).style.background = "#6B4226"; (e.currentTarget as HTMLButtonElement).style.color = "#FDF3DC"; } }}
                  onMouseLeave={(e) => { if (filter !== value) { (e.currentTarget as HTMLButtonElement).style.background = "#F2E8DC"; (e.currentTarget as HTMLButtonElement).style.color = "#6B4226"; } }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* all-work-grid */}
            <div className="all-work-grid">
              {filtered.map((item, i) => (
                <a
                  key={i}
                  href={item.comingSoon ? undefined : item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  style={{ border: "1px solid rgba(107,66,38,0.08)", borderRadius: 14, overflow: "hidden", transition: "transform 0.2s", textDecoration: "none", display: "block", opacity: item.comingSoon ? 0.55 : 1, cursor: item.comingSoon ? "default" : "pointer" }}
                  onMouseEnter={(e) => { if (!item.comingSoon) e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, background: THUMB_BG[item.thumb], position: "relative" }}>
                    {item.icon}
                    {item.comingSoon && (
                      <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(44,24,16,0.55)", color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: 500, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.06em" }}>
                        준비 중
                      </span>
                    )}
                  </div>
                  <div style={{ padding: 20, background: "white" }}>
                    <div style={{ fontSize: 10, color: "#C4956A", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{item.tag}</div>
                    <h4 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 15, fontWeight: 700, color: "#2C1810", marginBottom: 8 }}>{item.title}</h4>
                    <p style={{ fontSize: 12, color: "#7A5C4A", lineHeight: 1.6, fontWeight: 300 }}>{item.desc}</p>
                  </div>
                </a>
              ))}
            </div>

          </div>
        </section>
      </main>
      <SubFooter />
    </div>
  );
}
