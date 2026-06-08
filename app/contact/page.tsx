"use client";

import { useState } from "react";
import SubHeader from "@/components/layout/SubHeader";
import SubFooter from "@/components/layout/SubFooter";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SubHeader />
      <main style={{ paddingTop: 57, flex: 1, display: "flex", flexDirection: "column" }}>

        {/* 상단 — 시안 contact 섹션 그대로 */}
        <section
          className="r-section"
          style={{ padding: "96px 60px", background: "#edd6e4" }}
        >
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <div
              style={{ display: "flex", justifyContent: "center", fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#c47a9a", marginBottom: 14 }}
            >
              연락하기
            </div>
            <h1 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: "#2d1a35", lineHeight: 1.25, marginBottom: 12 }}>
              함께 만들어요
            </h1>
            <p style={{ fontSize: 15, color: "#8a5278", lineHeight: 1.85, maxWidth: 400, margin: "0 auto 44px", fontWeight: 300 }}>
              홈페이지 제작, 번역, 영상 작업 등 편하게 연락주세요.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <a
                href="mailto:osj950@gmail.com"
                style={{ display: "flex", alignItems: "center", gap: 10, background: "#c0395e", border: "1px solid #c0395e", color: "white", padding: "13px 26px", borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#a93256")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#c0395e")}
              >
                ✉️ 이메일 보내기
              </a>
              {[
                { label: "💬 카카오톡", href: "#" },
                { label: "📷 인스타그램", href: "#" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{ display: "flex", alignItems: "center", gap: 10, background: "white", border: "1px solid rgba(125,53,88,0.12)", color: "#7d3558", padding: "13px 26px", borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#7d3558"; e.currentTarget.style.color = "#fce8f4"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#7d3558"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 문의 폼 */}
        <section
          className="r-section"
          style={{ padding: "80px 60px 96px", background: "#f5e6ed", flex: 1 }}
        >
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div
              className="eyebrow-line"
              style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#c47a9a", marginBottom: 14 }}
            >
              문의 양식
            </div>
            <h2 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: "#2d1a35", marginBottom: 36 }}>
              메시지 보내기
            </h2>

            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "48px 24px", border: "1px solid rgba(125,53,88,0.15)", borderRadius: 16 }}>
                <p style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 20, color: "#2d1a35", marginBottom: 8 }}>전송 완료 ✓</p>
                <p style={{ fontSize: 14, color: "#8a5278", fontWeight: 300 }}>감사합니다. 곧 연락드리겠습니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  {[
                    { name: "name",  label: "이름 *",   type: "text",  required: true },
                    { name: "email", label: "이메일 *", type: "email", required: true },
                  ].map(({ name, label, type, required }) => (
                    <div key={name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ fontSize: 11, color: "#c47a9a", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={(form as Record<string,string>)[name]}
                        onChange={handleChange}
                        required={required}
                        style={{ borderBottom: "1px solid rgba(125,53,88,0.3)", background: "transparent", padding: "8px 0", fontSize: 14, color: "#2d1a35", outline: "none", transition: "border-color 0.2s" }}
                        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#7d3558")}
                        onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(125,53,88,0.3)")}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 11, color: "#c47a9a", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>제목</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    style={{ borderBottom: "1px solid rgba(125,53,88,0.3)", background: "transparent", padding: "8px 0", fontSize: 14, color: "#2d1a35", outline: "none", transition: "border-color 0.2s" }}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#7d3558")}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(125,53,88,0.3)")}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 11, color: "#c47a9a", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>메시지 *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    style={{ borderBottom: "1px solid rgba(125,53,88,0.3)", background: "transparent", padding: "8px 0", fontSize: 14, color: "#2d1a35", outline: "none", resize: "none", lineHeight: 1.7, transition: "border-color 0.2s" }}
                    onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#7d3558")}
                    onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(125,53,88,0.3)")}
                  />
                </div>
                {status === "error" && (
                  <p style={{ fontSize: 13, color: "#c0395e" }}>전송에 실패했습니다. 다시 시도해주세요.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{ alignSelf: "flex-start", background: "#7d3558", color: "#fce8f4", padding: "13px 40px", borderRadius: 100, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", transition: "background 0.2s, transform 0.2s", opacity: status === "loading" ? 0.6 : 1 }}
                  onMouseEnter={(e) => { if (status !== "loading") { (e.currentTarget as HTMLButtonElement).style.background = "#8b4a72"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; } }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#7d3558"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
                >
                  {status === "loading" ? "전송 중..." : "보내기"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <SubFooter />
    </div>
  );
}
