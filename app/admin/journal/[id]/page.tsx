"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("@/components/editor/TiptapEditor"), { ssr: false });

export default function AdminJournalFormPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const isNew = params.id === "new";

  const [form, setForm] = useState({
    slug: "",
    title: "",
    content: "",
    excerpt: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    fetch("/api/journal")
      .then((r) => r.json())
      .then((posts) => {
        const post = posts.find((p: { id: string }) => p.id === params.id);
        if (post) setForm({ slug: post.slug, title: post.title, content: post.content, excerpt: post.excerpt, date: post.date });
      });
  }, [isNew, params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const url = isNew ? "/api/journal" : `/api/journal/${params.id}`;
    try {
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "저장에 실패했습니다. 다시 시도해주세요.");
        return;
      }
      router.push("/admin/journal");
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    borderBottom: "1px solid rgba(107,66,38,0.3)",
    background: "transparent",
    padding: "8px 0",
    fontSize: 14,
    color: "#2C1810",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    color: "#C4956A",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 500,
  };

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <div className="eyebrow-line" style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#C4956A", marginBottom: 10 }}>
          관리
        </div>
        <h1 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 28, fontWeight: 800, color: "#2C1810" }}>
          {isNew ? "새 글 작성" : "글 수정"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: 28 }}>

        {/* 제목 + 슬러그 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {([
            { name: "title", label: "제목 *", required: true },
            { name: "slug",  label: "슬러그 *", required: true },
          ] as { name: keyof typeof form; label: string; required: boolean }[]).map(({ name, label, required }) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={labelStyle}>{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                required={required}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#6B4226")}
                onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(107,66,38,0.3)")}
              />
            </div>
          ))}
        </div>

        {/* 날짜 + 요약 */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={labelStyle}>날짜</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#6B4226")}
              onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(107,66,38,0.3)")}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={labelStyle}>요약</label>
            <input
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="목록에 표시될 짧은 요약"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#6B4226")}
              onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(107,66,38,0.3)")}
            />
          </div>
        </div>

        {/* 본문 에디터 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={labelStyle}>본문</label>
          <TiptapEditor
            value={form.content}
            onChange={(html) => setForm((p) => ({ ...p, content: html }))}
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p style={{ fontSize: 13, color: "#C0392B", background: "rgba(192,57,43,0.08)", padding: "10px 14px", borderRadius: 8, margin: 0 }}>
            {error}
          </p>
        )}

        {/* 버튼 */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            disabled={saving}
            style={{ background: "#6B4226", color: "#FDF3DC", padding: "12px 36px", borderRadius: 100, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            style={{ background: "transparent", color: "#7A5C4A", padding: "12px 24px", borderRadius: 100, fontSize: 13, border: "1px solid rgba(107,66,38,0.2)", cursor: "pointer" }}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
