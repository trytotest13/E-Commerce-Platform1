import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/product-card";
import { ProductsFilter } from "@/components/products/products-filter";
import { Pagination } from "@/components/shared/pagination";
import { ShopPage } from "@/components/layout/shop-page";
const PRODUCTS_PER_PAGE = 9;
export default async function ProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = Number(searchParams.page) || 1;
  const query = (searchParams.query as string) || "";
  const category = (searchParams.category as string) || "";
  const sort = (searchParams.sort as string) || "newest";
  const where: any = {};
  if (query) where.OR = [{ name: { contains: query, mode: "insensitive" } }, { description: { contains: query, mode: "insensitive" } }];
  if (category) where.category = { slug: category };
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name-asc") orderBy = { name: "asc" };
  if (sort === "name-desc") orderBy = { name: "desc" };
  const [products, totalProducts, categories] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip: (page - 1) * PRODUCTS_PER_PAGE, take: PRODUCTS_PER_PAGE, include: { category: true } }),
    prisma.product.count({ where }),
    prisma.category.findMany({ select: { name: true, slug: true } }),
  ]);
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  return (
    <ShopPage>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">All Products</h1>
        <ProductsFilter categories={categories} />
        <section className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.length > 0 ? products.map(p => <ProductCard key={p.id} product={p} />) : <div className="col-span-full py-12 text-center"><p className="text-lg text-gray-500">No products found.</p></div>}
        </section>
        {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} />}
      </div>
    </ShopPage>
  );
}
