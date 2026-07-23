import { z } from "zod";
export const productFormSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),
  categoryId: z.string().min(1),
  images: z.string().optional(),
  isFeatured: z.boolean().default(false),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;
