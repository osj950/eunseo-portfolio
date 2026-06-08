"use client";

import { useState, useEffect } from "react";
import SubHeader from "@/components/layout/SubHeader";
import SubFooter from "@/components/layout/SubFooter";
import { Work, WORK_CATEGORIES } from "@/lib/types";

type ThumbVariant = "yellow" | "brown" | "red" | "dark";

const THUMB_BG: Record<ThumbVariant, string> = {
  yellow: "linear-gradient(135deg, #FDF3DC, #F5D98A)",
  brown:  "linear-gradient(135deg, #F2E8DC, #d4a882)",
  red:    "linear-gradient(135deg, rgba(192,57,43,0.08), rgba(192,57,43,0.18))",
  dark:   "linear-gradient(135deg, #2C1810, #4A2A1A)",
};

const CATEGORY_STYLE: Record<string, { thumb: ThumbVariant; icon: string }> = {
  web:        { thumb: "yellow", icon: "🌐" },
  app:        { thumb: "red",    icon: "📱" },
  video:      { thumb: "dark",   icon: "🎬" },
  embroidery: { thumb: "brown",  icon: "🧵" },
  other:      { thumb: "brown",  icon: "✨" },
};

export default function WorkPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/works").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setWorks(d); }).catch(() => {});
  }, []);

  const filtered = filter === "all" ? works : works.filter((w) => w.category === filter);
  const activeCats = WORK_CATEGORIES.filter((c) => c.value === "all" || works.some((w) => w.category === c.value));

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
            {works.length > 0 && (
              <div style={{ display: "flex", gap: 10, marginBottom: 36, flexWrap: "wrap" }}>
                {activeCats.map(({ value, label, icon }) => (
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
                    {icon && `${icon} `}{label}
                  </button>
                ))}
              </div>
            )}

            {/* 작업물 그리드 */}
            {filtered.length === 0 ? (
              <p style={{ fontSize: 14, color: "#C4956A", textAlign: "center", padding: "64px 0" }}>아직 작업물이 없습니다.</p>
            ) : (
              <div className="all-work-grid">
                {filtered.map((item) => {
                  const style = CATEGORY_STYLE[item.category] ?? CATEGORY_STYLE.other;
                  return (
                    <div
                      key={item.id}
                      style={{ border: "1px solid rgba(107,66,38,0.08)", borderRadius: 14, overflow: "hidden", transition: "transform 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      <div style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, background: THUMB_BG[style.thumb], overflow: "hidden" }}>
                        {item.thumbnail
                          ? <img src={item.thumbnail} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          : style.icon}
                      </div>
                      <div style={{ padding: 20, background: "white" }}>
                        <div style={{ fontSize: 10, color: "#C4956A", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                          {CATEGORY_STYLE[item.category]?.icon} {WORK_CATEGORIES.find((c) => c.value === item.category)?.label ?? "기타"}
                        </div>
                        <h4 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 15, fontWeight: 700, color: "#2C1810", marginBottom: 8 }}>{item.title}</h4>
                        {item.description && <p style={{ fontSize: 12, color: "#7A5C4A", lineHeight: 1.6, fontWeight: 300 }}>{item.description}</p>}
                        {item.year && <p style={{ fontSize: 11, color: "#C4956A", marginTop: 8 }}>{item.year}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </section>
      </main>
      <SubFooter />
    </div>
  );
}
