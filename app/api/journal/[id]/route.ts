import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateJournalPost, deleteJournalPost } from "@/lib/google-sheets";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await updateJournalPost(id, body);
    revalidatePath("/");
    revalidatePath("/journal");
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[journal PATCH]", e);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteJournalPost(id);
    revalidatePath("/");
    revalidatePath("/journal");
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[journal DELETE]", e);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
