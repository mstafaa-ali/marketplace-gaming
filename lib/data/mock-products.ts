import "server-only";
import type { Product } from "@/lib/types/product";

const placeholder = (
  title: string,
  w = 800,
  h = 600,
): Product["coverImage"] => ({
  url: `https://placehold.co/${w}x${h}/170733/F5F1FF?text=${encodeURIComponent(title)}`,
  alt: title,
  width: w,
  height: h,
});

/**
 * Spec ringkas tiap denominasi topup. Disusun di sini supaya catalog mudah
 * diaudit per `Game` (lihat `Topup_Picker` di
 * `app/checkout/_components/topup-picker.tsx`).
 *
 * Field:
 * - `idSuffix` : suffix untuk membentuk `Product.id` (`t-${gameSlug}-${idSuffix}`).
 * - `nominal`  : angka denominasi (mis. 86 untuk 86 Diamond).
 * - `unit`     : satuan tampilan (Diamond, UC, VP, dll.). Disimpan di level
 *                spec game, bukan per-tier, agar konsisten antar tier.
 * - `price`    : harga IDR final (sudah memperhitungkan diskon kalau ada).
 * - `bonus`    : nominal tambahan opsional (mis. ML "1000 + 25 bonus").
 * - `originalPrice` & `discountPercent` : opsional saat ada promo.
 * - `processMinutes` : range proses, default `1-3` menit kalau tidak ada.
 */
type TopupTier = {
  idSuffix: string;
  nominal: number;
  price: number;
  bonus?: number;
  originalPrice?: number;
  discountPercent?: number;
  processMinutes?: string;
};

type TopupSpec = {
  gameSlug: string;
  gameName: string;
  publisher: string;
  /** Satuan denominasi (mis. "Diamond", "UC", "VP"). */
  unit: string;
  /** Sumber resmi untuk highlight (mis. "Moonton", "Tencent"). */
  source: string;
  /** Format nominal saat angka besar (mis. "1K", "10K"). Default toLocaleString. */
  formatNominal?: (n: number) => string;
  tiers: TopupTier[];
};

