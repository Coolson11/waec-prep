"use server";

import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const FREE_DOWNLOAD_LIMIT = 3;

export async function handleDownload(paperId: string) {
  const user = await getCurrentUser();

  if (!user) {
    // Guest users cannot download according to PRD (Phase 2 says Free vs Premium)
    // Wait, PRD says "Free Users: 3 lifetime downloads". This implies they must be logged in.
    return { error: "Please sign in to download papers." };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      subscriptions: { where: { isActive: true } },
      downloads: true,
    }
  });

  const isPremium = dbUser?.subscriptions.length && dbUser.subscriptions[0].isActive;
  const downloadCount = dbUser?.downloads.length ?? 0;

  if (!isPremium && downloadCount >= FREE_DOWNLOAD_LIMIT) {
    return { error: "Free download limit reached. Please upgrade to Premium for unlimited access." };
  }

  // Create download record
  await prisma.download.create({
    data: {
      userId: user.id,
      paperId: paperId,
    }
  });

  // Get paper file URL
  const paper = await prisma.paper.findUnique({
    where: { id: paperId },
    select: { fileUrl: true }
  });

  if (!paper) {
    return { error: "Paper not found." };
  }

  // For now, return the URL. In a real scenario, we might use a signed URL from Cloudinary.
  return { url: paper.fileUrl };
}
