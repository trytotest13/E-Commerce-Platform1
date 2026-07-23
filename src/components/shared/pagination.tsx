"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props { currentPage: number; totalPages: number; }
export function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const go = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);
  };
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button variant="outline" size="icon" disabled={currentPage <= 1} onClick={() => go(currentPage - 1)}><ChevronLeft className="h-4 w-4" /></Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <Button key={page} variant={page === currentPage ? "default" : "outline"} size="icon" onClick={() => go(page)}>{page}</Button>
      ))}
      <Button variant="outline" size="icon" disabled={currentPage >= totalPages} onClick={() => go(currentPage + 1)}><ChevronRight className="h-4 w-4" /></Button>
    </div>
  );
}
