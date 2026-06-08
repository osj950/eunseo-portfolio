import { google } from "googleapis";
import { JournalPost, Work, Inquiry, WebsiteProject } from "./types";

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheets() {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
}

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

// 실제 Google Sheets 탭 이름과 동기화
const SHEET_JOURNAL  = "기록(Journal)";
const SHEET_CONTACT  = "문의하기";
const SHEET_WORKS    = "works";
const SHEET_WEBSITES = "홈페이지제작";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureSheet(sheets: any, sheetName: string, headers?: string[]): Promise<void> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const exists = meta.data.sheets?.some((s: any) => s.properties?.title === sheetName);
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests: [{ addSheet: { properties: { title: sheetName } } }] },
    });
  }
  if (headers) {
    const check = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:A1`,
    });
    if (!check.data.values?.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1`,
        valueInputOption: "RAW",
        requestBody: { values: [headers] },
      });
    }
  }
}

// ─── Journal ──────────────────────────────────────────────────────────────────

export async function getJournalPosts(): Promise<JournalPost[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_JOURNAL}!A2:G`,
  });
  const rows = res.data.values ?? [];
  return rows.map((r) => ({
    id: r[0] ?? "",
    slug: r[1] ?? "",
    title: r[2] ?? "",
    content: r[3] ?? "",
    excerpt: r[4] ?? "",
    date: r[5] ?? "",
    createdAt: r[6] ?? "",
  }));
}

export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  const posts = await getJournalPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function createJournalPost(post: Omit<JournalPost, "id" | "createdAt">): Promise<void> {
  const sheets = getSheets();
  await ensureSheet(sheets, SHEET_JOURNAL, ["id", "slug", "title", "content", "excerpt", "date", "createdAt"]);
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_JOURNAL}!A:G`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[id, post.slug, post.title, post.content, post.excerpt, post.date, createdAt]],
    },
  });
}

export async function updateJournalPost(id: string, post: Partial<JournalPost>): Promise<void> {
  const sheets = getSheets();
  const posts = await getJournalPosts();
  const rowIndex = posts.findIndex((p) => p.id === id);
  if (rowIndex === -1) throw new Error("Post not found");
  const row = rowIndex + 2;
  const existing = posts[rowIndex];
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_JOURNAL}!A${row}:G${row}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        id,
        post.slug ?? existing.slug,
        post.title ?? existing.title,
        post.content ?? existing.content,
        post.excerpt ?? existing.excerpt,
        post.date ?? existing.date,
        existing.createdAt,
      ]],
    },
  });
}

export async function deleteJournalPost(id: string): Promise<void> {
  const sheets = getSheets();
  const posts = await getJournalPosts();
  const rowIndex = posts.findIndex((p) => p.id === id);
  if (rowIndex === -1) throw new Error("Post not found");
  const sheetId = await getSheetId(sheets, SHEET_JOURNAL);
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: { sheetId, dimension: "ROWS", startIndex: rowIndex + 1, endIndex: rowIndex + 2 },
        },
      }],
    },
  });
}

// ─── Works ────────────────────────────────────────────────────────────────────

export async function getWorks(): Promise<Work[]> {
  const sheets = getSheets();
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_WORKS}!A2:I`,
    });
    const rows = res.data.values ?? [];
    return rows.map((r) => ({
      id: r[0] ?? "",
      title: r[1] ?? "",
      category: r[2] ?? "other",
      description: r[3] ?? "",
      thumbnail: r[4] ?? "",
      images: r[5] ? r[5].split(",").map((s: string) => s.trim()) : [],
      tags: r[6] ? r[6].split(",").map((s: string) => s.trim()) : [],
      year: r[7] ?? "",
      createdAt: r[8] ?? "",
    }));
  } catch {
    return [];
  }
}

export async function createWork(work: Omit<Work, "id" | "createdAt">): Promise<void> {
  const sheets = getSheets();
  await ensureSheet(sheets, SHEET_WORKS, ["id", "title", "category", "description", "thumbnail", "images", "tags", "year", "createdAt"]);
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_WORKS}!A:I`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        id, work.title, work.category, work.description,
        work.thumbnail, work.images.join(", "), work.tags.join(", "), work.year, createdAt,
      ]],
    },
  });
}

