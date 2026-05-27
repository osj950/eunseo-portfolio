import { NextRequest, NextResponse } from "next/server";
import { getWebsiteProjects, createWebsiteProject } from "@/lib/google-sheets";

export async function GET() {
  try {
    const projects = await getWebsiteProjects();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await createWebsiteProject(body);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create website project" }, { status: 500 });
  }
}
