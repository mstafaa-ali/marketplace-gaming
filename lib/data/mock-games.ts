import "server-only";
import type { Game } from "@/lib/types/game";

export const MOCK_GAMES: Game[] = [
  {
    slug: "mobile-legends",
    name: "Mobile Legends",
    publisher: "Moonton",
    icon: "Swords",
    accent: "from-violet-700 to-violet-500",
    productCount: 142,
  },
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    publisher: "Tencent",
    icon: "Crosshair",
    accent: "from-amber-500 to-violet-600",
    productCount: 96,
  },
  {
    slug: "valorant",
    name: "Valorant",
    publisher: "Riot Games",
    icon: "Target",
    accent: "from-rose-500 to-violet-700",
    productCount: 78,
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    publisher: "HoYoverse",
    icon: "Sparkles",
    accent: "from-cyan-400 to-violet-600",
    productCount: 64,
  },
  {
    slug: "free-fire",
    name: "Free Fire",
    publisher: "Garena",
    icon: "Flame",
    accent: "from-orange-500 to-violet-600",
    productCount: 51,
  },
  {
    slug: "honkai-star-rail",
    name: "Honkai Star Rail",
    publisher: "HoYoverse",
    icon: "Star",
    accent: "from-fuchsia-500 to-violet-700",
    productCount: 38,
  },
];