const TOPUP_SPECS: TopupSpec[] = [
  {
    gameSlug: "mobile-legends",
    gameName: "Mobile Legends",
    publisher: "Moonton",
    unit: "Diamond",
    source: "Resmi Moonton",
    tiers: [
      { idSuffix: "86", nominal: 86, price: 22_000 },
      { idSuffix: "172", nominal: 172, price: 44_000 },
      { idSuffix: "257", nominal: 257, price: 65_000 },
      { idSuffix: "344", nominal: 344, price: 87_000 },
      { idSuffix: "429", nominal: 429, price: 109_000 },
      { idSuffix: "514", nominal: 514, price: 129_000 },
      { idSuffix: "706", nominal: 706, price: 175_000 },
      { idSuffix: "1050", nominal: 1050, price: 245_000, bonus: 25 },
      { idSuffix: "2195", nominal: 2195, price: 495_000, bonus: 75 },
      {
        idSuffix: "5532",
        nominal: 5532,
        price: 1_249_000,
        bonus: 240,
        originalPrice: 1_299_000,
        discountPercent: 4,
      },
    ],
  },
  {
    gameSlug: "pubg-mobile",
    gameName: "PUBG Mobile",
    publisher: "Tencent",
    unit: "UC",
    source: "Resmi Tencent",
    tiers: [
      { idSuffix: "60", nominal: 60, price: 16_000 },
      { idSuffix: "325", nominal: 325, price: 79_000 },
      { idSuffix: "660", nominal: 660, price: 159_000 },
      { idSuffix: "1800", nominal: 1800, price: 399_000 },
      { idSuffix: "3850", nominal: 3850, price: 829_000 },
      { idSuffix: "8100", nominal: 8100, price: 1_629_000 },
    ],
  },
  {
    gameSlug: "valorant",
    gameName: "Valorant",
    publisher: "Riot Games",
    unit: "VP",
    source: "Resmi Riot",
    tiers: [
      { idSuffix: "125", nominal: 125, price: 19_000 },
      { idSuffix: "420", nominal: 420, price: 65_000 },
      { idSuffix: "700", nominal: 700, price: 105_000 },
      { idSuffix: "1000", nominal: 1000, price: 145_000 },
      { idSuffix: "1375", nominal: 1375, price: 199_000 },
      { idSuffix: "2400", nominal: 2400, price: 339_000 },
      { idSuffix: "4000", nominal: 4000, price: 555_000 },
      { idSuffix: "8150", nominal: 8150, price: 1_099_000 },
    ],
  },
  {
    gameSlug: "genshin-impact",
    gameName: "Genshin Impact",
    publisher: "HoYoverse",
    unit: "Genesis Crystal",
    source: "Resmi HoYoverse",
    tiers: [
      { idSuffix: "60", nominal: 60, price: 16_000 },
      { idSuffix: "300", nominal: 300, price: 79_000, bonus: 30 },
      { idSuffix: "980", nominal: 980, price: 245_000, bonus: 110 },
      { idSuffix: "1980", nominal: 1980, price: 479_000, bonus: 260 },
      {
        idSuffix: "3280",
        nominal: 3280,
        price: 825_000,
        bonus: 600,
        originalPrice: 879_000,
        discountPercent: 6,
      },
      { idSuffix: "6480", nominal: 6480, price: 1_625_000, bonus: 1600 },
    ],
  },
  {
    gameSlug: "free-fire",
    gameName: "Free Fire",
    publisher: "Garena",
    unit: "Diamond",
    source: "Resmi Garena",
    tiers: [
      { idSuffix: "50", nominal: 50, price: 7_500 },
      { idSuffix: "100", nominal: 100, price: 14_500 },
      { idSuffix: "310", nominal: 310, price: 44_000 },
      { idSuffix: "520", nominal: 520, price: 72_000 },
      { idSuffix: "1060", nominal: 1060, price: 145_000 },
      { idSuffix: "2180", nominal: 2180, price: 299_000 },
      { idSuffix: "5600", nominal: 5600, price: 749_000 },
    ],
  },
  {
    gameSlug: "honkai-star-rail",
    gameName: "Honkai Star Rail",
    publisher: "HoYoverse",
    unit: "Oneiric Shard",
    source: "Resmi HoYoverse",
    tiers: [
      { idSuffix: "60", nominal: 60, price: 16_000 },
      { idSuffix: "300", nominal: 300, price: 79_000, bonus: 30 },
      { idSuffix: "980", nominal: 980, price: 249_000, bonus: 110 },
      { idSuffix: "1980", nominal: 1980, price: 479_000, bonus: 260 },
      { idSuffix: "3280", nominal: 3280, price: 825_000, bonus: 600 },
      { idSuffix: "6480", nominal: 6480, price: 1_625_000, bonus: 1600 },
    ],
  },
  {
    gameSlug: "arena-of-valor",
    gameName: "Arena of Valor",
    publisher: "Garena",
    unit: "Voucher",
    source: "Resmi Garena",
    tiers: [
      { idSuffix: "40", nominal: 40, price: 9_000 },
      { idSuffix: "110", nominal: 110, price: 22_000 },
      { idSuffix: "270", nominal: 270, price: 52_000 },
      { idSuffix: "550", nominal: 550, price: 99_000 },
      { idSuffix: "1140", nominal: 1140, price: 199_000 },
      { idSuffix: "2350", nominal: 2350, price: 399_000 },
    ],
  },
  {
    gameSlug: "call-of-duty-mobile",
    gameName: "Call of Duty Mobile",
    publisher: "Activision",
    unit: "CP",
    source: "Resmi Activision",
    tiers: [
      { idSuffix: "80", nominal: 80, price: 16_000 },
      { idSuffix: "420", nominal: 420, price: 79_000 },
      { idSuffix: "880", nominal: 880, price: 169_000 },
      { idSuffix: "2400", nominal: 2400, price: 449_000 },
      { idSuffix: "5000", nominal: 5000, price: 899_000 },
      { idSuffix: "10800", nominal: 10800, price: 1_799_000 },
    ],
  },
  {
    gameSlug: "league-of-legends-wild-rift",
    gameName: "League of Legends: Wild Rift",
    publisher: "Riot Games",
    unit: "Wild Cores",
    source: "Resmi Riot",
    tiers: [
      { idSuffix: "95", nominal: 95, price: 19_000 },
      { idSuffix: "475", nominal: 475, price: 89_000 },
      { idSuffix: "1000", nominal: 1000, price: 179_000 },
      { idSuffix: "2375", nominal: 2375, price: 419_000 },
      { idSuffix: "5000", nominal: 5000, price: 829_000 },
    ],
  },
  {
    gameSlug: "clash-of-clans",
    gameName: "Clash of Clans",
    publisher: "Supercell",
    unit: "Gems",
    source: "Resmi Supercell",
    tiers: [
      { idSuffix: "500", nominal: 500, price: 79_000 },
      { idSuffix: "1200", nominal: 1200, price: 179_000 },
      { idSuffix: "2500", nominal: 2500, price: 299_000 },
      { idSuffix: "6500", nominal: 6500, price: 749_000 },
      { idSuffix: "14000", nominal: 14000, price: 1_549_000 },
    ],
  },
  {
    gameSlug: "clash-royale",
    gameName: "Clash Royale",
    publisher: "Supercell",
    unit: "Gems",
    source: "Resmi Supercell",
    tiers: [
      { idSuffix: "500", nominal: 500, price: 79_000 },
      { idSuffix: "1200", nominal: 1200, price: 179_000 },
      { idSuffix: "2500", nominal: 2500, price: 299_000 },
      { idSuffix: "6500", nominal: 6500, price: 749_000 },
      { idSuffix: "14000", nominal: 14000, price: 1_549_000 },
    ],
  },
  {
    gameSlug: "apex-legends-mobile",
    gameName: "Apex Legends Mobile",
    publisher: "Electronic Arts",
    unit: "Coins",
    source: "Resmi EA",
    tiers: [
      { idSuffix: "115", nominal: 115, price: 19_000 },
      { idSuffix: "500", nominal: 500, price: 79_000 },
      { idSuffix: "1000", nominal: 1000, price: 159_000 },
      { idSuffix: "2150", nominal: 2150, price: 339_000 },
      { idSuffix: "4250", nominal: 4250, price: 649_000 },
    ],
  },
  {
    gameSlug: "ragnarok-m",
    gameName: "Ragnarok M: Eternal Love",
    publisher: "Gravity",
    unit: "BCC",
    source: "Resmi Gravity",
    tiers: [
      { idSuffix: "60", nominal: 60, price: 19_000, processMinutes: "2-5" },
      { idSuffix: "300", nominal: 300, price: 89_000, processMinutes: "2-5" },
      { idSuffix: "500", nominal: 500, price: 149_000, processMinutes: "2-5" },
      { idSuffix: "980", nominal: 980, price: 289_000, processMinutes: "2-5" },
      {
        idSuffix: "3000",
        nominal: 3000,
        price: 849_000,
        processMinutes: "2-5",
      },
    ],
  },
  {
    gameSlug: "point-blank",
    gameName: "Point Blank",
    publisher: "Zepetto",
    unit: "PB Cash",
    source: "Resmi Zepetto",
    formatNominal: (n) => n.toLocaleString("id-ID"),
    tiers: [
      { idSuffix: "3000", nominal: 3000, price: 29_000 },
      { idSuffix: "10000", nominal: 10000, price: 95_000 },
      { idSuffix: "30000", nominal: 30000, price: 275_000 },
      { idSuffix: "100000", nominal: 100000, price: 899_000 },
    ],
  },
  {
    gameSlug: "tower-of-fantasy",
    gameName: "Tower of Fantasy",
    publisher: "Hotta Studio",
    unit: "Tanium",
    source: "Resmi Hotta Studio",
    tiers: [
      { idSuffix: "60", nominal: 60, price: 16_000 },
      { idSuffix: "300", nominal: 300, price: 79_000 },
      { idSuffix: "980", nominal: 980, price: 249_000 },
      { idSuffix: "1980", nominal: 1980, price: 479_000 },
      { idSuffix: "3280", nominal: 3280, price: 825_000 },
    ],
  },
  {
    gameSlug: "zenless-zone-zero",
    gameName: "Zenless Zone Zero",
    publisher: "HoYoverse",
    unit: "Polychrome",
    source: "Resmi HoYoverse",
    tiers: [
      { idSuffix: "60", nominal: 60, price: 16_000 },
      { idSuffix: "300", nominal: 300, price: 79_000 },
      { idSuffix: "980", nominal: 980, price: 249_000 },
      { idSuffix: "1980", nominal: 1980, price: 479_000 },
      { idSuffix: "3280", nominal: 3280, price: 825_000 },
    ],
  },
  {
    gameSlug: "wuthering-waves",
    gameName: "Wuthering Waves",
    publisher: "Kuro Games",
    unit: "Lunite",
    source: "Resmi Kuro Games",
    tiers: [
      { idSuffix: "60", nominal: 60, price: 16_000 },
      { idSuffix: "300", nominal: 300, price: 79_000 },
      { idSuffix: "980", nominal: 980, price: 249_000 },
      { idSuffix: "1980", nominal: 1980, price: 479_000 },
      { idSuffix: "3280", nominal: 3280, price: 825_000 },
    ],
  },
  {
    gameSlug: "identity-v",
    gameName: "Identity V",
    publisher: "NetEase",
    unit: "Echoes",
    source: "Resmi NetEase",
    tiers: [
      { idSuffix: "70", nominal: 70, price: 16_000 },
      { idSuffix: "380", nominal: 380, price: 79_000 },
      { idSuffix: "1180", nominal: 1180, price: 229_000 },
      { idSuffix: "3880", nominal: 3880, price: 779_000 },
    ],
  },
  {
    gameSlug: "stumble-guys",
    gameName: "Stumble Guys",
    publisher: "Kitka Games",
    unit: "Gems",
    source: "Resmi Kitka Games",
    tiers: [
      { idSuffix: "130", nominal: 130, price: 14_000 },
      { idSuffix: "700", nominal: 700, price: 64_000 },
      { idSuffix: "1400", nominal: 1400, price: 129_000 },
      { idSuffix: "3000", nominal: 3000, price: 249_000 },
      { idSuffix: "7000", nominal: 7000, price: 599_000 },
    ],
  },
  {
    gameSlug: "super-sus",
    gameName: "Super Sus",
    publisher: "PIProductions",
    unit: "SC",
    source: "Resmi PIProductions",
    tiers: [
      { idSuffix: "60", nominal: 60, price: 16_000 },
      { idSuffix: "300", nominal: 300, price: 79_000 },
      { idSuffix: "980", nominal: 980, price: 249_000 },
      { idSuffix: "1980", nominal: 1980, price: 479_000 },
    ],
  },
  {
    gameSlug: "lords-mobile",
    gameName: "Lords Mobile",
    publisher: "IGG",
    unit: "Diamonds",
    source: "Resmi IGG",
    tiers: [
      { idSuffix: "200", nominal: 200, price: 29_000, processMinutes: "2-5" },
      { idSuffix: "500", nominal: 500, price: 79_000, processMinutes: "2-5" },
      {
        idSuffix: "1200",
        nominal: 1200,
        price: 169_000,
        processMinutes: "2-5",
      },
      {
        idSuffix: "2500",
        nominal: 2500,
        price: 349_000,
        processMinutes: "2-5",
      },
      {
        idSuffix: "6000",
        nominal: 6000,
        price: 799_000,
        processMinutes: "2-5",
      },
    ],
  },
  {
    gameSlug: "dragon-raja",
    gameName: "Dragon Raja",
    publisher: "Archosaur Games",
    unit: "Diamonds",
    source: "Resmi Archosaur",
    tiers: [
      { idSuffix: "60", nominal: 60, price: 16_000 },
      { idSuffix: "300", nominal: 300, price: 79_000 },
      { idSuffix: "980", nominal: 980, price: 249_000 },
      { idSuffix: "1980", nominal: 1980, price: 479_000 },
    ],
  },
  {
    gameSlug: "mobile-legends-adventure",
    gameName: "Mobile Legends: Adventure",
    publisher: "Moonton",
    unit: "Diamond",
    source: "Resmi Moonton",
    tiers: [
      { idSuffix: "60", nominal: 60, price: 16_000 },
      { idSuffix: "300", nominal: 300, price: 79_000 },
      { idSuffix: "980", nominal: 980, price: 249_000 },
      { idSuffix: "1980", nominal: 1980, price: 479_000 },
    ],
  },
  {
    gameSlug: "eight-ball-pool",
    gameName: "8 Ball Pool",
    publisher: "Miniclip",
    unit: "Coins",
    source: "Resmi Miniclip",
    formatNominal: (n) => {
      if (n >= 1_000_000) return `${n / 1_000_000}M`;
      if (n >= 1_000) return `${n / 1_000}K`;
      return n.toLocaleString("id-ID");
    },
    tiers: [
      { idSuffix: "50k", nominal: 50_000, price: 25_000 },
      { idSuffix: "200k", nominal: 200_000, price: 79_000 },
      { idSuffix: "500k", nominal: 500_000, price: 179_000 },
      { idSuffix: "1m", nominal: 1_000_000, price: 349_000 },
    ],
  },
];

