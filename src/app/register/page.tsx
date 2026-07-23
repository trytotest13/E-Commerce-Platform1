"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { registerUser } from "@/actions/register";
type RegisterFormValues = { name: string; email: string; password: string; confirmPassword: string; };
export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    const formData = new FormData();
    formData.append("name", data.name); formData.append("email", data.email); formData.append("password", data.password); formData.append("confirmPassword", data.confirmPassword);
    const result = await registerUser(formData);
    if (result.error) { const firstError = Object.values(result.error).flat()[0]; setServerError(firstError || "Registration failed"); return; }
    router.push("/login?registered=true");
  };
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md"><CardHeader><CardTitle className="text-2xl font-bold">Create Account</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><Input placeholder="Full Name" {...register("name")} disabled={isSubmitting} />{errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}</div>
            <div><Input type="email" placeholder="Email" {...register("email")} disabled={isSubmitting} />{errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}</div>
            <div><Input type="password" placeholder="Password" {...register("password")} disabled={isSubmitting} />{errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}</div>
            <div><Input type="password" placeholder="Confirm Password" {...register("confirmPassword")} disabled={isSubmitting} />{errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}</div>
            {serverError && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{serverError}</div>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Register"}</Button>
            <p className="text-center text-sm">Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link></p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
