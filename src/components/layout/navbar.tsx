"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CartDropdown } from "@/components/cart/cart-dropdown";

export function Navbar() {
  const { data: session, status } = useSession();
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">MyShop</Link>
        <div className="flex items-center gap-4">
          <Link href="/products" className="text-sm hover:underline">Products</Link>
          <CartDropdown />
          {status === "loading" ? <span className="text-sm">...</span> : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex-col items-start">
                  <p className="font-medium">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/dashboard/user">My Orders</Link></DropdownMenuItem>
                {session.user?.role === "ADMIN" && <DropdownMenuItem asChild><Link href="/admin">Admin</Link></DropdownMenuItem>}
                <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Link href="/login"><Button variant="outline" size="sm">Sign In</Button></Link>
              <Link href="/register"><Button size="sm">Register</Button></Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
