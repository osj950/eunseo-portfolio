export type WorkCategory = "web" | "app" | "video" | "embroidery" | "other";

export interface Work {
  id: string;
  title: string;
  category: WorkCategory;
  description: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  year: string;
  createdAt: string;
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "unread" | "read" | "replied";
}

export interface WebsiteProject {
  id: string;
  name: string;
  description: string;
  url: string;
  thumbnail: string;
  createdAt: string;
}

export const WORK_CATEGORIES: { value: WorkCategory | "all"; label: string; icon: string }[] = [
  { value: "all",        label: "전체",     icon: "" },
  { value: "web",        label: "홈페이지", icon: "🌐" },
  { value: "app",        label: "앱",       icon: "📱" },
  { value: "video",      label: "영상",     icon: "🎬" },
  { value: "embroidery", label: "자수",     icon: "🧵" },
  { value: "other",      label: "기타",     icon: "✨" },
];
