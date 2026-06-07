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

  // 1. Pre-upload Validations & DB Lookups
  const title = formData.get("title") as string;
  const subjectId = formData.get("subjectId") as string;
  const yearInput = formData.get("year");
  const year = yearInput ? parseInt(yearInput as string) : NaN;
  const paperType = formData.get("paperType") as string;
  const file = formData.get("file") as File;

  if (!title || !subjectId || isNaN(year) || !paperType || !file) {
    throw new Error("Missing required fields. Please ensure title, subject, year, paper type, and file are provided.");
  }

  // Verify user exists in DB and has permission
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id }
  });

  if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
    throw new Error("Unauthorized: Only admins can upload papers.");
  }

  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) {
    throw new Error("Invalid subject selected. Please refresh and try again.");
  }

  // 2. Prepare File & Cloudinary Upload
  let uploadResult;
  try {
    // Convert File to base64 for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    uploadResult = await uploadToCloudinary(fileBase64);

    // Validate the result
    if (!uploadResult || !uploadResult.secure_url || !uploadResult.secure_url.startsWith("https://")) {
      throw new Error("Invalid response from Cloudinary. Upload might have failed.");
    }
  } catch (cloudinaryError: any) {
    console.error("CLOUDINARY_UPLOAD_ERROR:", cloudinaryError);
    throw new Error(`Cloudinary upload failed: ${cloudinaryError.message || "Unknown error"}`);
  }

  // 3. Database Save
  // Generate a more unique paper code to prevent collisions
  // Format: SUBJ-YEAR-TYPE-RANDOM (e.g., MAT-2023-P1-X7K2B)
  const shortSubject = subject.name.substring(0, 3).toUpperCase();
  const typeCode = paperType.replace(/\s+/g, "").substring(0, 2).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  const paperCode = `${shortSubject}-${year}-${typeCode}-${randomStr}`;

  try {
    const paper = await prisma.paper.create({
      data: {
        title,
        subjectId,
        year,
        paperType,
        cloudinaryUrl: uploadResult.secure_url,
        paperCode,
        uploaderId: user.id,
        status: PaperStatus.PUBLISHED,
      }
    });

    console.log(`Successfully saved paper to DB: ${paper.id} (${paperCode})`);

    revalidatePath("/dashboard");
    revalidatePath("/subjects");
    
    return { success: true, paper };
  } catch (dbError: any) {
    console.error("DATABASE_SAVE_FAILURE:", {
      error: dbError,
      message: dbError.message,
      paperData: { title, subjectId, year, paperType, paperCode, uploaderId: user.id }
    });
    
    // Note: The file remains in Cloudinary. 
    // We throw a clear message so the UI can inform the user.
    throw new Error(`Cloudinary upload succeeded, but database save failed: ${dbError.message}`);
  }
}
