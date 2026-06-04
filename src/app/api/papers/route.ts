import { NextResponse } from "next/server";
import { getAllPapers } from "@/lib/data";

export async function GET() {
  try {
    const papers = await getAllPapers();
    return NextResponse.json(papers);
  } catch (error) {
    console.error("Failed to fetch papers:", error);
    return NextResponse.json({ error: "Failed to fetch papers" }, { status: 500 });
  }
}
