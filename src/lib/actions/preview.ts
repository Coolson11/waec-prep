"use server";

import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";

const GUEST_PREVIEW_LIMIT = 5;

export type PreviewMode = "full" | "first-page-only" | "blocked";

export async function checkPreviewAccess() {
  const sessionUser = await getCurrentUser();

  if (sessionUser) {
    // Authenticated users get full access
    // We could still track usage for premium limits here if needed
    const dbUser = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { 
        previewCount: true, 
        subscriptions: { where: { isActive: true } } 
      }
    });

    const isPremium = dbUser?.subscriptions && dbUser.subscriptions.length > 0;
    
    return { 
      allowed: true, 
      mode: "full" as PreviewMode,
      isPremium,
      count: dbUser?.previewCount ?? 0
    };
  } else {
    // Guest user - check cookies (Awaited for Next.js 15+)
    const cookieStore = await cookies();
    const guestPreviews = parseInt(cookieStore.get("waec_preview_count")?.value || "0");

    if (guestPreviews >= GUEST_PREVIEW_LIMIT) {
      return { 
        allowed: false, 
        mode: "blocked" as PreviewMode,
        count: guestPreviews
      };
    }

    return { 
      allowed: true, 
      mode: "first-page-only" as PreviewMode,
      count: guestPreviews
    };
  }
}

export async function incrementPreviewCount(paperId?: string) {
  const sessionUser = await getCurrentUser();

  if (sessionUser) {
    // Increment for authenticated users (tracking)
    await prisma.user.update({
      where: { id: sessionUser.id },
      data: { previewCount: { increment: 1 } }
    });

    // Record a view if paperId is provided
    if (paperId) {
      await prisma.view.create({
        data: {
          userId: sessionUser.id,
          paperId: paperId
        }
      });
    }
  } else {
    // Increment for guests in cookies
    const cookieStore = await cookies();
    const guestPreviews = parseInt(cookieStore.get("waec_preview_count")?.value || "0");
    
    // Set/Update cookie for 1 year
    cookieStore.set("waec_preview_count", (guestPreviews + 1).toString(), {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      httpOnly: true, // Security best practice
      secure: process.env.NODE_ENV === "production",
    });
  }
}
