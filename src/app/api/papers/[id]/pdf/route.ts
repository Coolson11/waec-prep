import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      console.error("[PDF Proxy] Unauthorized access attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const paper = await prisma.paper.findUnique({
      where: { id: id },
      select: { cloudinaryUrl: true, title: true }
    });

    if (!paper || !paper.cloudinaryUrl) {
      console.error(`[PDF Proxy] Paper not found for ID: ${id}`);
      return new NextResponse("Paper not found", { status: 404 });
    }

    console.log(`[PDF Proxy] Fetching PDF from: ${paper.cloudinaryUrl}`);

    const response = await fetch(paper.cloudinaryUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    
    if (!response.ok) {
      console.error(`[PDF Proxy] Cloudinary fetch failed: ${response.status} ${response.statusText}`);
      return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, { status: response.status });
    }

    const blob = await response.blob();
    
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${paper.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`,
        "Cache-Control": "public, max-age=3600"
      },
    });
  } catch (error: any) {
    console.error("[PDF Proxy] Fatal Error:", error.message || error);
    return new NextResponse(`Internal Server Error: ${error.message || "Unknown error"}`, { status: 500 });
  }
}