/**
 * Generator `Topup_Denomination` Product dari `TOPUP_SPECS`.
 *
 * Konvensi `id`/`slug` (stabil agar bookmark/checkout link tetap valid):
 *   - `id`   : `t-${gameSlug}-${tier.idSuffix}` (lowercase, ASCII).
 *   - `slug` : `topup-${gameSlug}-${tier.idSuffix}-${unit-kebab}`.
 *
 * Field Product yang dihasilkan:
 *   - `category`   : "topup" (REQ-5.2).
 *   - `gameSlug`   : dari spec — wajib untuk topup.
 *   - `gameName`   : dari spec, dipakai oleh `Cart_Item_Row` & breadcrumb.
 *   - `coverImage` : placeholder bertema "{Game} {nominal} {unit}".
 *   - `media`      : single placeholder (gallery topup tidak diperluas).
 *   - `price`      : IDR + opsional `originalAmount`/`discountPercent`.
 *   - `highlights` : 3 bullet ("{nominal+bonus} {unit}", "Proses ±X menit",
 *                    "{source}").
 *   - `specs`      : `{ Nominal, Proses, Metode }`.
 *   - `createdAt`  : timestamp deterministik agar sort "newest" stabil di
 *                    test snapshot. Skema: tier ke-i di game ke-j memakai
 *                    offset menit `j*60 + i` dari epoch base.
 */
