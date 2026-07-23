"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shippingAddressSchema } from "@/lib/validations/checkout";
import type { z } from "zod";
type ShippingFormValues = z.infer<typeof shippingAddressSchema>;

export function CheckoutForm({ cartItems }: { cartItems: any[] }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingAddressSchema),
  });

  const onSubmit = async (data: ShippingFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress: data }),
      });
      if (!res.ok) { const body = await res.json(); throw new Error(body.error || "Error"); }
      const { url } = await res.json();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Full Name" {...register("name")} />{errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      <Input placeholder="Address" {...register("address")} />{errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div><Input placeholder="City" {...register("city")} />{errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}</div>
        <div><Input placeholder="State" {...register("state")} />{errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Input placeholder="ZIP Code" {...register("zip")} />{errors.zip && <p className="text-sm text-red-500">{errors.zip.message}</p>}</div>
        <div><Input placeholder="Country" {...register("country")} />{errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}</div>
      </div>
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Redirecting to Stripe..." : "Proceed to Payment"}</Button>
    </form>
  );
}
