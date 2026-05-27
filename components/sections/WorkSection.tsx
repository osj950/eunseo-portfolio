"use client";

import { useState, useEffect, useCallback } from "react";
import { WebsiteProject } from "@/lib/types";

type ThumbVariant = "yellow" | "brown" | "red" | "dark";
type WorkCat = "all" | "web" | "translate" | "video" | "embroidery";

const THUMB_BG: Record<ThumbVariant, string> = {
  yellow: "linear-gradient(135deg, #FDF3DC, #F5D98A)",
  brown:  "linear-gradient(135deg, #F2E8DC, #d4a882)",
  red:    "linear-gradient(135deg, rgba(192,57,43,0.08), rgba(192,57,43,0.18))",
  dark:   "linear-gradient(135deg, #2C1810, #4A2A1A)",
};

const NON_WEB_CATEGORY_WORKS = [
  {
    cat: "translate" as WorkCat,
    thumbVariant: "red" as ThumbVariant,
    thumbIcon: "✍️",
    eyebrow: "Translation",
    title: "번역",
    desc: "테스트",
    href: "#contact",
    linkLabel: "문의하기 →",
    features: ["테스트1", "테스트2", "테스트3", "테스트4"],
  },
  {
    cat: "video" as WorkCat,
    thumbVariant: "dark" as ThumbVariant,
    thumbIcon: "🎬",
    eyebrow: "Video Production",
    title: "영상 제작",
    desc: "테스트",
    href: "#contact",
    linkLabel: "문의하기 →",
    features: ["테스트1", "테스트2", "테스트3", "테스트4"],
  },
  {
    cat: "embroidery" as WorkCat,
    thumbVariant: "brown" as ThumbVariant,
    thumbIcon: "🧵",
    eyebrow: "French Embroidery",
    title: "프랑스자수",
    desc: "테스트",
    href: "#",
    linkLabel: "더 보기 →",
    features: ["테스트1", "테스트2", "테스트3", "테스트4"],
  },
];

const ALL_WORKS = [
  { cat: "web" as WorkCat,        thumb: "yellow" as ThumbVariant, icon: "🌱", tag: "홈페이지", title: "거침없는 우다다학교" },
  { cat: "web" as WorkCat,        thumb: "brown"  as ThumbVariant, icon: "🌿", tag: "홈페이지", title: "한국타말파연구소" },
  { cat: "translate" as WorkCat,  thumb: "red"    as ThumbVariant, icon: "✍️", tag: "번역",    title: "표현예술치료 강의 번역" },
  { cat: "video" as WorkCat,      thumb: "dark"   as ThumbVariant, icon: "🎬", tag: "영상",    title: "교육 소개 영상" },
  { cat: "embroidery" as WorkCat, thumb: "brown"  as ThumbVariant, icon: "🧵", tag: "자수",    title: "프랑스자수 작품 01" },
];

const FILTER_TABS: { value: WorkCat; label: string }[] = [
  { value: "all",        label: "전체" },
  { value: "web",        label: "🌐 홈페이지" },
  { value: "translate",  label: "✍️ 번역" },
  { value: "video",      label: "🎬 영상" },
  { value: "embroidery", label: "🧵 자수" },
];

const FALLBACK_PROJECTS: WebsiteProject[] = [
  { id: "f1", name: "거침없는 우다다학교", description: "Next.js + Google Sheets 연동. 게시판, 후원 신청, 갤러리 포함.", url: "https://udada-school.vercel.app", thumbnail: "", createdAt: "" },
];

