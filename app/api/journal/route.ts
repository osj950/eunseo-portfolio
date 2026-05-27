import { NextRequest, NextResponse } from "next/server";
import { getJournalPosts, createJournalPost } from "@/lib/google-sheets";

export async function GET() {
  try {
    const posts = await getJournalPosts();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await createJournalPost(body);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
