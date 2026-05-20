"use client";

import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { calculateOrderSummary } from "@/lib/utils/checkout";
import { formatIDR } from "@/lib/utils/format";
import { CartItemRow } from "./cart-item-row";

export interface OrderSummaryCardProps {
  onSubmit: () => void;
  disabled: boolean;
}

/**
 * Sticky order summary sidebar showing cart items, totals, and submit button.
 */
export function OrderSummaryCard({
  onSubmit,
  disabled,
}: OrderSummaryCardProps) {
  const items = useCartStore((s) => s.items);
  const voucher = useCheckoutStore((s) => s.voucher);
  const isProcessing = useCheckoutStore((s) => s.isProcessing);

  const orderItems = items.map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price,
    qty: item.qty,
    thumbnailUrl: item.thumbnailUrl,
  }));

  const { subtotal, voucherDiscount, total } = calculateOrderSummary(
    orderItems,
    voucher?.valid ? voucher.discountPercent : undefined,
  );

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="space-y-4 rounded-xl border border-border bg-bg-elevated p-5">
        <h2 className="text-base font-semibold text-fg">Ringkasan Pesanan</h2>

        {/* Item list */}
        <div className="space-y-3">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t border-border pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-fg-muted">Subtotal</span>
            <span className="tabular-nums text-fg">{formatIDR(subtotal)}</span>
          </div>

          {voucherDiscount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-success">Diskon Voucher</span>
              <span className="tabular-nums text-success">
                −{formatIDR(voucherDiscount)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border pt-2">
            <span className="font-semibold text-fg">Total</span>
            <span className="text-lg font-bold tabular-nums text-fg">
              {formatIDR(total)}
            </span>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full"
          onClick={onSubmit}
          disabled={disabled || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Memproses...
            </>
          ) : (
            "Bayar Sekarang"
          )}
        </Button>

        {/* Trust signal */}
        <div className="flex items-center gap-2 text-xs text-fg-muted">
          <ShieldCheck
            className="size-4 text-success"
            strokeWidth={1.75}
            aria-hidden
          />
          <span>Transaksi aman · Data terenkripsi</span>
        </div>
      </div>
    </aside>
  );
}
