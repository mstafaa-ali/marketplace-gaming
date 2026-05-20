"use client";

import {
  CreditCard,
  Gamepad2,
  Home,
  Menu,
  ShoppingBag,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/products", label: "Semua Produk", icon: ShoppingBag },
  { href: "/products?category=topup", label: "Top Up", icon: Zap },
  { href: "/products?category=account", label: "Akun Game", icon: Sparkles },
  { href: "/products?category=voucher", label: "Voucher", icon: CreditCard },
] as const;

/**
 * Mobile navigation drawer. Visible only below `lg` breakpoint. Uses the
 * shared Sheet primitive (Radix Dialog) so focus trap, Escape, and overlay
 * dismiss work out of the box.
 *
 * Closes automatically on navigation via `pathname` change detection.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Buka menu navigasi"
        >
          <Menu className="size-5" aria-hidden strokeWidth={1.75} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-white shadow-glow">
              <Gamepad2 className="size-4" aria-hidden />
            </span>
            GameVault
          </SheetTitle>
        </SheetHeader>
        <SheetBody>
          <nav aria-label="Navigasi mobile" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href.split("?")[0]);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    "transition-colors duration-(--duration-base) ease-snappy",
                    isActive
                      ? "bg-violet-500/10 text-violet-200 border border-violet-500/30"
                      : "text-fg-muted hover:bg-bg-overlay hover:text-fg border border-transparent",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5 shrink-0",
                      isActive ? "text-violet-300" : "text-fg-subtle",
                    )}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-border pt-6">
            <Link
              href="#"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                "text-fg-muted transition-colors hover:bg-bg-overlay hover:text-fg",
              )}
            >
              <UserRound
                className="size-5 shrink-0 text-fg-subtle"
                strokeWidth={1.75}
                aria-hidden
              />
              Profil Saya
            </Link>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
