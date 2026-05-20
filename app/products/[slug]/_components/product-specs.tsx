import { CheckCircle2, ClipboardList, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types/product";

export interface ProductSpecsProps {
  product: Product;
}

/**
 * Product specifications section with three sub-sections:
 * Highlights, Spesifikasi (key-value), and Cara Pemesanan.
 */
export function ProductSpecs({ product }: ProductSpecsProps) {
  return (
    <div className="space-y-8">
      {/* Highlights */}
      {product.highlights.length > 0 && (
        <section className="space-y-3" aria-labelledby="section-highlights">
          <div className="flex items-center gap-2">
            <CheckCircle2
              className="size-5 text-violet-400"
              strokeWidth={1.75}
              aria-hidden
            />
            <h2
              id="section-highlights"
              className="font-display text-xl font-semibold tracking-tight"
            >
              Highlights
            </h2>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {product.highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-sm"
              >
                <span
                  className="size-1.5 shrink-0 rounded-full bg-violet-400"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Spesifikasi */}
      {Object.keys(product.specs).length > 0 && (
        <section className="space-y-3" aria-labelledby="section-specs">
          <div className="flex items-center gap-2">
            <ClipboardList
              className="size-5 text-violet-400"
              strokeWidth={1.75}
              aria-hidden
            />
            <h2
              id="section-specs"
              className="font-display text-xl font-semibold tracking-tight"
            >
              Spesifikasi
            </h2>
          </div>
          <dl className="overflow-hidden rounded-lg border border-border">
            {Object.entries(product.specs).map(([key, value], idx) => (
              <div
                key={key}
                className={`grid grid-cols-[140px_1fr] gap-x-4 px-4 py-2.5 text-sm sm:grid-cols-[180px_1fr] ${
                  idx % 2 === 0 ? "bg-bg-elevated" : "bg-bg-overlay/50"
                }`}
              >
                <dt className="font-medium text-fg-muted">{key}</dt>
                <dd className="text-fg">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Cara Pemesanan */}
      <section className="space-y-3" aria-labelledby="section-order-guide">
        <div className="flex items-center gap-2">
          <ShoppingBag
            className="size-5 text-violet-400"
            strokeWidth={1.75}
            aria-hidden
          />
          <h2
            id="section-order-guide"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Cara Pemesanan
          </h2>
        </div>
        <ol className="space-y-2 rounded-lg border border-border bg-bg-elevated p-4">
          {ORDER_STEPS.map((step, idx) => (
            <li key={idx} className="flex gap-3 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-semibold text-violet-300">
                {idx + 1}
              </span>
              <span className="text-fg-muted">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

const ORDER_STEPS = [
  'Klik tombol "Beli Sekarang" pada produk yang diinginkan.',
  "Lengkapi data yang diperlukan (ID akun / email tujuan).",
  "Pilih metode pembayaran dan selesaikan transaksi.",
  "Produk akan dikirim otomatis atau diproses oleh tim kami dalam 1–5 menit.",
  "Cek email atau akun kamu untuk konfirmasi. Hubungi support jika ada kendala.",
];
