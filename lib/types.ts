export type WorkCategory = "branding" | "editorial" | "digital" | "illustration" | "other";

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

export const WORK_CATEGORIES: { value: WorkCategory | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "branding", label: "브랜딩" },
  { value: "editorial", label: "에디토리얼" },
  { value: "digital", label: "디지털" },
  { value: "illustration", label: "일러스트" },
  { value: "other", label: "기타" },
];
