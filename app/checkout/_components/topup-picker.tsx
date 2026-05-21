"use client";

import { PackageSearch } from "lucide-react";
import Link from "next/link";

import { PriceTag } from "@/components/common/price-tag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { Game } from "@/lib/types/game";
import type { Product } from "@/lib/types/product";

export interface TopupPickerProps {
  /** `Game` yang sedang dibeli; dipakai di legend & empty state. */
  game: Game;
  /** Daftar `Topup_Denomination` (Product kategori `topup`) untuk `game`. */
  denominations: Product[];
  /** `productId` denominasi terpilih, atau `null` saat belum ada pilihan. */
  selectedId: string | null;
  /** Callback saat pengguna memilih satu denominasi. */
  onSelect: (productId: string) => void;
}

/**
 * `TopupPicker` — section pemilihan paket top up untuk satu `Game` di
 * `Checkout_Page` saat alur Topup aktif (`?category=topup&game=…`).
 *
 * Dirender sebagai radio group HTML native (`<fieldset>` + `<legend>` +
 * `<input type="radio">`) sehingga aksesibilitas keyboard berjalan otomatis:
 * Tab masuk/keluar grup, panah & `Space` untuk memilih item. Visual tiap
 * kartu mengikuti pola `payment-method-section.tsx` (radio indicator + body).
 *
 * @see Requirements 4.2, 4.3, 4.8
 */
export function TopupPicker({
  game,
  denominations,
  selectedId,
  onSelect,
}: TopupPickerProps) {
  // Empty state: tidak ada denominasi tersedia untuk `game` saat ini.
  if (denominations.length === 0) {
    return (
      <div
        role="status"
        className="grid place-items-center rounded-2xl border border-dashed border-border-strong bg-bg-elevated/60 px-6 py-16 text-center"
      >
        <div className="mx-auto max-w-md space-y-4">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-violet-500/10 text-violet-300">
            <PackageSearch className="size-7" strokeWidth={1.75} aria-hidden />
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-fg">
            Belum ada paket topup untuk {game.name}
          </h2>
          <p className="text-sm text-fg-muted">
            Coba pilih game lain atau cek lagi nanti — paket baru biasanya hadir
            beberapa hari sekali.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Button asChild variant="primary" size="md">
              <Link href="/products/topup">Kembali ke daftar Top Up</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <fieldset className="space-y-4 rounded-xl border border-border bg-bg-elevated p-5">
      <legend className="px-1 text-base font-semibold text-fg">
        Pilih paket top up untuk {game.name}{" "}
        <span className="text-danger" aria-hidden>
          *
        </span>
      </legend>

      <div className="grid gap-2 sm:grid-cols-2">
        {denominations.map((product) => {
          const isSelected = selectedId === product.id;
          const highlight = product.highlights[0];

          return (
            <label
              key={product.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors duration-(--duration-base)",
                isSelected
                  ? "border-violet-400 bg-violet-500/10 ring-1 ring-violet-400"
                  : "border-border hover:border-border-strong hover:bg-bg-overlay",
              )}
            >
              <input
                type="radio"
                name="topup-denomination"
                value={product.id}
                checked={isSelected}
                onChange={() => onSelect(product.id)}
                className="sr-only"
              />
              {/* Visual radio indicator (native input di-`sr-only`-kan). */}
              <span
                className={cn(
                  "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border-2 transition-colors",
                  isSelected ? "border-violet-400" : "border-fg-subtle",
                )}
                aria-hidden
              >
                {isSelected ? (
                  <span className="size-2 rounded-full bg-violet-400" />
                ) : null}
              </span>

              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="text-sm font-medium text-fg">{product.title}</p>
                <PriceTag
                  amount={product.price.amount}
                  originalAmount={product.price.originalAmount}
                  size="sm"
                />
                {highlight ? (
                  <p className="text-xs text-fg-muted">{highlight}</p>
                ) : null}
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
