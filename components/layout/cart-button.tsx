"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useHydrated } from "@/hooks/use-hydrated";
import { selectCartCount, useCartStore } from "@/stores/cart-store";
import { formatIDR } from "@/lib/utils/format";
import type { CartItem } from "@/lib/types/common";

/**
 * Cart launcher in the site header. Renders an icon button with a count badge
 * and opens a Sheet drawer (right side) containing the cart contents.
 *
 * The drawer subscribes to the cart store directly, so quantity edits and
 * removals update both the badge and the line items in real time.
 */
export function CartButton() {
  const count = useCartStore(selectCartCount);
  const hydrated = useHydrated();
  const visibleCount = hydrated ? count : 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label={`Buka keranjang (${visibleCount} item)`}
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
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md">
        <CartDrawerContent />
      </SheetContent>
    </Sheet>
  );
}

/**
 * Drawer body. Pulled into its own component so the Sheet is mounted/unmounted
 * cleanly (no work happens until the user opens the drawer).
 */
function CartDrawerContent() {
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const hydrated = useHydrated();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  // Treat as empty until hydrated so the SSR/CSR render matches.
  const isEmpty = !hydrated || items.length === 0;

  return (
    <>
      <SheetHeader className="pr-12">
        <SheetTitle>Keranjang</SheetTitle>
        {hydrated && items.length > 0 ? (
          <p className="text-sm text-fg-muted">
            {items.length} produk · {totalQty} item
          </p>
        ) : null}
      </SheetHeader>

      {isEmpty ? (
        <SheetBody className="grid place-items-center">
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-bg-overlay text-fg-subtle">
              <ShoppingBag className="size-6" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-fg">Keranjang masih kosong</p>
              <p className="text-sm text-fg-muted">
                Yuk pilih produk favoritmu dulu.
              </p>
            </div>
            <SheetClose asChild>
              <Button asChild variant="primary" size="md" className="mt-2">
                <Link href="/products">Jelajahi Produk</Link>
              </Button>
            </SheetClose>
          </div>
        </SheetBody>
      ) : (
        <>
          <SheetBody className="space-y-3">
            {items.map((item) => (
              <CartDrawerRow
                key={item.id}
                item={item}
                onIncrement={() => setQty(item.id, item.qty + 1)}
                onDecrement={() => setQty(item.id, Math.max(0, item.qty - 1))}
                onRemove={() => remove(item.id)}
              />
            ))}

            <button
              type="button"
              onClick={clear}
              className="text-xs font-medium text-fg-muted underline-offset-4 transition-colors hover:text-danger hover:underline focus-visible:text-danger focus-visible:underline"
            >
              Kosongkan keranjang
            </button>
          </SheetBody>

          <SheetFooter className="flex-col gap-3 sm:flex-col sm:items-stretch">
            <div className="flex items-center justify-between">
              <span className="text-sm text-fg-muted">Subtotal</span>
              <span className="text-base font-bold tabular-nums text-fg">
                {formatIDR(subtotal)}
              </span>
            </div>
            <SheetClose asChild>
              <Button asChild variant="primary" size="lg" className="w-full">
                <Link href="/checkout">Checkout Sekarang</Link>
              </Button>
            </SheetClose>
            <p className="text-center text-xs text-fg-subtle">
              Pajak dan biaya dihitung di halaman checkout.
            </p>
          </SheetFooter>
        </>
      )}
    </>
  );
}

interface CartDrawerRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

function CartDrawerRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartDrawerRowProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-bg-overlay/50 p-3">
      {/* Thumbnail */}
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-bg-overlay">
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="grid size-full place-items-center text-xs text-fg-subtle">
            —
          </div>
        )}
      </div>

      {/* Info + controls */}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium text-fg">
            {item.title}
          </p>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Hapus ${item.title} dari keranjang`}
            className="grid size-7 shrink-0 place-items-center rounded-full text-fg-subtle transition-colors hover:bg-bg-overlay hover:text-danger focus-visible:outline-2 focus-visible:outline-violet-400 focus-visible:outline-offset-2"
          >
            <Trash2 className="size-3.5" aria-hidden />
          </button>
        </div>

        <p className="text-sm font-semibold tabular-nums text-fg">
          {formatIDR(item.price * item.qty)}
        </p>

        {/* Qty stepper */}
        <div className="inline-flex items-center rounded-md border border-border">
          <button
            type="button"
            aria-label="Kurangi jumlah"
            onClick={onDecrement}
            className="grid size-8 place-items-center text-fg-muted transition-colors hover:text-fg disabled:opacity-40"
          >
            <Minus className="size-3.5" strokeWidth={2} aria-hidden />
          </button>
          <span
            className="min-w-8 text-center text-xs font-semibold tabular-nums text-fg"
            aria-live="polite"
            aria-atomic="true"
          >
            {item.qty}
          </span>
          <button
            type="button"
            aria-label="Tambah jumlah"
            onClick={onIncrement}
            className="grid size-8 place-items-center text-fg-muted transition-colors hover:text-fg"
          >
            <Plus className="size-3.5" strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