const TOPUP_EPOCH_BASE = new Date("2026-05-01T00:00:00.000Z").getTime();

function generateTopupProducts(): Product[] {
  return TOPUP_SPECS.flatMap((spec, gameIdx) =>
    spec.tiers.map((tier, tierIdx): Product => {
      const formatNominal =
        spec.formatNominal ?? ((n: number) => n.toLocaleString("id-ID"));
      const nominalLabel = formatNominal(tier.nominal);
      const totalLabel = tier.bonus
        ? `${nominalLabel} + ${formatNominal(tier.bonus)} bonus ${spec.unit}`
        : `${nominalLabel} ${spec.unit}`;
      const processRange = tier.processMinutes ?? "1-3";
      const createdAt = new Date(
        TOPUP_EPOCH_BASE + (gameIdx * 60 + tierIdx) * 60_000,
      ).toISOString();

      return {
        id: `t-${spec.gameSlug}-${tier.idSuffix}`,
        slug: `topup-${spec.gameSlug}-${tier.idSuffix}-${spec.unit
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}`,
        title: `Top Up ${spec.gameName} · ${nominalLabel} ${spec.unit}`,
        shortDescription: `${spec.unit} ${spec.gameName} ${spec.source.toLowerCase()}, proses ±${processRange.split("-")[0]} menit.`,
        category: "topup",
        gameSlug: spec.gameSlug,
        gameName: spec.gameName,
        coverImage: placeholder(
          `${spec.gameName} ${nominalLabel} ${spec.unit}`,
        ),
        media: [placeholder(`${spec.gameName} ${spec.unit}`)],
        price: {
          currency: "IDR",
          amount: tier.price,
          ...(tier.originalPrice ? { originalAmount: tier.originalPrice } : {}),
          ...(tier.discountPercent
            ? { discountPercent: tier.discountPercent }
            : {}),
        },
        stockStatus: "ready",
        highlights: [totalLabel, `Proses ±${processRange} menit`, spec.source],
        specs: {
          Nominal: totalLabel,
          Proses: `${processRange} menit`,
          Metode: "User ID + Server",
        },
        createdAt,
      };
    }),
  );
}

