import { NextRequest, NextResponse } from "next/server";
import { updateInquiryStatus } from "@/lib/google-sheets";
import { Inquiry } from "@/lib/types";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    await updateInquiryStatus(id, status as Inquiry["status"]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}