export async function updateWork(id: string, work: Partial<Work>): Promise<void> {
  const sheets = getSheets();
  const works = await getWorks();
  const rowIndex = works.findIndex((w) => w.id === id);
  if (rowIndex === -1) throw new Error("Work not found");
  const row = rowIndex + 2;
  const existing = works[rowIndex];
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_WORKS}!A${row}:I${row}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        id,
        work.title ?? existing.title,
        work.category ?? existing.category,
        work.description ?? existing.description,
        work.thumbnail ?? existing.thumbnail,
        (work.images ?? existing.images).join(", "),
        (work.tags ?? existing.tags).join(", "),
        work.year ?? existing.year,
        existing.createdAt,
      ]],
    },
  });
}

export async function deleteWork(id: string): Promise<void> {
  const sheets = getSheets();
  const works = await getWorks();
  const rowIndex = works.findIndex((w) => w.id === id);
  if (rowIndex === -1) throw new Error("Work not found");
  const sheetId = await getSheetId(sheets, SHEET_WORKS);
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: { sheetId, dimension: "ROWS", startIndex: rowIndex + 1, endIndex: rowIndex + 2 },
        },
      }],
    },
  });
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export async function getInquiries(): Promise<Inquiry[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_CONTACT}!A2:G`,
  });
  const rows = res.data.values ?? [];
  return rows.map((r) => ({
    id: r[0] ?? "",
    name: r[1] ?? "",
    email: r[2] ?? "",
    subject: r[3] ?? "",
    message: r[4] ?? "",
    createdAt: r[5] ?? "",
    status: (r[6] as Inquiry["status"]) ?? "unread",
  }));
}

export async function createInquiry(inquiry: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<void> {
  const sheets = getSheets();
  await ensureSheet(sheets, SHEET_CONTACT, ["id", "name", "email", "subject", "message", "createdAt", "status"]);
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_CONTACT}!A:G`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[id, inquiry.name, inquiry.email, inquiry.subject, inquiry.message, createdAt, "unread"]],
    },
  });
}

export async function updateInquiryStatus(id: string, status: Inquiry["status"]): Promise<void> {
  const sheets = getSheets();
  const inquiries = await getInquiries();
  const rowIndex = inquiries.findIndex((i) => i.id === id);
  if (rowIndex === -1) throw new Error("Inquiry not found");
  const row = rowIndex + 2;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_CONTACT}!G${row}`,
    valueInputOption: "RAW",
    requestBody: { values: [[status]] },
  });
}

// ─── Website Projects ─────────────────────────────────────────────────────────

export async function getWebsiteProjects(): Promise<WebsiteProject[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_WEBSITES}!A2:F`,
  });
  const rows = res.data.values ?? [];
  return rows.map((r) => ({
    id: r[0] ?? "",
    name: r[1] ?? "",
    description: r[2] ?? "",
    url: r[3] ?? "",
    thumbnail: r[4] ?? "",
    createdAt: r[5] ?? "",
  }));
}

export async function createWebsiteProject(project: Omit<WebsiteProject, "id" | "createdAt">): Promise<void> {
  const sheets = getSheets();
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_WEBSITES}!A:F`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[id, project.name, project.description, project.url, project.thumbnail, createdAt]],
    },
  });
}

export async function updateWebsiteProject(id: string, project: Partial<WebsiteProject>): Promise<void> {
  const sheets = getSheets();
  const projects = await getWebsiteProjects();
  const rowIndex = projects.findIndex((p) => p.id === id);
  if (rowIndex === -1) throw new Error("Project not found");
  const row = rowIndex + 2;
  const existing = projects[rowIndex];
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_WEBSITES}!A${row}:F${row}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        id,
        project.name ?? existing.name,
        project.description ?? existing.description,
        project.url ?? existing.url,
        project.thumbnail ?? existing.thumbnail,
        existing.createdAt,
      ]],
    },
  });
}

export async function deleteWebsiteProject(id: string): Promise<void> {
  const sheets = getSheets();
  const projects = await getWebsiteProjects();
  const rowIndex = projects.findIndex((p) => p.id === id);
  if (rowIndex === -1) throw new Error("Project not found");
  const sheetId = await getSheetId(sheets, SHEET_WEBSITES);
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: { sheetId, dimension: "ROWS", startIndex: rowIndex + 1, endIndex: rowIndex + 2 },
        },
      }],
    },
  });
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getSheetId(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sheets: any,
  sheetName: string,
): Promise<number> {
  const res = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheet = res.data.sheets?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s: any) => s.properties?.title === sheetName,
  );
  return sheet?.properties?.sheetId ?? 0;
}
