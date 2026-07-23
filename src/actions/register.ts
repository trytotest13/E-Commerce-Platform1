"use server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const validated = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!validated.success) return { error: validated.error.flatten().fieldErrors };

  const { name, email, password } = validated.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: { email: ["Email already exists"] } };

  await prisma.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 10), role: "USER" },
  });
  return { success: true };
}
