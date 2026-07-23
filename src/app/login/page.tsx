"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
type LoginFormValues = { email: string; password: string; };
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    const res = await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    if (res?.error) { setError("Invalid email or password"); return; }
    router.push("/"); router.refresh();
  };
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md"><CardHeader><CardTitle className="text-2xl font-bold">Sign In</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><Input type="email" placeholder="Email" {...register("email")} disabled={isSubmitting} />{errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}</div>
            <div><Input type="password" placeholder="Password" {...register("password")} disabled={isSubmitting} />{errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}</div>
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign In"}</Button>
            <p className="text-center text-sm">Don&apos;t have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link></p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
