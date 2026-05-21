"use client";

import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckoutStore } from "@/stores/checkout-store";
import { calculateOrderSummary } from "@/lib/utils/checkout";
import { formatIDR } from "@/lib/utils/format";
import type { OrderItem } from "@/lib/types/checkout";
import { CartItemRow } from "./cart-item-row";

export interface OrderSummaryCardProps {
  /**
   * Daftar item baris yang ditampilkan di ringkasan. Disuplai oleh
   * pemanggil agar `Order_Summary_Card` agnostic terhadap sumber data
   * (`cart-store` di mode cart, atau `Topup_Denomination` terpilih di
   * mode topup). REQ-4.9: di mode topup, `cart-store` TIDAK boleh
   * dibaca dari komponen ini.
   */
  items: OrderItem[];
  /** Handler tombol "Bayar Sekarang". */
  onSubmit: () => void;
  /**
   * Tombol "Bayar Sekarang" dinonaktifkan saat `disabled === true`
   * ATAU `isProcessing` aktif. Pemanggil bertanggung jawab menggabungkan
   * sub-kondisi (denominasi terpilih, customer info valid, payment dipilih)
   * sesuai REQ-4.5.
   */
  disabled: boolean;
  /**
   * Label kosong opsional saat `items.length === 0`. Berguna di alur
   * Topup ketika denominasi belum dipilih: ringkasan tetap dirender,
   * namun memberi petunjuk visual.
   */
  emptyText?: string;
}

/**
 * Sticky `Order_Summary_Card` sidebar — menampilkan daftar item, subtotal,
 * diskon voucher, total, serta tombol submit pembayaran.
 */
export function OrderSummaryCard({
  items,
  onSubmit,
  disabled,
  emptyText,
}: OrderSummaryCardProps) {
  const voucher = useCheckoutStore((s) => s.voucher);
  const isProcessing = useCheckoutStore((s) => s.isProcessing);

  const { subtotal, voucherDiscount, total } = calculateOrderSummary(
    items,
    voucher?.valid ? voucher.discountPercent : undefined,
  );

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="space-y-4 rounded-xl border border-border bg-bg-elevated p-5">
        <h2 className="text-base font-semibold text-fg">Ringkasan Pesanan</h2>

        {/* Item list (atau placeholder saat kosong di mode topup pre-select) */}
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border-strong bg-bg-overlay/40 px-3 py-4 text-center text-xs text-fg-muted">
            {emptyText ?? "Belum ada item dipilih."}
          </p>
        )}

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
