"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import { useState, useEffect } from "react";

/* ── FontSize 커스텀 익스텐션 ──────────────────────────────── */
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() { return { types: ["textStyle"] }; },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el) => el.style.fontSize || null,
          renderHTML: (attrs) => attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize: (size: string) => ({ chain }) => chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize: () => ({ chain }) => chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

/* ── 상수 ───────────────────────────────────────────────────── */
const FONT_FAMILIES = [
  { label: "기본",                value: "" },
  { label: "Nanum Myeongjo",      value: "var(--font-nanum-myeongjo)" },
  { label: "Playfair Display",    value: "var(--font-playfair-display)" },
  { label: "Noto Sans KR",        value: "var(--font-noto-sans-kr)" },
];
const FONT_SIZES = ["12px","14px","16px","18px","20px","24px","28px","32px","40px"];

/* ── 스타일 상수 ────────────────────────────────────────────── */
const BTN_BASE: React.CSSProperties = {
  background: "transparent", border: "none", cursor: "pointer",
  borderRadius: 5, width: 30, height: 28,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 13, color: "#6B4226", transition: "background 0.15s",
  flexShrink: 0,
};
const BTN_ACTIVE: React.CSSProperties = {
  ...BTN_BASE, background: "#E8B84B", color: "#2C1810",
};
const DIVIDER: React.CSSProperties = {
  width: 1, height: 18, background: "rgba(107,66,38,0.18)", margin: "0 4px", flexShrink: 0,
};
const SELECT_STYLE: React.CSSProperties = {
  border: "1px solid rgba(107,66,38,0.2)", borderRadius: 5,
  background: "transparent", fontSize: 12, color: "#6B4226",
  padding: "2px 6px", cursor: "pointer", height: 28, outline: "none",
};

