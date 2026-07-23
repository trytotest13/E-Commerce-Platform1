import { z } from "zod";
export const shippingAddressSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zip: z.string().min(5),
  country: z.string().min(2),
});
