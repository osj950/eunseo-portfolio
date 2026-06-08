"use client";

import { useEffect, useState } from "react";
import { JournalPost } from "@/lib/types";
import Link from "next/link";

export default function AdminJournalPage() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    setLoading(true);
    fetch("/api/journal").then((r) => r.json()).then((d) => setPosts(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/journal/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
        <div>
          <div
            className="eyebrow-line"
            style={{ fontFamily: "var(--font-playfair-display)", fontStyle: "italic", fontSize: 12, letterSpacing: "0.15em", color: "#c47a9a", marginBottom: 10 }}
          >
            관리
          </div>
          <h1 style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 28, fontWeight: 800, color: "#2d1a35" }}>기록 관리</h1>
        </div>
        <Link
          href="/admin/journal/new"
          style={{ background: "#7d3558", color: "#fce8f4", padding: "11px 24px", borderRadius: 100, fontSize: 13, fontWeight: 500, textDecoration: "none" }}
        >
          + 새 글 작성
        </Link>
      </div>

      <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(125,53,88,0.08)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 32, fontSize: 14, color: "#c47a9a" }}>불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div style={{ padding: 32, fontSize: 14, color: "#c47a9a" }}>기록이 없습니다.</div>
        ) : posts.map((post, i) => (
          <div
            key={post.id}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: i < posts.length - 1 ? "1px solid rgba(125,53,88,0.07)" : "none" }}
          >
            <div>
              <div style={{ fontSize: 11, color: "#c47a9a", marginBottom: 4, fontFamily: "var(--font-playfair-display)", fontStyle: "italic" }}>{post.date}</div>
              <p style={{ fontFamily: "var(--font-nanum-myeongjo)", fontSize: 15, fontWeight: 700, color: "#2d1a35" }}>{post.title}</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href={`/admin/journal/${post.id}`} style={{ fontSize: 12, color: "#8a5278", textDecoration: "none", padding: "6px 14px", border: "1px solid rgba(125,53,88,0.2)", borderRadius: 100, transition: "all 0.15s" }}>
                수정
              </Link>
              <button
                onClick={() => handleDelete(post.id)}
                style={{ fontSize: 12, color: "#c0395e", background: "none", border: "1px solid rgba(192,57,94,0.2)", borderRadius: 100, padding: "6px 14px", cursor: "pointer", transition: "all 0.15s" }}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
