"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebouncedCallback } from "use-debounce";
import { X } from "lucide-react";

interface Props { categories: { name: string; slug: string }[] }
export function ProductsFilter({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("query") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const updateQuery = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set("query", term); else params.delete("query");
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }, 300);

  const updateCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set("category", value); else params.delete("category");
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "newest") params.set("sort", value); else params.delete("sort");
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const clear = () => router.push("/products");
  const hasFilters = currentQuery || currentCategory || currentSort !== "newest";

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium">Search</label>
        <Input placeholder="Search..." defaultValue={currentQuery} onChange={e => updateQuery(e.target.value)} className="mt-1" />
      </div>
      <div className="w-[180px]">
        <label className="text-sm font-medium">Category</label>
        <Select value={currentCategory || "all"} onValueChange={updateCategory}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="All categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="w-[180px]">
        <label className="text-sm font-medium">Sort by</label>
        <Select value={currentSort} onValueChange={updateSort}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="Newest" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A-Z</SelectItem>
            <SelectItem value="name-desc">Name: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {hasFilters && <Button variant="ghost" size="sm" onClick={clear} className="mt-5"><X className="mr-1 h-4 w-4" /> Clear</Button>}
    </div>
  );
}
