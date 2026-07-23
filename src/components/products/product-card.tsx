import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@prisma/client";

interface Props { product: Product & { category: { name: string } } }
export function ProductCard({ product }: Props) {
  const img = (product.images as string[])?.[0] || "/images/placeholder.jpg";
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group h-full transition-shadow hover:shadow-lg">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img src={img} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-gray-500">{product.category.name}</p>
          <h3 className="mt-1 font-semibold line-clamp-1">{product.name}</h3>
          <p className="mt-2 text-lg font-bold">${product.price.toString()}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <span className="text-sm text-gray-600">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
