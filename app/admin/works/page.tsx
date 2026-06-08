"use client";

import { useEffect, useState } from "react";
import { Work, WORK_CATEGORIES } from "@/lib/types";

const CATEGORIES = WORK_CATEGORIES.filter((c) => c.value !== "all");

const emptyForm = { title: "", category: "other", description: "", thumbnail: "", images: "", tags: "", year: "", url: "" };

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Work | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbLoading, setThumbLoading] = useState(false);

  const autoThumbnail = async () => {
    if (!form.url) return;
    setThumbLoading(true);
    try {
      const res = await fetch(`/api/og-image?url=${encodeURIComponent(form.url)}`);
      const data = await res.json();
      if (data.url) {
        setForm((p) => ({ ...p, thumbnail: data.url }));
      } else {
        // OG 이미지 없으면 mshots 사용
        setForm((p) => ({ ...p, thumbnail: `https://image.thum.io/get/width/1200/${form.url.startsWith("http") ? form.url : `https://${form.url}`}` }));
      }
    } catch {
      setForm((p) => ({ ...p, thumbnail: `https://image.thum.io/get/width/1200/${form.url.startsWith("http") ? form.url : `https://${form.url}`}` }));
    } finally {
      setThumbLoading(false);
    }
  };

  const fetchWorks = () => {
    setLoading(true);
    fetch("/api/works").then((r) => r.json()).then((d) => setWorks(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchWorks(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setError(null); setShowForm(true); };
  const openEdit = (w: Work) => {
    setEditing(w);
    setForm({ title: w.title, category: w.category, description: w.description, thumbnail: w.thumbnail, images: w.images.join(", "), tags: w.tags.join(", "), year: w.year, url: w.url ?? "" });
    setError(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    const res = await fetch(`/api/works/${id}`, { method: "DELETE" });
    if (!res.ok) alert("삭제에 실패했습니다. 다시 시도해주세요.");
    fetchWorks();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const body = { ...form, images: form.images.split(",").map((s) => s.trim()).filter(Boolean), tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean) };
    try {
      const res = editing
        ? await fetch(`/api/works/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch("/api/works", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "저장에 실패했습니다. 다시 시도해주세요.");
        return;
      }
      setShowForm(false);
      fetchWorks();
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { borderBottom: "1px solid rgba(125,53,88,0.3)", background: "transparent", padding: "8px 0", fontSize: 14, color: "#2d1a35", outline: "none", width: "100%" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
        <div>
          <div className="eyebrow-line" style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#c47a9a", marginBottom: 10 }}>관리</div>
          <h1 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 28, fontWeight: 800, color: "#2d1a35" }}>작업물 관리</h1>
        </div>
        <button onClick={openNew} style={{ background: "#7d3558", color: "#fce8f4", padding: "11px 24px", borderRadius: 100, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          + 새 작업물
        </button>
      </div>

      {/* 폼 모달 */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(45,26,53,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <form
            onSubmit={handleSubmit}
            style={{ background: "#f5e6ed", maxWidth: 560, width: "100%", borderRadius: 20, padding: 36, display: "flex", flexDirection: "column", gap: 20, maxHeight: "90vh", overflowY: "auto" }}
          >
            <h2 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 22, fontWeight: 800, color: "#2d1a35", marginBottom: 4 }}>
              {editing ? "작업물 수정" : "새 작업물"}
            </h2>
            {[
              { name: "title", label: "제목 *", required: true },
              { name: "url",   label: "사이트 URL (홈페이지·앱 스토어 링크)" },
              { name: "tags",  label: "태그 (쉼표 구분)" },
              { name: "year",  label: "연도" },
            ].map(({ name, label, required }) => (
              <div key={name}>
                <label style={{ fontSize: 11, color: "#c47a9a", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: 6 }}>{label}</label>
                <input
                  name={name} value={(form as Record<string,string>)[name]} onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                  required={required}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#7d3558")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(125,53,88,0.3)")}
                />
              </div>
            ))}

            {/* 썸네일 — 자동 생성 버튼 포함 */}
            <div>
              <label style={{ fontSize: 11, color: "#c47a9a", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: 6 }}>썸네일</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  name="thumbnail"
                  value={form.thumbnail}
                  onChange={(e) => setForm((p) => ({ ...p, thumbnail: e.target.value }))}
                  placeholder="URL 입력 또는 아래 버튼으로 자동 생성"
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#7d3558")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(125,53,88,0.3)")}
                />
                {form.url && (
                  <button
                    type="button"
                    onClick={autoThumbnail}
                    disabled={thumbLoading}
                    style={{ whiteSpace: "nowrap", fontSize: 12, color: "#7d3558", background: "#edd6e4", border: "1px solid rgba(125,53,88,0.2)", borderRadius: 100, padding: "6px 12px", cursor: "pointer", opacity: thumbLoading ? 0.6 : 1 }}
                  >
                    {thumbLoading ? "가져오는 중..." : "🖼 자동 생성"}
                  </button>
                )}
              </div>
              {form.thumbnail && (
                <div style={{ marginTop: 10, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(125,53,88,0.1)", maxHeight: 140 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.thumbnail} alt="썸네일 미리보기" style={{ width: "100%", objectFit: "cover", display: "block" }} />
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: 11, color: "#c47a9a", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: 6 }}>이미지 URL (쉼표 구분)</label>
              <input
                name="images" value={form.images} onChange={(e) => setForm((p) => ({ ...p, images: e.target.value }))}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#7d3558")}
                onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(125,53,88,0.3)")}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#c47a9a", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: 6 }}>카테고리</label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                style={{ ...inputStyle, borderBottom: "1px solid rgba(125,53,88,0.3)" }}
              >
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#c47a9a", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: 6 }}>설명</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                style={{ border: "1px solid rgba(125,53,88,0.2)", background: "white", padding: "8px 12px", fontSize: 14, color: "#2d1a35", outline: "none", resize: "none", width: "100%", borderRadius: 6 }}
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <p style={{ fontSize: 13, color: "#c0395e", background: "rgba(192,57,94,0.08)", padding: "10px 14px", borderRadius: 8, margin: 0 }}>
                {error}
              </p>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" disabled={saving} style={{ background: "#7d3558", color: "#fce8f4", padding: "11px 28px", borderRadius: 100, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "저장 중..." : "저장"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: "transparent", color: "#8a5278", padding: "11px 20px", borderRadius: 100, fontSize: 13, border: "1px solid rgba(125,53,88,0.2)", cursor: "pointer" }}>
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(125,53,88,0.08)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 32, fontSize: 14, color: "#c47a9a" }}>불러오는 중...</div>
        ) : works.length === 0 ? (
          <div style={{ padding: 32, fontSize: 14, color: "#c47a9a" }}>작업물이 없습니다.</div>
        ) : works.map((work, i) => (
          <div key={work.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: i < works.length - 1 ? "1px solid rgba(125,53,88,0.07)" : "none" }}>
            <div>
              <div style={{ fontSize: 10, color: "#c47a9a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{work.category} · {work.year}</div>
              <p style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 15, fontWeight: 700, color: "#2d1a35" }}>{work.title}</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => openEdit(work)} style={{ fontSize: 12, color: "#8a5278", background: "none", border: "1px solid rgba(125,53,88,0.2)", borderRadius: 100, padding: "6px 14px", cursor: "pointer" }}>수정</button>
              <button onClick={() => handleDelete(work.id)} style={{ fontSize: 12, color: "#c0395e", background: "none", border: "1px solid rgba(192,57,94,0.2)", borderRadius: 100, padding: "6px 14px", cursor: "pointer" }}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
