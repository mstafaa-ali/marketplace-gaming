"use client";

import { Minus, Plus, ShieldCheck, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { DiscountBadge } from "@/components/common/discount-badge";
import { PriceTag } from "@/components/common/price-tag";
import { StockBadge } from "@/components/common/stock-badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/lib/types/product";

export interface ProductBuyCardProps {
  product: Product;
}

/**
 * Sticky buy card for the product detail page. Handles quantity selection
 * and add-to-cart via Zustand. Disabled when product is sold out.
 */
export function ProductBuyCard({ product }: ProductBuyCardProps) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((s) => s.add);

  const isSoldOut = product.stockStatus === "sold_out";
  const discount = product.price.discountPercent ?? 0;

  function handleAdd() {
    addToCart({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price.amount,
      qty,
      thumbnailUrl: product.coverImage.url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="space-y-5 rounded-xl border border-border bg-bg-elevated p-5">
        {/* Game name + title */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
            {product.gameName}
          </p>
          <h1 className="font-display text-lg font-semibold leading-snug tracking-tight sm:text-xl">
            {product.title}
          </h1>
          <p className="text-sm text-fg-muted">{product.shortDescription}</p>
        </div>

        {/* Price + discount */}
        <div className="space-y-2">
          <PriceTag
            amount={product.price.amount}
            originalAmount={product.price.originalAmount}
            size="lg"
          />
          {discount > 0 && <DiscountBadge percent={discount} withIcon />}
        </div>

        {/* Stock status */}
        <StockBadge status={product.stockStatus} />

        {/* Quantity selector */}
        {!isSoldOut && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-fg-muted">Jumlah</span>
            <div className="inline-flex items-center rounded-md border border-border">
              <button
                type="button"
                aria-label="Kurangi jumlah"
                disabled={qty <= 1}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-9 place-items-center text-fg-muted transition-colors hover:text-fg disabled:opacity-40"
              >
                <Minus className="size-4" strokeWidth={2} aria-hidden />
              </button>
              <span
                className="min-w-[2.5rem] text-center text-sm font-semibold tabular-nums text-fg"
                aria-live="polite"
                aria-atomic="true"
              >
                {qty}
              </span>
              <button
                type="button"
                aria-label="Tambah jumlah"
                onClick={() => setQty((q) => q + 1)}
                className="grid size-9 place-items-center text-fg-muted transition-colors hover:text-fg"
              >
                <Plus className="size-4" strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        )}

        {/* CTA */}
        <Button
          variant="primary"
          size="lg"
          disabled={isSoldOut}
          onClick={handleAdd}
          className="w-full"
        >
          {isSoldOut ? (
            "Sold Out"
          ) : added ? (
            <>
              <ShoppingCart className="size-4" aria-hidden />
              Ditambahkan!
            </>
          ) : (
            <>
              <ShoppingCart className="size-4" aria-hidden />
              Beli Sekarang
            </>
          )}
        </Button>

        {/* Trust signals */}
        <div className="space-y-2 border-t border-border pt-4">
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <ShieldCheck
              className="size-4 text-success"
              strokeWidth={1.75}
              aria-hidden
            />
            <span>100% Anti-Minus · Garansi Keamanan Akun</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <ShieldCheck
              className="size-4 text-success"
              strokeWidth={1.75}
              aria-hidden
            />
            <span>Proses cepat 1–5 menit · Support 24 jam</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