const TOPUP_PRODUCTS: Product[] = generateTopupProducts();

const ACCOUNT_PRODUCTS: Product[] = [
  {
    id: "p-001",
    slug: "akun-ml-mythic-glory-1200-skin",
    title: "Akun ML Mythic Glory · 1200+ Skin",
    shortDescription:
      "Account ML rank Mythic Glory, koleksi skin lengkap, anti-minus.",
    category: "account",
    gameSlug: "mobile-legends",
    gameName: "Mobile Legends",
    coverImage: {
      url: "/image/akun-ml-1.jpg",
      alt: "Akun ML Mythic",
      width: 800,
      height: 600,
    },
    media: [
      placeholder("ML Mythic 1"),
      placeholder("ML Mythic 2"),
      placeholder("ML Mythic 3"),
    ],
    price: {
      currency: "IDR",
      amount: 2_499_000,
      originalAmount: 2_999_000,
      discountPercent: 17,
    },
    stockStatus: "ready",
    highlights: [
      "Mythic Glory 250+",
      "1200+ Skin",
      "Full Hero",
      "Bind Moonton",
    ],
    specs: {
      Rank: "Mythic Glory 287",
      Skin: "1247",
      Hero: "All Hero (124)",
      Login: "Email Moonton",
      "Bind Sosmed": "Tidak ada",
    },
    filterTags: {
      rank: ["mythic-glory"],
      "skin-count": ["1001+"],
    },
    rating: { average: 4.9, count: 132 },
    createdAt: "2026-04-22T10:00:00.000Z",
  },
  {
    id: "p-003",
    slug: "akun-valorant-immortal-radianite",
    title: "Akun Valorant Immortal · Phantom Reaver",
    shortDescription: "Account Valorant rank Immortal, koleksi skin premium.",
    category: "account",
    gameSlug: "valorant",
    gameName: "Valorant",
    coverImage: {
      url: "/image/akun-valo-1.jpg",
      alt: "Akun Valorant Immortal",
      width: 800,
      height: 600,
    },
    media: [placeholder("Valo 1"), placeholder("Valo 2")],
    price: {
      currency: "IDR",
      amount: 3_750_000,
      originalAmount: 4_250_000,
      discountPercent: 12,
    },
    stockStatus: "ready",
    highlights: ["Immortal 2", "12 Bundle Skin", "Full Agent"],
    specs: {
      Rank: "Immortal 2",
      Bundle: "Reaver, Sentinels of Light, Glitchpop",
      Agent: "All Unlocked",
      Region: "AP",
    },
    filterTags: {
      rank: ["immortal"],
      skin: ["reaver", "sentinels-of-light", "glitchpop"],
    },
    rating: { average: 4.8, count: 64 },
    createdAt: "2026-05-12T11:30:00.000Z",
  },
  {
    id: "p-005",
    slug: "akun-pubg-conqueror-uc",
    title: "Akun PUBG Mobile · Conqueror M416 Glacier",
    shortDescription:
      "Account PUBG Mobile rank Conqueror dengan koleksi UC dan skin senjata mythic.",
    category: "account",
    gameSlug: "pubg-mobile",
    gameName: "PUBG Mobile",
    coverImage: {
      url: "/image/akun-pubg-1.jpg",
      alt: "Akun PUBG Sultan",
      width: 800,
      height: 600,
    },
    media: [placeholder("PUBG 1")],
    price: {
      currency: "IDR",
      amount: 1_899_000,
      originalAmount: 2_299_000,
      discountPercent: 17,
    },
    stockStatus: "sold_out",
    highlights: ["Conqueror Tier", "M416 Glacier", "AKM Glacier"],
    specs: {
      Rank: "Conqueror",
      Level: "78",
      Skin: "Mythic 12+",
    },
    filterTags: {
      rank: ["conqueror"],
      skin: ["m416-glacier", "akm-glacier"],
    },
    rating: { average: 4.7, count: 41 },
    createdAt: "2026-04-30T14:00:00.000Z",
  },
  {
    id: "p-008",
    slug: "akun-genshin-ar60-archon",
    title: "Akun Genshin AR60 · Full Archon",
    shortDescription:
      "Account Genshin Adventure Rank 60, full constellation Archon.",
    category: "account",
    gameSlug: "genshin-impact",
    gameName: "Genshin Impact",
    coverImage: {
      url: "/image/akun-genshin-1.jpg",
      alt: "Akun Genshin AR60",
      width: 800,
      height: 600,
    },
    media: [placeholder("Genshin 1")],
    price: { currency: "IDR", amount: 5_250_000 },
    stockStatus: "ready",
    highlights: ["AR 60", "All Archon C0+", "Endgame Ready"],
    specs: {
      AR: "60",
      Server: "Asia",
      Login: "Email HoYoverse",
    },
    filterTags: {
      ar: ["ar-60"],
      character: ["zhongli", "venti", "raiden", "nahida", "furina"],
    },
    rating: { average: 5, count: 18 },
    createdAt: "2026-05-01T12:00:00.000Z",
  },
];

