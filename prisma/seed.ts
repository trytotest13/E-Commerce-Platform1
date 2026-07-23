import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash("admin123", 10);
  const userHash = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { name: "Admin User", email: "admin@example.com", passwordHash: adminHash, role: Role.ADMIN, emailVerified: new Date() },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: { name: "Jane Doe", email: "user@example.com", passwordHash: userHash, role: Role.USER, emailVerified: new Date() },
  });

  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Electronics", slug: "electronics" } }),
    prisma.category.create({ data: { name: "Clothing", slug: "clothing" } }),
    prisma.category.create({ data: { name: "Books", slug: "books" } }),
    prisma.category.create({ data: { name: "Home & Garden", slug: "home-garden" } }),
  ]);

  const productsData = [
    { name: "Wireless Headphones", description: "Premium noise-cancelling wireless headphones with 30-hour battery life.", price: 149.99, stock: 25, categoryId: categories[0].id, images: ["/images/headphones.jpg"], isFeatured: true },
    { name: "Smartphone Stand", description: "Adjustable aluminum stand for smartphones and tablets.", price: 29.99, stock: 100, categoryId: categories[0].id, images: ["/images/stand.jpg"] },
    { name: "Cotton T-Shirt", description: "Comfortable unisex cotton t-shirt available in multiple colors.", price: 19.99, stock: 200, categoryId: categories[1].id, images: ["/images/tshirt.jpg"] },
    { name: "Denim Jacket", description: "Classic denim jacket with a modern fit.", price: 89.99, stock: 45, categoryId: categories[1].id, images: ["/images/denim-jacket.jpg"], isFeatured: true },
    { name: "TypeScript Handbook", description: "The official handbook covering all TypeScript features.", price: 39.99, stock: 50, categoryId: categories[2].id, images: ["/images/ts-handbook.jpg"] },
    { name: "Ceramic Plant Pot", description: "Minimalist ceramic pot for indoor plants.", price: 24.99, stock: 75, categoryId: categories[3].id, images: ["/images/plant-pot.jpg"] },
  ];

  for (const product of productsData) {
    await prisma.product.create({ data: product });
  }

  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
      items: {
        create: [
          { productId: (await prisma.product.findFirst({ where: { name: "Wireless Headphones" } }))!.id, quantity: 1 },
          { productId: (await prisma.product.findFirst({ where: { name: "Cotton T-Shirt" } }))!.id, quantity: 2 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user.id,
      status: "PAID",
      total: 169.97,
      shippingAddress: { name: "Jane Doe", address: "123 Main St", city: "San Francisco", state: "CA", zip: "94105" },
      paymentIntentId: "pi_sample_123456",
      items: {
        create: [
          { productId: (await prisma.product.findFirst({ where: { name: "Wireless Headphones" } }))!.id, quantity: 1, price: 149.99 },
          { productId: (await prisma.product.findFirst({ where: { name: "Denim Jacket" } }))!.id, quantity: 1, price: 89.99 },
        ],
      },
    },
  });

  await prisma.review.create({
    data: {
      userId: user.id,
      productId: (await prisma.product.findFirst({ where: { name: "Wireless Headphones" } }))!.id,
      rating: 5,
      comment: "Amazing sound quality!",
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
