import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ items: [] });
  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id }, include: { items: { include: { product: true } } } });
  if (!cart) return NextResponse.json({ items: [] });
  const items = cart.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    name: item.product.name,
    price: item.product.price,
    image: (item.product.images as string[])?.[0] || "",
  }));
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { items } = await req.json() as { items: { productId: string; quantity: number }[] };
  const cart = await prisma.cart.upsert({ where: { userId: session.user.id }, update: {}, create: { userId: session.user.id } });
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  const validItems = [];
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (product) validItems.push({ productId: item.productId, quantity: item.quantity });
  }
  if (validItems.length > 0) {
    await prisma.cartItem.createMany({ data: validItems.map(i => ({ cartId: cart.id, productId: i.productId, quantity: i.quantity })) });
  }
  return NextResponse.json({ success: true });
}