const VOUCHER_PRODUCTS: Product[] = [
  {
    id: "p-006",
    slug: "voucher-google-play-100rb",
    title: "Voucher Google Play Rp100.000",
    shortDescription:
      "Voucher digital Google Play Indonesia, dikirim instan via email.",
    category: "voucher",
    // Voucher tidak terikat ke `Game`; gunakan `platformSlug` (REQ-5.2,
    // hard-rule kontrak data). Slug merujuk ke `MOCK_PLATFORMS`.
    platformSlug: "google-play",
    coverImage: {
      url: "/image/play-store-logo.jpg",
      alt: "Voucher Google Play",
      width: 800,
      height: 600,
    },
    media: [placeholder("Voucher GP")],
    price: { currency: "IDR", amount: 102_000 },
    stockStatus: "ready",
    highlights: ["Instant Delivery", "Region ID", "Email Voucher"],
    specs: {
      Nominal: "Rp100.000",
      Region: "Indonesia",
      Pengiriman: "Email",
    },
    createdAt: "2026-05-16T07:30:00.000Z",
  },
  {
    id: "p-009",
    slug: "voucher-steam-wallet-60rb",
    title: "Voucher Steam Wallet Rp60.000",
    shortDescription:
      "Steam Wallet Code Indonesia, langsung masuk saldo Steam.",
    category: "voucher",
    platformSlug: "steam",
    coverImage: {
      url: "/image/steam logo.jpg",
      alt: "Voucher Steam",
      width: 800,
      height: 600,
    },
    media: [placeholder("Steam Wallet")],
    price: { currency: "IDR", amount: 63_000 },
    stockStatus: "ready",
    highlights: ["Instant Delivery", "Region ID", "Kode Digital"],
    specs: {
      Nominal: "Rp60.000",
      Region: "Indonesia",
      Pengiriman: "Kode via Email",
    },
    createdAt: "2026-05-14T10:00:00.000Z",
  },
  {
    id: "p-010",
    slug: "voucher-steam-wallet-120rb",
    title: "Voucher Steam Wallet Rp120.000",
    shortDescription:
      "Steam Wallet Code Indonesia nominal besar, dikirim instan.",
    category: "voucher",
    platformSlug: "steam",
    coverImage: {
      url: "/image/steam logo.jpg",
      alt: "Voucher Steam 120k",
      width: 800,
      height: 600,
    },
    media: [placeholder("Steam Wallet 120k")],
    price: { currency: "IDR", amount: 125_000 },
    stockStatus: "ready",
    highlights: ["Instant Delivery", "Region ID", "Kode Digital"],
    specs: {
      Nominal: "Rp120.000",
      Region: "Indonesia",
      Pengiriman: "Kode via Email",
    },
    createdAt: "2026-05-14T11:00:00.000Z",
  },
  {
    id: "p-011",
    slug: "voucher-playstation-store-150rb",
    title: "Voucher PlayStation Store Rp150.000",
    shortDescription: "PSN Wallet top up Region 3 Indonesia, proses otomatis.",
    category: "voucher",
    platformSlug: "playstation-store",
    coverImage: {
      url: "/image/playstation logo.jpg",
      alt: "Voucher PSN",
      width: 800,
      height: 600,
    },
    media: [placeholder("PSN Wallet")],
    price: { currency: "IDR", amount: 155_000 },
    stockStatus: "ready",
    highlights: ["Region 3 ID", "Instant Code", "PS4 & PS5"],
    specs: {
      Nominal: "Rp150.000",
      Region: "Indonesia (R3)",
      Pengiriman: "Kode via Email",
    },
    createdAt: "2026-05-15T09:00:00.000Z",
  },
  {
    id: "p-012",
    slug: "voucher-playstation-store-300rb",
    title: "Voucher PlayStation Store Rp300.000",
    shortDescription: "PSN Wallet top up Region 3 Indonesia, nominal besar.",
    category: "voucher",
    platformSlug: "playstation-store",
    coverImage: {
      url: "/image/playstation logo.jpg",
      alt: "Voucher PSN 300k",
      width: 800,
      height: 600,
    },
    media: [placeholder("PSN Wallet 300k")],
    price: { currency: "IDR", amount: 310_000 },
    stockStatus: "ready",
    highlights: ["Region 3 ID", "Instant Code", "PS4 & PS5"],
    specs: {
      Nominal: "Rp300.000",
      Region: "Indonesia (R3)",
      Pengiriman: "Kode via Email",
    },
    createdAt: "2026-05-15T10:00:00.000Z",
  },
  {
    id: "p-013",
    slug: "voucher-app-store-150rb",
    title: "Voucher App Store & iTunes Rp150.000",
    shortDescription:
      "Apple Gift Card Indonesia, bisa untuk App Store, iTunes, iCloud+.",
    category: "voucher",
    platformSlug: "app-store",
    coverImage: {
      url: "/image/app store logo.png",
      alt: "Voucher App Store",
      width: 800,
      height: 600,
    },
    media: [placeholder("Apple Gift Card")],
    price: { currency: "IDR", amount: 155_000 },
    stockStatus: "ready",
    highlights: ["Region ID", "Multi-use", "Instant Code"],
    specs: {
      Nominal: "Rp150.000",
      Region: "Indonesia",
      Pengiriman: "Kode via Email",
    },
    createdAt: "2026-05-13T08:00:00.000Z",
  },
  {
    id: "p-014",
    slug: "voucher-xbox-game-pass-ultimate",
    title: "Xbox Game Pass Ultimate 1 Bulan",
    shortDescription: "Akses ratusan game Xbox + PC + EA Play + Cloud Gaming.",
    category: "voucher",
    platformSlug: "xbox",
    coverImage: {
      url: "/image/xbox logo.png",
      alt: "Xbox Game Pass",
      width: 800,
      height: 600,
    },
    media: [placeholder("Xbox GP Ultimate")],
    price: { currency: "IDR", amount: 65_000 },
    stockStatus: "ready",
    highlights: ["1 Bulan", "Xbox + PC", "EA Play Included"],
    specs: {
      Durasi: "1 Bulan",
      Platform: "Xbox / PC / Cloud",
      Pengiriman: "Kode via Email",
    },
    createdAt: "2026-05-12T14:00:00.000Z",
  },
  {
    id: "p-015",
    slug: "voucher-xbox-gift-card-200rb",
    title: "Xbox Gift Card Rp200.000",
    shortDescription: "Saldo Xbox Store untuk beli game, DLC, dan add-on.",
    category: "voucher",
    platformSlug: "xbox",
    coverImage: {
      url: "/image/xbox logo.png",
      alt: "Xbox Gift Card",
      width: 800,
      height: 600,
    },
    media: [placeholder("Xbox GC 200k")],
    price: { currency: "IDR", amount: 205_000 },
    stockStatus: "ready",
    highlights: ["Region ID", "Instant Code", "Xbox & PC"],
    specs: {
      Nominal: "Rp200.000",
      Region: "Indonesia",
      Pengiriman: "Kode via Email",
    },
    createdAt: "2026-05-12T15:00:00.000Z",
  },
];

export const MOCK_PRODUCTS: Product[] = [
  ...ACCOUNT_PRODUCTS,
  ...VOUCHER_PRODUCTS,
  ...TOPUP_PRODUCTS,
];
