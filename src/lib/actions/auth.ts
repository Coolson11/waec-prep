"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { ratelimit } from "@/lib/ratelimit";

export async function signUp(formData: FormData) {
  const forwarded = (await headers()).get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";
  
  const { success } = await ratelimit.auth.limit(ip);
  if (!success) {
    return { error: "Too many requests. Please try again later." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return { error: "Something went wrong" };
  }
}
