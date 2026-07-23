"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { productFormSchema, ProductFormValues } from "@/lib/validations/product";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/admin";
import type { Category, Product } from "@prisma/client";

export function ProductForm({ categories, initialData }: { categories: Category[]; initialData?: Product }) {
  const router = useRouter();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData ? Number(initialData.price) : 0,
      stock: initialData?.stock || 0,
      categoryId: initialData?.categoryId || "",
      images: initialData ? (initialData.images as string[]).join(", ") : "",
      isFeatured: initialData?.isFeatured || false,
    },
  });

  async function onSubmit(data: ProductFormValues) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("categoryId", data.categoryId);
    formData.append("images", data.images || "");
    if (data.isFeatured) formData.append("isFeatured", "on");

    try {
      if (initialData) await updateProduct(initialData.id, formData);
      else await createProduct(formData);
    } catch (e) { console.error(e); }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="price" render={({ field }) => (
            <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="stock" render={({ field }) => (
            <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="categoryId" render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
              <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="images" render={({ field }) => (
          <FormItem><FormLabel>Images (comma-separated URLs)</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>Enter URLs separated by commas.</FormDescription><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="isFeatured" render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            <div className="space-y-1 leading-none"><FormLabel>Featured</FormLabel><FormDescription>Show on homepage</FormDescription></div>
          </FormItem>
        )} />
        <div className="flex gap-4">
          <Button type="submit">{initialData ? "Update Product" : "Create Product"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </Form>
  );
}