export default function WorkSection() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<WorkCat>("all");

  const [webProjects, setWebProjects] = useState<WebsiteProject[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    fetch("/api/websites")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setWebProjects(data); })
      .catch(() => {});
  }, []);

  const projects = webProjects.length > 0 ? webProjects : FALLBACK_PROJECTS;
  const total = projects.length;
  const current = projects[slideIdx];

  const prev = useCallback(() => setSlideIdx((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setSlideIdx((i) => (i + 1) % total), [total]);
  const closeModal = useCallback(() => { setModalOpen(false); setSlideIdx(0); }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen, prev, next, closeModal]);

  const filtered = filter === "all" ? ALL_WORKS : ALL_WORKS.filter((w) => w.cat === filter);

  return (
    <section id="work" className="r-section" style={{ padding: "96px 60px", background: "#FBF7F0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* 헤더 */}
        <div className="r-work-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <div className="eyebrow-line" style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#C4956A", marginBottom: 14 }}>
              포트폴리오
            </div>
            <h2 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#2C1810", lineHeight: 1.25, marginBottom: 12 }}>
              만든 것들
            </h2>
            <p style={{ fontSize: 15, color: "#7A5C4A", lineHeight: 1.85, maxWidth: 500, fontWeight: 300 }}>
              각 분야의 최신 작업물이에요. 전체 목록을 보려면 아래 버튼을 눌러주세요.
            </p>
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setOpen((v) => !v);
              if (!open) setTimeout(() => document.getElementById("workAll")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
            }}
            style={{ fontSize: 13, color: "#6B4226", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
          >
            {open ? "← 접기" : "전체 작업물 보기 →"}
          </a>
        </div>

        {/* 카테고리 카드 그리드 */}
        <div className="work-cat-grid">

          {/* 홈페이지 제작 카드 — 클릭 시 모달 */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setModalOpen(true)}
            onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
            style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(107,66,38,0.08)", transition: "transform 0.25s, box-shadow 0.25s", cursor: "pointer", display: "flex", flexDirection: "column" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(107,66,38,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            {/* 상단: 대표 이미지 */}
            <div style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, background: THUMB_BG.yellow, overflow: "hidden", position: "relative", flexShrink: 0 }}>
              {projects[0]?.thumbnail ? (
                <img src={projects[0].thumbnail} alt="홈페이지 제작" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : "🌱"}
              {/* 제작 사례 뱃지 */}
              {total > 0 && (
                <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(44,24,16,0.6)", color: "#F5D98A", fontSize: 10, fontWeight: 500, padding: "4px 10px", borderRadius: 100, letterSpacing: "0.06em" }}>
                  제작 사례 {total}개
                </div>
              )}
            </div>

            {/* 중간: 제목 */}
            <div style={{ padding: "22px 24px 0" }}>
              <div style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 11, color: "#E8B84B", letterSpacing: "0.12em", marginBottom: 8 }}>
                Website Development
              </div>
              <h3 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 22, fontWeight: 800, color: "#2C1810", lineHeight: 1.3, marginBottom: 4 }}>
                홈페이지 제작
              </h3>
              <p style={{ fontSize: 12, color: "#7A5C4A", fontWeight: 300, lineHeight: 1.6, marginBottom: 18 }}>
                Next.js 기반의 빠르고 관리하기 쉬운 홈페이지를 만들어 드려요.
              </p>
            </div>

            {/* 하단: 기능 목록 */}
            <div style={{ padding: "0 24px 24px", flex: 1 }}>
              <div style={{ borderTop: "1px solid rgba(107,66,38,0.07)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  "Next.js 기반 반응형 홈페이지",
                  "Google Sheets 연동 게시판",
                  "관리자 페이지",
                  "Vercel 배포",
                ].map((feat) => (
                  <div key={feat} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(232,184,75,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="9" height="9" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="#6B4226" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span style={{ fontSize: 12, color: "#3D2314", fontWeight: 400 }}>{feat}</span>
                  </div>
                ))}
              </div>

              {/* 사례 보기 링크 */}
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#6B4226", fontWeight: 500 }}>
                  제작 사례 보기 →
                </span>
                <span style={{ fontSize: 10, color: "rgba(107,66,38,0.4)", letterSpacing: "0.06em" }}>클릭</span>
              </div>
            </div>
          </div>

          {/* 나머지 카테고리 카드 — 홈페이지 제작과 동일한 구조 */}
          {NON_WEB_CATEGORY_WORKS.map((item) => (
            <a
              key={item.cat}
              href={item.href}
              style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(107,66,38,0.08)", transition: "transform 0.25s, box-shadow 0.25s", display: "flex", flexDirection: "column", textDecoration: "none" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(107,66,38,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* 상단: 대표 이미지 */}
              <div style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, background: THUMB_BG[item.thumbVariant], flexShrink: 0 }}>
                {item.thumbIcon}
              </div>

              {/* 중간: 제목 */}
              <div style={{ padding: "22px 24px 0" }}>
                <div style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 11, color: "#E8B84B", letterSpacing: "0.12em", marginBottom: 8 }}>
                  {item.eyebrow}
                </div>
                <h3 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 22, fontWeight: 800, color: "#2C1810", lineHeight: 1.3, marginBottom: 4 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 12, color: "#7A5C4A", fontWeight: 300, lineHeight: 1.6, marginBottom: 18 }}>
                  {item.desc}
                </p>
              </div>

              {/* 하단: 기능 목록 */}
              <div style={{ padding: "0 24px 24px", flex: 1 }}>
                <div style={{ borderTop: "1px solid rgba(107,66,38,0.07)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 9 }}>
                  {item.features.map((feat) => (
                    <div key={feat} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(232,184,75,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="9" height="9" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="#6B4226" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span style={{ fontSize: 12, color: "#3D2314", fontWeight: 400 }}>{feat}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#6B4226", fontWeight: 500 }}>{item.linkLabel}</span>
                  <span style={{ fontSize: 10, color: "rgba(107,66,38,0.4)", letterSpacing: "0.06em" }}>클릭</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* 전체 작업물 토글 */}
        {open && (
          <div id="workAll" style={{ background: "white", borderRadius: 20, marginTop: 32, padding: 36, border: "1px solid rgba(107,66,38,0.08)" }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
              {FILTER_TABS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  style={{ background: filter === value ? "#6B4226" : "#F2E8DC", border: `1px solid ${filter === value ? "#6B4226" : "rgba(107,66,38,0.15)"}`, color: filter === value ? "#FDF3DC" : "#6B4226", padding: "7px 18px", borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { if (filter !== value) { (e.currentTarget as HTMLButtonElement).style.background = "#6B4226"; (e.currentTarget as HTMLButtonElement).style.color = "#FDF3DC"; } }}
                  onMouseLeave={(e) => { if (filter !== value) { (e.currentTarget as HTMLButtonElement).style.background = "#F2E8DC"; (e.currentTarget as HTMLButtonElement).style.color = "#6B4226"; } }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="all-work-grid">
              {filtered.map((item, i) => (
                <div
                  key={i}
                  style={{ border: "1px solid rgba(107,66,38,0.08)", borderRadius: 14, overflow: "hidden", transition: "transform 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, background: THUMB_BG[item.thumb] }}>{item.icon}</div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 10, color: "#C4956A", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{item.tag}</div>
                    <h4 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 14, fontWeight: 700, color: "#2C1810" }}>{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 홈페이지 제작 전체 화면 모달 ── */}
      {modalOpen && (
        <div
          onClick={closeModal}
          style={{ position: "fixed", inset: 0, background: "rgba(28,14,8,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 60px" }}
        >
          {/* 좌 화살표 */}
          {total > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)", background: "#C0392B", border: "none", borderRadius: "50%", width: 48, height: 48, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 26, boxShadow: "0 4px 16px rgba(192,57,43,0.5)", zIndex: 2 }}
            >
              ‹
            </button>
          )}

          {/* 모달 카드 */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#FBF7F0", borderRadius: 24, maxWidth: 680, width: "100%", overflow: "hidden", position: "relative", boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}
          >
            {/* X 버튼 */}
            <button
              onClick={closeModal}
              style={{ position: "absolute", top: 16, right: 16, background: "rgba(44,24,16,0.55)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 16, zIndex: 3, lineHeight: 1 }}
            >
              ✕
            </button>

            {/* 썸네일 */}
            <div style={{ aspectRatio: "16/9", background: THUMB_BG.yellow, overflow: "hidden", position: "relative" }}>
              {current?.thumbnail ? (
                <img
                  src={current.thumbnail}
                  alt={current.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72 }}>🌱</div>
              )}

              {/* 슬라이드 카운터 */}
              {total > 1 && (
                <div style={{ position: "absolute", bottom: 14, right: 16, background: "rgba(44,24,16,0.6)", color: "white", fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 100, letterSpacing: "0.05em" }}>
                  {slideIdx + 1} / {total}
                </div>
              )}
            </div>

            {/* 본문 */}
            <div style={{ padding: "28px 32px 32px" }}>
              {/* eyebrow */}
              <div style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 11, color: "#E8B84B", letterSpacing: "0.12em", marginBottom: 10 }}>
                홈페이지 제작
              </div>

              <h2 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "#2C1810", lineHeight: 1.3, marginBottom: 12 }}>
                {current?.name}
              </h2>

              <p style={{ fontSize: 14, color: "#7A5C4A", lineHeight: 1.8, fontWeight: 300, marginBottom: 24 }}>
                {current?.description}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                {/* 사이트 보기 버튼 */}
                <a
                  href={current?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C0392B", color: "white", padding: "12px 28px", borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "background 0.2s, gap 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#a93226"; e.currentTarget.style.gap = "12px"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#C0392B"; e.currentTarget.style.gap = "8px"; }}
                >
                  사이트 보기 →
                </a>

                {/* 닷 인디케이터 */}
                {total > 1 && (
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {projects.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSlideIdx(i)}
                        style={{ width: i === slideIdx ? 20 : 8, height: 8, borderRadius: 4, padding: 0, background: i === slideIdx ? "#C0392B" : "rgba(107,66,38,0.2)", border: "none", cursor: "pointer", transition: "all 0.2s" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 우 화살표 */}
          {total > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", background: "#C0392B", border: "none", borderRadius: "50%", width: 48, height: 48, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 26, boxShadow: "0 4px 16px rgba(192,57,43,0.5)", zIndex: 2 }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </section>
  );
}
