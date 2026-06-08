"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error ?? "비밀번호가 틀렸습니다.");
      }
    } catch {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5e6ed" }}>
      <form
        onSubmit={handleSubmit}
        style={{ background: "white", padding: "48px 40px", borderRadius: 20, border: "1px solid rgba(125,53,88,0.1)", width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 24 }}
      >
        <div>
          <div style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, color: "#c47a9a", letterSpacing: "0.15em", marginBottom: 10 }}>
            Admin
          </div>
          <h1 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 24, fontWeight: 800, color: "#2d1a35" }}>
            Eunseo Ok
          </h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontSize: 11, color: "#c47a9a", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            style={{ borderBottom: "1px solid rgba(125,53,88,0.3)", background: "transparent", padding: "8px 0", fontSize: 14, color: "#2d1a35", outline: "none" }}
            onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#7d3558")}
            onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(125,53,88,0.3)")}
          />
        </div>

        {error && (
          <p style={{ fontSize: 13, color: "#c0395e", background: "rgba(192,57,94,0.08)", padding: "10px 14px", borderRadius: 8, margin: 0 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ background: "#7d3558", color: "#fce8f4", padding: "13px", borderRadius: 100, fontSize: 13, fontWeight: 500, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, transition: "background 0.2s" }}
        >
          {loading ? "확인 중..." : "들어가기"}
        </button>
      </form>
    </div>
  );
}
