import "server-only";
import type { Game } from "@/lib/types/game";

export const MOCK_GAMES: Game[] = [
  {
    slug: "mobile-legends",
    name: "Mobile Legends",
    publisher: "Moonton",
    icon: "Swords",
    accent: "from-violet-700 to-violet-500",
    image: "/image/mobile legend.jpg",
    productCount: 142,
  },
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    publisher: "Tencent",
    icon: "Crosshair",
    accent: "from-amber-500 to-violet-600",
    image: "/image/pubg logo.png",
    productCount: 96,
  },
  {
    slug: "valorant",
    name: "Valorant",
    publisher: "Riot Games",
    icon: "Target",
    accent: "from-rose-500 to-violet-700",
    image: "/image/valorant logo.jpg",
    productCount: 78,
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    publisher: "HoYoverse",
    icon: "Sparkles",
    accent: "from-cyan-400 to-violet-600",
    image: "/image/genshin-logo.jpeg",
    productCount: 64,
  },
  {
    slug: "free-fire",
    name: "Free Fire",
    publisher: "Garena",
    icon: "Flame",
    accent: "from-orange-500 to-violet-600",
    image: "/image/freefire-logo.png",
    productCount: 51,
  },
  {
    slug: "honkai-star-rail",
    name: "Honkai Star Rail",
    publisher: "HoYoverse",
    icon: "Star",
    accent: "from-fuchsia-500 to-violet-700",
    image: "/image/honkai-logo.png",
    productCount: 38,
  },
];
