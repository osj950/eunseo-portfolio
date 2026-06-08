import { NextRequest, NextResponse } from "next/server";
import { updateWebsiteProject, deleteWebsiteProject } from "@/lib/google-sheets";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await updateWebsiteProject(id, body);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[websites PATCH]", e);
    return NextResponse.json({ error: "Failed to update website project" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteWebsiteProject(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[websites DELETE]", e);
    return NextResponse.json({ error: "Failed to delete website project" }, { status: 500 });
  }
}
