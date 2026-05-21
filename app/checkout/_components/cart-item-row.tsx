"use client";

import Image from "next/image";
import { formatIDR } from "@/lib/utils/format";
import type { OrderItem } from "@/lib/types/checkout";

export interface CartItemRowProps {
  /**
   * Item baris ringkasan order. Menerima `OrderItem` agar komponen ini
   * reusable untuk dua sumber: keranjang (`cart-store`) maupun
   * `Topup_Denomination` terpilih di alur Topup. Kolom `productId` dari
   * `CartItem` tidak dirender, sehingga `OrderItem` cukup.
   */
  item: OrderItem;
}

/**
 * Baris compact item pesanan untuk dipakai di `Order_Summary_Card`.
 * Menampilkan thumbnail, judul, `qty × harga`, dan total baris.
 */
export function CartItemRow({ item }: CartItemRowProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Thumbnail */}
      <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border bg-bg-overlay">
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="grid size-full place-items-center text-xs text-fg-subtle">
            —
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-fg">{item.title}</p>
        <p className="text-xs text-fg-muted">
          {item.qty} × {formatIDR(item.price)}
        </p>
      </div>

      {/* Line total */}
      <p className="shrink-0 text-sm font-semibold tabular-nums text-fg">
        {formatIDR(item.price * item.qty)}
      </p>
    </div>
  );
}
