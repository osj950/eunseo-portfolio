import { NextRequest, NextResponse } from "next/server";
import { updateWork, deleteWork } from "@/lib/google-sheets";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await updateWork(id, body);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[works PATCH]", e);
    return NextResponse.json({ error: "Failed to update work" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteWork(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[works DELETE]", e);
    return NextResponse.json({ error: "Failed to delete work" }, { status: 500 });
  }
}
