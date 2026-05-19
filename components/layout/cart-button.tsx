"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { selectCartCount, useCartStore } from "@/stores/cart-store";

export function CartButton() {
  const count = useCartStore(selectCartCount);
  const hydrated = useHydrated();
  const visibleCount = hydrated ? count : 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full"
      aria-label={`Keranjang (${visibleCount} item)`}
    >
      <ShoppingBag className="size-5" aria-hidden />
      {visibleCount > 0 ? (
        <span
          className="absolute -right-0.5 -top-0.5 grid min-h-4.5 min-w-4.5 place-items-center rounded-full bg-accent-pink px-1 text-[10px] font-semibold leading-none text-white"
          aria-hidden
        >
          {visibleCount > 99 ? "99+" : visibleCount}
        </span>
      ) : null}
    </Button>
  );
}