/* ── 컴포넌트 ────────────────────────────────────────────────── */
interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ value, onChange }: Props) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // StarterKit v3에 이미 포함 — 별도 import 없이 여기서 설정
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        link: { openOnClick: false } as any,
      }),
      TextStyle,
      FontFamily,
      FontSize,
      Image.configure({ inline: false }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "tiptap-editor-content" },
    },
  });

  /* 외부에서 value가 바뀔 때 동기화 (초기 로드 등) */
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const applyLink = () => {
    if (linkUrl) editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    else editor.chain().focus().unsetLink().run();
    setLinkOpen(false);
    setLinkUrl("");
  };

  const applyImage = () => {
    if (imageUrl) editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageOpen(false);
    setImageUrl("");
  };

  const currentFontFamily = editor.getAttributes("textStyle").fontFamily ?? "";
  const currentFontSize   = editor.getAttributes("textStyle").fontSize   ?? "";

  return (
    <div style={{ border: "1px solid rgba(107,66,38,0.2)", borderRadius: 10, overflow: "hidden", background: "white" }}>

      {/* ── 툴바 ── */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, padding: "8px 10px", borderBottom: "1px solid rgba(107,66,38,0.1)", background: "#FFFDF9" }}>

        {/* 서식 */}
        <button title="굵게 (Ctrl+B)" style={editor.isActive("bold")      ? BTN_ACTIVE : BTN_BASE} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}>
          <strong>B</strong>
        </button>
        <button title="기울임 (Ctrl+I)" style={editor.isActive("italic")    ? BTN_ACTIVE : BTN_BASE} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}>
          <em>I</em>
        </button>
        <button title="밑줄 (Ctrl+U)" style={editor.isActive("underline")  ? BTN_ACTIVE : BTN_BASE} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}>
          <span style={{ textDecoration: "underline" }}>U</span>
        </button>
        <button title="취소선" style={editor.isActive("strike")    ? BTN_ACTIVE : BTN_BASE} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}>
          <span style={{ textDecoration: "line-through" }}>S</span>
        </button>

        <div style={DIVIDER} />

        {/* 헤딩 */}
        <button title="제목 1" style={{ ...( editor.isActive("heading", { level: 1 }) ? BTN_ACTIVE : BTN_BASE ), fontSize: 11, width: 30 }} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}>H1</button>
        <button title="제목 2" style={{ ...( editor.isActive("heading", { level: 2 }) ? BTN_ACTIVE : BTN_BASE ), fontSize: 11, width: 30 }} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}>H2</button>
        <button title="제목 3" style={{ ...( editor.isActive("heading", { level: 3 }) ? BTN_ACTIVE : BTN_BASE ), fontSize: 11, width: 30 }} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }}>H3</button>

        <div style={DIVIDER} />

        {/* 폰트 패밀리 */}
        <select
          title="폰트 변경"
          value={currentFontFamily}
          style={SELECT_STYLE}
          onChange={(e) => {
            const v = e.target.value;
            if (v) editor.chain().focus().setFontFamily(v).run();
            else editor.chain().focus().unsetFontFamily().run();
          }}
        >
          {FONT_FAMILIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        {/* 폰트 크기 */}
        <select
          title="폰트 크기"
          value={currentFontSize}
          style={{ ...SELECT_STYLE, width: 72 }}
          onChange={(e) => {
            const v = e.target.value;
            if (v) editor.chain().focus().setFontSize(v).run();
            else editor.chain().focus().unsetFontSize().run();
          }}
        >
          <option value="">크기</option>
          {FONT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <div style={DIVIDER} />

        {/* 리스트 */}
        <button title="순서 없는 목록" style={editor.isActive("bulletList")  ? BTN_ACTIVE : BTN_BASE} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
        </button>
        <button title="순서 있는 목록" style={editor.isActive("orderedList") ? BTN_ACTIVE : BTN_BASE} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><text x="1" y="8" fontSize="7" fill="currentColor" stroke="none">1</text><text x="1" y="14" fontSize="7" fill="currentColor" stroke="none">2</text><text x="1" y="20" fontSize="7" fill="currentColor" stroke="none">3</text></svg>
        </button>
        <button title="인용" style={editor.isActive("blockquote") ? BTN_ACTIVE : BTN_BASE} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
        </button>

        <div style={DIVIDER} />

        {/* 링크 */}
        <button
          title="링크 삽입"
          style={editor.isActive("link") ? BTN_ACTIVE : BTN_BASE}
          onMouseDown={(e) => {
            e.preventDefault();
            setImageOpen(false);
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              setLinkUrl(editor.getAttributes("link").href ?? "");
              setLinkOpen((v) => !v);
            }
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>

        {/* 이미지 */}
        <button
          title="이미지 삽입"
          style={BTN_BASE}
          onMouseDown={(e) => {
            e.preventDefault();
            setLinkOpen(false);
            setImageOpen((v) => !v);
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>

        <div style={DIVIDER} />

        {/* 실행취소/다시실행 */}
        <button title="실행취소" style={BTN_BASE} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M3 13C5 7 11 4 17 6s8 8 5 13"/></svg>
        </button>
        <button title="다시실행" style={BTN_BASE} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M21 13C19 7 13 4 7 6S-1 14 2 19"/></svg>
        </button>
      </div>

      {/* ── 링크 입력 패널 ── */}
      {linkOpen && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: "1px solid rgba(107,66,38,0.1)", background: "#FFFDF9" }}>
          <span style={{ fontSize: 11, color: "#C4956A", fontWeight: 500, whiteSpace: "nowrap" }}>링크 URL</span>
          <input
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") applyLink(); if (e.key === "Escape") setLinkOpen(false); }}
            placeholder="https://example.com"
            style={{ flex: 1, border: "1px solid rgba(107,66,38,0.25)", borderRadius: 6, padding: "5px 10px", fontSize: 13, color: "#2C1810", outline: "none", background: "white" }}
          />
          <button onClick={applyLink} style={{ background: "#6B4226", color: "#FDF3DC", border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 12, cursor: "pointer" }}>확인</button>
          <button onClick={() => setLinkOpen(false)} style={{ background: "none", color: "#C4956A", border: "none", fontSize: 12, cursor: "pointer" }}>취소</button>
        </div>
      )}

      {/* ── 이미지 URL 입력 패널 ── */}
      {imageOpen && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: "1px solid rgba(107,66,38,0.1)", background: "#FFFDF9" }}>
          <span style={{ fontSize: 11, color: "#C4956A", fontWeight: 500, whiteSpace: "nowrap" }}>이미지 URL</span>
          <input
            autoFocus
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") applyImage(); if (e.key === "Escape") setImageOpen(false); }}
            placeholder="https://example.com/image.jpg"
            style={{ flex: 1, border: "1px solid rgba(107,66,38,0.25)", borderRadius: 6, padding: "5px 10px", fontSize: 13, color: "#2C1810", outline: "none", background: "white" }}
          />
          <button onClick={applyImage} style={{ background: "#6B4226", color: "#FDF3DC", border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 12, cursor: "pointer" }}>삽입</button>
          <button onClick={() => setImageOpen(false)} style={{ background: "none", color: "#C4956A", border: "none", fontSize: 12, cursor: "pointer" }}>취소</button>
        </div>
      )}

      {/* ── 에디터 본문 ── */}
      <EditorContent editor={editor} />
    </div>
  );
}
