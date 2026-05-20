"use client";

import Image from "next/image";
import { formatIDR } from "@/lib/utils/format";
import type { CartItem } from "@/lib/types/common";

export interface CartItemRowProps {
  item: CartItem;
}

/**
 * Compact row for a cart item in the order summary.
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
