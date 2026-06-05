"use server";

import { getCurrentUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Role, PaperStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function uploadPaper(formData: FormData) {
  const sessionUser = await getCurrentUser();

  if (!sessionUser || !sessionUser.id) {
    throw new Error("You must be logged in to upload papers.");
  }

  // Verify user exists in DB and has permission
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id }
  });

  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
    throw new Error("Unauthorized: Only admins can upload papers.");
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

  // Validate the result
  if (!uploadResult.secure_url || !uploadResult.secure_url.startsWith("https://")) {
    throw new Error("Invalid URL returned from Cloudinary upload.");
  }

  // Generate a paper code (e.g., MATH-2023-P1-1234)
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });

  if (!subject) {
    throw new Error("Invalid subject selected.");
  }

  const shortSubject = subject.name.substring(0, 3).toUpperCase();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const paperCode = `${shortSubject}-${year}-${paperType.substring(0, 2).toUpperCase()}-${randomSuffix}`;

  const paper = await prisma.paper.create({
    data: {
      title,
      subjectId,
      year,
      paperType,
      cloudinaryUrl: uploadResult.secure_url,
      paperCode,
      uploaderId: user.id,
      status: PaperStatus.PUBLISHED, // Auto-publishing for now as per MVP simplicity
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/subjects");
  
  return paper;
}
