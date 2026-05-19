import { Gamepad2 } from "lucide-react";
import Link from "next/link";

const COLUMNS = [
  {
    title: "Kategori",
    links: [
      { href: "/products?category=topup", label: "Top Up" },
      { href: "/products?category=account", label: "Akun Game" },
      { href: "/products?category=voucher", label: "Voucher" },
      { href: "/products", label: "Semua Produk" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { href: "#faq", label: "FAQ" },
      { href: "/cara-pesan", label: "Cara Pesan" },
      { href: "/garansi", label: "Garansi" },
      { href: "/kontak", label: "Kontak" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
      { href: "/privasi", label: "Kebijakan Privasi" },
      { href: "/refund", label: "Kebijakan Refund" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-bg-elevated">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="GameVault — beranda"
          >
            <span className="grid size-9 place-items-center rounded-md bg-primary text-white shadow-glow">
              <Gamepad2 className="size-5" aria-hidden />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              GameVault
            </span>
          </Link>
          <p className="max-w-xs text-sm text-fg-muted">
            Marketplace digital untuk top up, voucher, dan akun game premium
            dengan garansi 100% anti-minus.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              {column.title}
            </h2>
            <ul className="space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-fg-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-5 text-xs text-fg-subtle md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} GameVault. Semua hak cipta dilindungi.
          </p>
          <p>Made with care for Indonesian gamers.</p>
        </div>
      </div>
    </footer>
  );
}
