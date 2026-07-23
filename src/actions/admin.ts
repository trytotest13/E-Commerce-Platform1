"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function checkAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function deleteProduct(productId: string) {
  await checkAdmin();

  await prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({ where: { productId } });
    await tx.product.delete({ where: { id: productId } });
  });

  revalidatePath("/admin/products");
}

export async function createProduct(formData: FormData) {
  await checkAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const images = (formData.get("images") as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const isFeatured = formData.get("isFeatured") === "on";

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      categoryId,
      images,
      isFeatured,
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(
  productId: string,
  formData: FormData
) {
  await checkAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const images = (formData.get("images") as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const isFeatured = formData.get("isFeatured") === "on";

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      price,
      stock,
      categoryId,
      images,
      isFeatured,
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: string
) {
  await checkAdmin();

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  revalidatePath(`/admin/orders/${orderId}`);
}