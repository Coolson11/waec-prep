"use server";

import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";

const PREVIEW_LIMIT = 5;

export async function checkPreviewAccess() {
  const user = await getCurrentUser();

  if (user) {
    // If premium, always allow (assuming premium logic will be added)
    // For now, check if user has reached limit
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { previewCount: true, subscriptions: { where: { isActive: true } } }
    });

    if (dbUser?.subscriptions.length && dbUser.subscriptions[0].isActive) {
      return { allowed: true, count: -1 }; // Unlimited
    }

    if ((dbUser?.previewCount ?? 0) >= PREVIEW_LIMIT) {
      return { allowed: false, count: dbUser?.previewCount };
    }

    return { allowed: true, count: dbUser?.previewCount };
  } else {
    // Guest user - check cookies
    const cookieStore = cookies();
    const guestPreviews = parseInt(cookieStore.get("waec_preview_count")?.value || "0");

    if (guestPreviews >= PREVIEW_LIMIT) {
      return { allowed: false, count: guestPreviews };
    }

    return { allowed: true, count: guestPreviews };
  }
}

export async function incrementPreviewCount() {
  const user = await getCurrentUser();

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { previewCount: true, subscriptions: { where: { isActive: true } } }
    });

    // Don't increment for premium users
    if (dbUser?.subscriptions.length && dbUser.subscriptions[0].isActive) {
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { previewCount: { increment: 1 } }
    });
  } else {
    const cookieStore = cookies();
    const guestPreviews = parseInt(cookieStore.get("waec_preview_count")?.value || "0");
    
    // Set cookie for 1 year
    cookieStore.set("waec_preview_count", (guestPreviews + 1).toString(), {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
}
