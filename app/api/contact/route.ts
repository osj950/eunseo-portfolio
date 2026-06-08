import { NextRequest, NextResponse } from "next/server";
import { getInquiries, createInquiry } from "@/lib/google-sheets";

export async function GET() {
  try {
    const inquiries = await getInquiries();
    return NextResponse.json(inquiries);
  } catch (e) {
    console.error("[contact GET]", e);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: "필수 항목을 모두 입력해주세요" }, { status: 400 });
    }
    await createInquiry({ name, email, subject: subject ?? "", message });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error("[contact POST]", e);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
