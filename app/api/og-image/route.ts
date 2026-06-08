import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

  const fullUrl = url.startsWith("http") ? url : `https://${url}`;

  try {
    const res = await fetch(fullUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; bot)" },
      signal: AbortSignal.timeout(6000),
    });
    const html = await res.text();
    const base = new URL(fullUrl).origin;

    const ogMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    if (ogMatch) {
      const img = ogMatch[1].startsWith("http") ? ogMatch[1] : `${base}${ogMatch[1]}`;
      return NextResponse.json({ url: img });
    }

    return NextResponse.json({ error: "og:image not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }
}
