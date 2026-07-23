import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { shippingAddress } = await req.json();
  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id }, include: { items: { include: { product: true } } } });
  if (!cart || cart.items.length === 0) return NextResponse.json({ error: "Cart empty" }, { status: 400 });

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      status: "PENDING",
      total: 0,
      shippingAddress,
      items: { create: cart.items.map(item => ({ productId: item.productId, quantity: item.quantity, price: item.product.price })) },
    },
    include: { items: true },
  });
  const total = order.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  await prisma.order.update({ where: { id: order.id }, data: { total } });

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    metadata: { orderId: order.id },
    line_items: cart.items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.product.name, images: ((item.product.images as string[]).length > 0 ? [(item.product.images as string[])[0]] : []) },
        unit_amount: Math.round(Number(item.product.price) * 100),
      },
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/checkout/success`,
    cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/cart`,
  });
  await prisma.order.update({ where: { id: order.id }, data: { paymentIntentId: stripeSession.payment_intent as string } });
  return NextResponse.json({ url: stripeSession.url });
}
