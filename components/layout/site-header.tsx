import { UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/layout/cart-button";
import { GlobalSearch } from "@/components/layout/global-search";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/common/theme-toggle";

const NAV_LINKS = [
  { href: "/products", label: "Semua Produk" },
  { href: "/products?category=topup", label: "Top Up" },
  { href: "/products?category=account", label: "Akun" },
  { href: "/products?category=voucher", label: "Voucher" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur supports-backdrop-filter:bg-bg/60">
      <div className="container-page flex h-16 items-center gap-4">
        <MobileNav />

        <Link
          href="/"
          className="flex items-center text-fg transition-opacity hover:opacity-90"
          aria-label="LootBox — beranda"
        >
          {/* Logo kecil (icon) untuk mobile */}
          <Image
            src="/image/logo/lootbox-logo.png"
            alt="LootBox logo"
            width={44}
            height={44}
            className="size-20 object-contain sm:hidden"
            priority
          />
          {/* Logo full untuk desktop */}
          <Image
            src="/image/logo/lootbox-logo-new.png"
            alt="LootBox logo"
            width={160}
            height={160}
            className="hidden h-20 w-auto object-contain sm:block"
            priority
          />
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-1 text-sm text-fg-muted lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 transition-colors hover:bg-bg-overlay hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <GlobalSearch className="hidden md:flex md:max-w-sm" />
          <ThemeToggle />
          <CartButton />
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Profil"
          >
            <UserRound className="size-5" aria-hidden />
          </Button>
        </div>
      </div>

      {/* Mobile search row */}
      <div className="container-page pb-3 md:hidden">
        <GlobalSearch />
      </div>
    </header>
  );
}
