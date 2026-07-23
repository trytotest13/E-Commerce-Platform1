"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { updateOrderStatus } from "@/actions/admin";
import type { OrderStatus } from "@prisma/client";

const transitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

export function UpdateOrderStatus({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const [loading, setLoading] = useState(false);
  const available = transitions[currentStatus] || [];
  if (available.length === 0) return <Button disabled variant="outline">No actions available</Button>;
  const handle = async (status: string) => {
    setLoading(true);
    try { await updateOrderStatus(orderId, status); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button disabled={loading}>{loading ? "Updating..." : "Update Status"}</Button></DropdownMenuTrigger>
      <DropdownMenuContent>{available.map(status => <DropdownMenuItem key={status} onClick={() => handle(status)}>Mark as {status}</DropdownMenuItem>)}</DropdownMenuContent>
    </DropdownMenu>
  );
}
