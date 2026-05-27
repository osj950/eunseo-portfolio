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

  const fetchProjects = () => {
    setLoading(true);
    fetch("/api/websites").then((r) => r.json()).then((d) => setProjects(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p: WebsiteProject) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, url: p.url, thumbnail: p.thumbnail });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/websites/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await fetch(`/api/websites/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/websites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setSaving(false);
    setShowForm(false);
    fetchProjects();
  };

  const inputStyle: React.CSSProperties = {
    borderBottom: "1px solid rgba(107,66,38,0.3)",
    background: "transparent",
    padding: "8px 0",
    fontSize: 14,
    color: "#2C1810",
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
          <div className="eyebrow-line" style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#C4956A", marginBottom: 10 }}>관리</div>
          <h1 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 28, fontWeight: 800, color: "#2C1810" }}>홈페이지 제작 관리</h1>
        </div>
        <button onClick={openNew} style={{ background: "#C0392B", color: "white", padding: "11px 24px", borderRadius: 100, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" }}>
          + 새 사이트
        </button>
      </div>

      {/* 폼 모달 */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,24,16,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <form
            onSubmit={handleSubmit}
            style={{ background: "#FBF7F0", maxWidth: 520, width: "100%", borderRadius: 20, padding: 36, display: "flex", flexDirection: "column", gap: 22, maxHeight: "90vh", overflowY: "auto" }}
          >
            <h2 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 22, fontWeight: 800, color: "#2C1810", marginBottom: 4 }}>
              {editing ? "사이트 수정" : "새 사이트"}
            </h2>
            {fields.map(({ name, label, required, placeholder }) => (
              <div key={name}>
                <label style={{ fontSize: 11, color: "#C4956A", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, display: "block", marginBottom: 6 }}>{label}</label>
                <input
                  name={name}
                  value={form[name]}
                  onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                  required={required}
                  placeholder={placeholder}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#C0392B")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(107,66,38,0.3)")}
                />
              </div>
            ))}

            {/* 썸네일 미리보기 */}
            {form.thumbnail && (
              <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/9", background: "linear-gradient(135deg, #FDF3DC, #F5D98A)" }}>
                <img src={form.thumbnail} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" disabled={saving} style={{ background: "#C0392B", color: "white", padding: "11px 28px", borderRadius: 100, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "저장 중..." : "저장"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: "transparent", color: "#7A5C4A", padding: "11px 20px", borderRadius: 100, fontSize: 13, border: "1px solid rgba(107,66,38,0.2)", cursor: "pointer" }}>
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(107,66,38,0.08)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 32, fontSize: 14, color: "#C4956A" }}>불러오는 중...</div>
        ) : projects.length === 0 ? (
          <div style={{ padding: 32, fontSize: 14, color: "#C4956A" }}>등록된 사이트가 없습니다.</div>
        ) : projects.map((proj, i) => (
          <div
            key={proj.id}
            style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: i < projects.length - 1 ? "1px solid rgba(107,66,38,0.07)" : "none" }}
          >
            {/* 썸네일 미리보기 */}
            <div style={{ width: 56, height: 36, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "linear-gradient(135deg, #FDF3DC, #F5D98A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              {proj.thumbnail ? (
                <img src={proj.thumbnail} alt={proj.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : "🌱"}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 15, fontWeight: 700, color: "#2C1810", marginBottom: 2 }}>{proj.name}</p>
              <div style={{ fontSize: 11, color: "#C4956A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{proj.url}</div>
            </div>

            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#C0392B", background: "none", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 100, padding: "6px 14px", cursor: "pointer", textDecoration: "none" }}>
                보기
              </a>
              <button onClick={() => openEdit(proj)} style={{ fontSize: 12, color: "#7A5C4A", background: "none", border: "1px solid rgba(107,66,38,0.2)", borderRadius: 100, padding: "6px 14px", cursor: "pointer" }}>
                수정
              </button>
              <button onClick={() => handleDelete(proj.id)} style={{ fontSize: 12, color: "#C0392B", background: "none", border: "1px solid rgba(192,57,43,0.2)", borderRadius: 100, padding: "6px 14px", cursor: "pointer" }}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
