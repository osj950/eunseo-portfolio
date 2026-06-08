import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getJournalPosts, createJournalPost } from "@/lib/google-sheets";

export async function GET() {
  try {
    const posts = await getJournalPosts();
    return NextResponse.json(posts);
  } catch (e) {
    console.error("[journal GET]", e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await createJournalPost(body);
    revalidatePath("/");
    revalidatePath("/journal");
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error("[journal POST]", e);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
