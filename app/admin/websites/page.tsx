"use client";

import { useEffect, useState } from "react";
import { WebsiteProject } from "@/lib/types";

const emptyForm = { name: "", description: "", url: "", thumbnail: "" };

export default function AdminWebsitesPage() {
  const [projects, setProjects] = useState<WebsiteProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<WebsiteProject | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = () => {
    setLoading(true);
    fetch("/api/websites").then((r) => r.json()).then((d) => setProjects(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setError(null); setShowForm(true); };
  const openEdit = (p: WebsiteProject) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, url: p.url, thumbnail: p.thumbnail });
    setError(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    const res = await fetch(`/api/websites/${id}`, { method: "DELETE" });
    if (!res.ok) alert("삭제에 실패했습니다. 다시 시도해주세요.");
    fetchProjects();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = editing
        ? await fetch(`/api/websites/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
        : await fetch("/api/websites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "저장에 실패했습니다. 다시 시도해주세요.");
        return;
      }
      setShowForm(false);
      fetchProjects();
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    borderBottom: "1px solid rgba(125,53,88,0.3)",
    background: "transparent",
    padding: "8px 0",
    fontSize: 14,
    color: "#2d1a35",
    outline: "none",
    width: "100%",
  };

  const fields: { name: keyof typeof emptyForm; label: string; required?: boolean; placeholder?: string }[] = [
    { name: "name",        label: "사이트 이름 *", required: true },
    { name: "url",         label: "URL *",         required: true, placeholder: "https://example.com" },
    { name: "thumbnail",   label: "썸네일 이미지 URL" },
    { name: "description", label: "설명" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
        <div>
          <div className="eyebrow-line" style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#c47a9a", marginBottom: 10 }}>관리</div>
          <h1 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 28, fontWeight: 800, color: "#2d1a35" }}>홈페이지 제작 관리</h1>
        </div>
        <button onClick={openNew} style={{ background: "#c0395e", color: "white", padding: "11px 24px", borderRadius: 100, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          + 새 사이트
        </button>
      </div>

      {/* 폼 모달 */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(45,26,53,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <form
            onSubmit={handleSubmit}
            style={{ background: "#f5e6ed", maxWidth: 520, width: "100%", borderRadius: 20, padding: 36, display: "flex", flexDirection: "column", gap: 22, maxHeight: "90vh", overflowY: "auto" }}
          >
            <h2 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 22, fontWeight: 800, color: "#2d1a35", marginBottom: 4 }}>
              {editing ? "사이트 수정" : "새 사이트"}
            </h2>
            {fields.map(({ name, label, required, placeholder }) => (
              <div key={name}>
                <label style={{ fontSize: 11, color: "#c47a9a", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: 6 }}>{label}</label>
                <input
                  name={name}
                  value={form[name]}
                  onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                  required={required}
                  placeholder={placeholder}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#c0395e")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(125,53,88,0.3)")}
                />
              </div>
            ))}

            {/* 썸네일 미리보기 */}
            {form.thumbnail && (
              <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/9", background: "linear-gradient(135deg, #fce8f4, #f0aece)" }}>
                <img src={form.thumbnail} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}

            {/* 에러 메시지 */}
            {error && (
              <p style={{ fontSize: 13, color: "#c0395e", background: "rgba(192,57,94,0.08)", padding: "10px 14px", borderRadius: 8, margin: 0 }}>
                {error}
              </p>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" disabled={saving} style={{ background: "#c0395e", color: "white", padding: "11px 28px", borderRadius: 100, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
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
        ) : projects.length === 0 ? (
          <div style={{ padding: 32, fontSize: 14, color: "#c47a9a" }}>등록된 사이트가 없습니다.</div>
        ) : projects.map((proj, i) => (
          <div
            key={proj.id}
            style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: i < projects.length - 1 ? "1px solid rgba(125,53,88,0.07)" : "none" }}
          >
            <div style={{ width: 56, height: 36, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "linear-gradient(135deg, #fce8f4, #f0aece)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              {proj.thumbnail ? (
                <img src={proj.thumbnail} alt={proj.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : "🌱"}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 15, fontWeight: 700, color: "#2d1a35", marginBottom: 2 }}>{proj.name}</p>
              <div style={{ fontSize: 11, color: "#c47a9a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{proj.url}</div>
            </div>

            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#c0395e", background: "none", border: "1px solid rgba(192,57,94,0.25)", borderRadius: 100, padding: "6px 14px", cursor: "pointer", textDecoration: "none" }}>
                보기
              </a>
              <button onClick={() => openEdit(proj)} style={{ fontSize: 12, color: "#8a5278", background: "none", border: "1px solid rgba(125,53,88,0.2)", borderRadius: 100, padding: "6px 14px", cursor: "pointer" }}>
                수정
              </button>
              <button onClick={() => handleDelete(proj.id)} style={{ fontSize: 12, color: "#c0395e", background: "none", border: "1px solid rgba(192,57,94,0.2)", borderRadius: 100, padding: "6px 14px", cursor: "pointer" }}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
