import "server-only";
import type { Platform } from "@/lib/types/platform";

/**
 * Katalog mock `Platform` untuk alur two-step browse kategori `voucher`.
 *
 * Kontrak:
 * - `slug` unik & kebab-case (REQ-5.1).
 * - `icon` adalah nama ikon Lucide React valid (PascalCase). Steam dan Xbox
 *   tidak punya ikon brand di Lucide → fallback ke `Gamepad2`. Mapping ke
 *   komponen ikon konkret dilakukan di `Platform_Card` (Fase D).
 * - `accent` mengikuti pola gradient di `mock-games.ts` agar visual
 *   `Platform_Card` konsisten dengan `Game_Card`.
 * - `productCount` selalu `0` di sumber mock; nilai aktual di-compute oleh
 *   `getPlatforms()` di `lib/data/platforms.ts` lewat
 *   `groupPlatformsForVouchers` (REQ-5.4).
 */
export const MOCK_PLATFORMS: Platform[] = [
  {
    slug: "steam",
    name: "Steam",
    icon: "Gamepad2",
    accent: "from-blue-600 to-violet-700",
    image: "/image/steam logo.jpg",
    productCount: 0,
  },
  {
    slug: "google-play",
    name: "Google Play",
    icon: "Smartphone",
    accent: "from-emerald-500 to-violet-600",
    image: "/image/play-store-logo.jpg",
    productCount: 0,
  },
  {
    slug: "playstation-store",
    name: "PlayStation Store",
    icon: "Gamepad",
    accent: "from-sky-500 to-violet-700",
    image: "/image/playstation logo.jpg",
    productCount: 0,
  },
  {
    slug: "app-store",
    name: "App Store",
    icon: "Apple",
    accent: "from-slate-400 to-violet-600",
    image: "/image/app store logo.png",
    productCount: 0,
  },
  {
    slug: "xbox",
    name: "Xbox",
    icon: "Gamepad2",
    accent: "from-green-500 to-violet-700",
    image: "/image/xbox logo.png",
    productCount: 0,
  },
];
