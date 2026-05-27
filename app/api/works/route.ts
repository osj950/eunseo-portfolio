import { NextRequest, NextResponse } from "next/server";
import { getWorks, createWork } from "@/lib/google-sheets";

export async function GET() {
  try {
    const works = await getWorks();
    return NextResponse.json(works);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await createWork(body);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create work" }, { status: 500 });
  }
}
