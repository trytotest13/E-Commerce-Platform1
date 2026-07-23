import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { Rating } from "@/components/products/rating";
import { ShopPage } from "@/components/layout/shop-page";
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true, reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } } },
  });
  if (!product) notFound();
  const images = product.images as string[];
  const avgRating = product.reviews.length ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length : 0;
  return (
    <ShopPage>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4"><div className="aspect-square overflow-hidden rounded-lg"><img src={images[0] || "/images/placeholder.jpg"} alt={product.name} className="h-full w-full object-cover" /></div>{images.length > 1 && <div className="grid grid-cols-4 gap-2">{images.slice(1).map((img, i) => <div key={i} className="aspect-square overflow-hidden rounded-md"><img src={img} alt={`${product.name} ${i+2}`} className="h-full w-full object-cover" /></div>)}</div>}</div>
          <div>
            <p className="text-sm text-gray-500">{product.category.name}</p>
            <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2"><Rating value={avgRating} readonly /><span className="text-sm text-gray-600">({product.reviews.length} reviews)</span></div>
            <p className="mt-6 text-3xl font-bold">${product.price.toString()}</p>
            <p className="mt-4 text-gray-600">{product.description}</p>
            <div className="mt-6"><span className="text-sm font-medium">{product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}</span></div>
            <div className="mt-6"><AddToCartButton productId={product.id} disabled={product.stock === 0} name={product.name} price={Number(product.price)} image={images[0] || "/images/placeholder.jpg"} /></div>
          </div>
        </div>
        <section className="mt-12"><h2 className="text-2xl font-bold">Customer Reviews</h2>{product.reviews.length === 0 ? <p className="mt-4 text-gray-500">No reviews yet.</p> : <div className="mt-4 space-y-4">{product.reviews.map(r => <div key={r.id} className="border-b pb-4"><div className="flex items-center gap-2"><span className="font-medium">{r.user.name}</span><Rating value={r.rating} readonly size={16} /></div>{r.comment && <p className="mt-1 text-gray-600">{r.comment}</p>}</div>)}</div>}</section>
      </main>
    </ShopPage>
  );
}
