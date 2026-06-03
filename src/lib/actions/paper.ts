"use server";

import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Role, PaperStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function uploadPaper(formData: FormData) {
  const user = await getCurrentUser();

  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const subjectId = formData.get("subjectId") as string;
  const year = parseInt(formData.get("year") as string);
  const paperType = formData.get("paperType") as string;
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  // Convert File to base64 for Cloudinary
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const uploadResult = await uploadToCloudinary(fileBase64);

  // Generate a paper code (e.g., MATH-2023-P1-1234)
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  const shortSubject = subject?.name.substring(0, 3).toUpperCase() || "SUBJ";
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const paperCode = `${shortSubject}-${year}-${paperType.substring(0, 2).toUpperCase()}-${randomSuffix}`;

  const paper = await prisma.paper.create({
    data: {
      title,
      subjectId,
      year,
      paperType,
      fileUrl: uploadResult.secure_url,
      paperCode,
      uploaderId: user.id,
      status: PaperStatus.PUBLISHED, // Auto-publishing for now as per MVP simplicity
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/subjects");
  
  return paper;
}
