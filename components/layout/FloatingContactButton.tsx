"use client";

import Link from "next/link";
import { useState } from "react";

export default function FloatingContactButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/contact"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="문의하기"
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        background: "#c0395e",
        color: "white",
        borderRadius: 100,
        width: hovered ? 136 : 52,
        height: 52,
        textDecoration: "none",
        boxShadow: hovered
          ? "0 8px 28px rgba(192,57,94,0.5)"
          : "0 4px 18px rgba(192,57,94,0.35)",
        transform: hovered ? "scale(1.04)" : "scale(1)",
        transition: "width 0.25s ease, box-shadow 0.2s, transform 0.2s",
        overflow: "hidden",
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
    >
      {/* 아이콘 — 항상 고정 위치 */}
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: 52, height: 52 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </span>

      {/* 레이블 — 호버 시 슬라이드 인 */}
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.02em",
          opacity: hovered ? 1 : 0,
          maxWidth: hovered ? 84 : 0,
          paddingRight: hovered ? 18 : 0,
          transition: "opacity 0.15s ease, max-width 0.25s ease, padding-right 0.25s ease",
          overflow: "hidden",
        }}
      >
        문의하기
      </span>
    </Link>
  );
}
