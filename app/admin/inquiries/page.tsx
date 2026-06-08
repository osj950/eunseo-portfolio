"use client";

import { useEffect, useState } from "react";
import { Inquiry } from "@/lib/types";

const STATUS_LABEL: Record<Inquiry["status"], string> = { unread: "미확인", read: "확인", replied: "답변완료" };
const STATUS_COLOR: Record<Inquiry["status"], string> = {
  unread:  "rgba(217,112,154,0.25)",
  read:    "rgba(125,53,88,0.08)",
  replied: "rgba(125,53,88,0.04)",
};
const STATUS_TEXT: Record<Inquiry["status"], string> = { unread: "#7d3558", read: "#c47a9a", replied: "#c47a9a" };

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const fetchInquiries = () => {
    setLoading(true);
    fetch("/api/contact").then((r) => r.json()).then((d) => setInquiries(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchInquiries(); }, []);

  const updateStatus = async (id: string, status: Inquiry["status"]) => {
    await fetch(`/api/contact/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    fetchInquiries();
  };

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <div className="eyebrow-line" style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#c47a9a", marginBottom: 10 }}>관리</div>
        <h1 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 28, fontWeight: 800, color: "#2d1a35" }}>문의 관리</h1>
      </div>

      {/* 상세 모달 */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(45,26,53,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "#f5e6ed", maxWidth: 520, width: "100%", borderRadius: 20, padding: 36 }}>
            <div style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 11, color: "#d9709a", marginBottom: 4 }}>
              {selected.createdAt.slice(0, 10)}
            </div>
            <h2 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 20, fontWeight: 800, color: "#2d1a35", marginBottom: 6 }}>
              {selected.subject || "(제목 없음)"}
            </h2>
            <p style={{ fontSize: 13, color: "#c47a9a", marginBottom: 20 }}>
              {selected.name} · {selected.email}
            </p>
            <p style={{ fontSize: 14, color: "#3d2040", lineHeight: 1.8, whiteSpace: "pre-wrap", marginBottom: 28, padding: "20px", background: "white", borderRadius: 10 }}>
              {selected.message}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { updateStatus(selected.id, "read"); setSelected(null); }}
                style={{ fontSize: 12, color: "#8a5278", background: "transparent", border: "1px solid rgba(125,53,88,0.2)", borderRadius: 100, padding: "8px 18px", cursor: "pointer" }}
              >
                확인 처리
              </button>
              <button
                onClick={() => { updateStatus(selected.id, "replied"); setSelected(null); }}
                style={{ fontSize: 12, color: "#fce8f4", background: "#7d3558", border: "none", borderRadius: 100, padding: "8px 18px", cursor: "pointer" }}
              >
                답변완료
              </button>
              <button
                onClick={() => setSelected(null)}
                style={{ marginLeft: "auto", fontSize: 12, color: "#c47a9a", background: "transparent", border: "none", cursor: "pointer" }}
              >
                닫기 ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(125,53,88,0.08)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 32, fontSize: 14, color: "#c47a9a" }}>불러오는 중...</div>
        ) : inquiries.length === 0 ? (
          <div style={{ padding: 32, fontSize: 14, color: "#c47a9a" }}>문의가 없습니다.</div>
        ) : inquiries.map((inq, i) => (
          <div
            key={inq.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelected(inq)}
            onKeyDown={(e) => e.key === "Enter" && setSelected(inq)}
            style={{
              width: "100%",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 24px", textAlign: "left",
              borderBottom: i < inquiries.length - 1 ? "1px solid rgba(125,53,88,0.07)" : "none",
              cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(125,53,88,0.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: "#c47a9a", marginBottom: 4 }}>
                {inq.createdAt.slice(0, 10)} · {inq.name} · {inq.email}
              </div>
              <p style={{
                fontFamily: "var(--font-nanum-myeongjo)", fontSize: 15,
                color: "#2d1a35", fontWeight: inq.status === "unread" ? 700 : 400,
              }}>
                {inq.subject || "(제목 없음)"}
              </p>
            </div>
            <span style={{
              marginLeft: 16, flexShrink: 0,
              fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 100,
              background: STATUS_COLOR[inq.status], color: STATUS_TEXT[inq.status],
            }}>
              {STATUS_LABEL[inq.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
