"use client";

import { useState, useEffect } from "react";
import SubHeader from "@/components/layout/SubHeader";
import SubFooter from "@/components/layout/SubFooter";
import { Work, WORK_CATEGORIES } from "@/lib/types";

type ThumbVariant = "yellow" | "brown" | "red" | "dark";

const THUMB_BG: Record<ThumbVariant, string> = {
  yellow: "linear-gradient(135deg, #fce8f4, #f0aece)",
  brown:  "linear-gradient(135deg, #edd6e4, #d4a0c0)",
  red:    "linear-gradient(135deg, rgba(192,57,94,0.08), rgba(192,57,94,0.18))",
  dark:   "linear-gradient(135deg, #2d1a35, #4a2045)",
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
        <section className="r-section" style={{ padding: "80px 60px 96px", background: "#f5e6ed", flex: 1 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>

            {/* 페이지 헤더 */}
            <div style={{ marginBottom: 48 }}>
              <div
                className="eyebrow-line"
                style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#c47a9a", marginBottom: 14 }}
              >
                포트폴리오
              </div>
              <h1 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#2d1a35", lineHeight: 1.25, marginBottom: 12 }}>
                작업물 전체
              </h1>
              <p style={{ fontSize: 15, color: "#8a5278", lineHeight: 1.85, maxWidth: 500, fontWeight: 300 }}>
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
                      background: filter === value ? "#7d3558" : "#edd6e4",
                      border: `1px solid ${filter === value ? "#7d3558" : "rgba(125,53,88,0.15)"}`,
                      color: filter === value ? "#fce8f4" : "#7d3558",
                      padding: "7px 18px", borderRadius: 100, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { if (filter !== value) { (e.currentTarget as HTMLButtonElement).style.background = "#7d3558"; (e.currentTarget as HTMLButtonElement).style.color = "#fce8f4"; } }}
                    onMouseLeave={(e) => { if (filter !== value) { (e.currentTarget as HTMLButtonElement).style.background = "#edd6e4"; (e.currentTarget as HTMLButtonElement).style.color = "#7d3558"; } }}
                  >
                    {icon && `${icon} `}{label}
                  </button>
                ))}
              </div>
            )}

            {/* 작업물 그리드 */}
            {filtered.length === 0 ? (
              <p style={{ fontSize: 14, color: "#c47a9a", textAlign: "center", padding: "64px 0" }}>아직 작업물이 없습니다.</p>
            ) : (
              <div className="all-work-grid">
                {filtered.map((item) => {
                  const style = CATEGORY_STYLE[item.category] ?? CATEGORY_STYLE.other;
                  return (
                    <div
                      key={item.id}
                      style={{ border: "1px solid rgba(125,53,88,0.08)", borderRadius: 14, overflow: "hidden", transition: "transform 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      <div style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, background: THUMB_BG[style.thumb], overflow: "hidden" }}>
                        {item.thumbnail
                          ? <img src={item.thumbnail} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          : style.icon}
                      </div>
                      <div style={{ padding: 20, background: "white" }}>
                        <div style={{ fontSize: 10, color: "#c47a9a", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                          {CATEGORY_STYLE[item.category]?.icon} {WORK_CATEGORIES.find((c) => c.value === item.category)?.label ?? "기타"}
                        </div>
                        <h4 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 15, fontWeight: 700, color: "#2d1a35", marginBottom: 8 }}>{item.title}</h4>
                        {item.description && <p style={{ fontSize: 12, color: "#8a5278", lineHeight: 1.6, fontWeight: 300 }}>{item.description}</p>}
                        {item.year && <p style={{ fontSize: 11, color: "#c47a9a", marginTop: 8 }}>{item.year}</p>}
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
