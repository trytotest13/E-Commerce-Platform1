import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;
  let event;
  try { event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }); }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({ where: { id: orderId }, data: { status: "PAID", paymentIntentId: session.payment_intent as string }, include: { items: true } });
      for (const item of order.items) { await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } }); }
      const cart = await tx.cart.findUnique({ where: { userId: order.userId } });
      if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    });
  }
  return NextResponse.json({ received: true });
}
