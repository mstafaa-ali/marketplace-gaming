import "server-only";

/**
 * Definisi satu opsi filter untuk game tertentu.
 */
export interface GameFilterOption {
  value: string;
  label: string;
}

/**
 * Definisi satu filter field untuk game tertentu.
 */
export interface GameFilterDefinition {
  /** Key unik filter, dipakai sebagai URL param (mis. `rank`, `ar`). */
  key: string;
  /** Label display di UI (mis. "Rank", "Adventure Rank"). */
  label: string;
  /** Tipe filter: `select` = pilih satu, `multi` = pilih banyak. */
  type: "select" | "multi";
  /** Opsi yang tersedia untuk filter ini. */
  options: GameFilterOption[];
}

/**
 * Map `gameSlug` → daftar filter spesifik game tersebut.
 *
 * Setiap game punya filter yang berbeda sesuai karakteristik produk akun-nya:
 * - Genshin Impact: AR (Adventure Rank), Character (Archon yang dimiliki)
 * - Valorant: Skin (bundle skin), Rank
 * - PUBG Mobile: Skin (skin senjata mythic), Rank
 * - Mobile Legends: Rank, Skin count range
 * - Free Fire: Rank, Bundle
 * - Honkai Star Rail: Trailblaze Level, Character
 */
export const GAME_FILTER_MAP: Record<string, GameFilterDefinition[]> = {
  "genshin-impact": [
    {
      key: "ar",
      label: "Adventure Rank",
      type: "select",
      options: [
        { value: "ar-50-55", label: "AR 50–55" },
        { value: "ar-56-59", label: "AR 56–59" },
        { value: "ar-60", label: "AR 60" },
      ],
    },
    {
      key: "character",
      label: "Character Archon",
      type: "multi",
      options: [
        { value: "zhongli", label: "Zhongli" },
        { value: "venti", label: "Venti" },
        { value: "raiden", label: "Raiden Shogun" },
        { value: "nahida", label: "Nahida" },
        { value: "furina", label: "Furina" },
        { value: "mavuika", label: "Mavuika" },
      ],
    },
  ],
  valorant: [
    {
      key: "skin",
      label: "Skin Bundle",
      type: "multi",
      options: [
        { value: "reaver", label: "Reaver" },
        { value: "champions", label: "Champions" },
        { value: "glitchpop", label: "Glitchpop" },
        { value: "sentinels-of-light", label: "Sentinels of Light" },
        { value: "prime", label: "Prime" },
        { value: "elderflame", label: "Elderflame" },
      ],
    },
    {
      key: "rank",
      label: "Rank",
      type: "select",
      options: [
        { value: "iron-silver", label: "Iron – Silver" },
        { value: "gold-platinum", label: "Gold – Platinum" },
        { value: "diamond", label: "Diamond" },
        { value: "ascendant", label: "Ascendant" },
        { value: "immortal", label: "Immortal" },
        { value: "radiant", label: "Radiant" },
      ],
    },
  ],
  "pubg-mobile": [
    {
      key: "skin",
      label: "Skin Senjata",
      type: "multi",
      options: [
        { value: "m416-glacier", label: "M416 Glacier" },
        { value: "akm-glacier", label: "AKM Glacier" },
        { value: "awm-glacier", label: "AWM Glacier" },
        { value: "kar98-glacier", label: "Kar98 Glacier" },
        { value: "dp28-glacier", label: "DP-28 Glacier" },
      ],
    },
    {
      key: "rank",
      label: "Rank",
      type: "select",
      options: [
        { value: "platinum-diamond", label: "Platinum – Diamond" },
        { value: "crown", label: "Crown" },
        { value: "ace", label: "Ace" },
        { value: "ace-master", label: "Ace Master" },
        { value: "ace-dominator", label: "Ace Dominator" },
        { value: "conqueror", label: "Conqueror" },
      ],
    },
  ],
  "mobile-legends": [
    {
      key: "rank",
      label: "Rank",
      type: "select",
      options: [
        { value: "epic", label: "Epic" },
        { value: "legend", label: "Legend" },
        { value: "mythic", label: "Mythic" },
        { value: "mythic-honor", label: "Mythic Honor" },
        { value: "mythic-glory", label: "Mythic Glory" },
        { value: "immortal", label: "Immortal" },
      ],
    },
    {
      key: "skin-count",
      label: "Jumlah Skin",
      type: "select",
      options: [
        { value: "0-100", label: "0–100 skin" },
        { value: "101-500", label: "101–500 skin" },
        { value: "501-1000", label: "501–1000 skin" },
        { value: "1001+", label: "1001+ skin" },
      ],
    },
  ],
  "free-fire": [
    {
      key: "rank",
      label: "Rank",
      type: "select",
      options: [
        { value: "gold-platinum", label: "Gold – Platinum" },
        { value: "diamond", label: "Diamond" },
        { value: "heroic", label: "Heroic" },
        { value: "grandmaster", label: "Grandmaster" },
      ],
    },
    {
      key: "bundle",
      label: "Bundle",
      type: "multi",
      options: [
        { value: "criminal", label: "Criminal Bundle" },
        { value: "hip-hop", label: "Hip Hop Bundle" },
        { value: "sakura", label: "Sakura Bundle" },
        { value: "night-clown", label: "Night Clown" },
      ],
    },
  ],
  "honkai-star-rail": [
    {
      key: "tl",
      label: "Trailblaze Level",
      type: "select",
      options: [
        { value: "tl-50-59", label: "TL 50–59" },
        { value: "tl-60-69", label: "TL 60–69" },
        { value: "tl-70", label: "TL 70" },
      ],
    },
    {
      key: "character",
      label: "Character",
      type: "multi",
      options: [
        { value: "kafka", label: "Kafka" },
        { value: "jingliu", label: "Jingliu" },
        { value: "fu-xuan", label: "Fu Xuan" },
        { value: "robin", label: "Robin" },
        { value: "firefly", label: "Firefly" },
      ],
    },
  ],
};

/**
 * Ambil definisi filter untuk game tertentu. Mengembalikan array kosong
 * jika game tidak punya filter khusus.
 */
export function getGameFilters(gameSlug: string): GameFilterDefinition[] {
  return GAME_FILTER_MAP[gameSlug] ?? [];
}
