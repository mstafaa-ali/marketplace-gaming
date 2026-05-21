import "server-only";
import type { FaqItem, PromoSlide, Testimonial } from "@/lib/types/common";

export const MOCK_PROMOS: PromoSlide[] = [
  {
    id: "promo-1",
    badge: "Flash Sale",
    title: "Diskon 25% Top Up Mobile Legends",
    description: "Khusus pengguna baru, hanya minggu ini.",
    ctaLabel: "Klaim Promo",
    ctaHref: "/products?game=mobile-legends&category=topup",
    gradient: "from-violet-700/50 via-fuchsia-600/40 to-violet-500/50",
    image: "/image/promo-1.jpg",
  },
  {
    id: "promo-2",
    badge: "Best Deal",
    title: "Akun Valorant Immortal Ready",
    description: "Garansi 100% anti-minus, full bundle skin.",
    ctaLabel: "Lihat Akun",
    ctaHref: "/products?game=valorant&category=account",
    gradient: "from-rose-600/50 via-violet-700/40 to-violet-900/50",
    image: "/image/promo-2.jpg",
  },
  {
    id: "promo-3",
    badge: "Hemat",
    title: "Bundle Voucher + Top Up",
    description: "Lebih murah hingga 12% untuk paket bundling.",
    ctaLabel: "Cek Bundling",
    ctaHref: "/products?category=voucher",
    gradient: "from-cyan-500/50 via-violet-600/40 to-violet-900/50",
    image: "/image/promo-3.jpg",
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "Rezky",
    handle: "@rezkypro",
    rating: 5,
    message:
      "Top up ML auto masuk dalam 1 menit. Worth banget, bakal langganan!",
    game: "Mobile Legends",
  },
  {
    id: "t-2",
    name: "Putri",
    handle: "@putri.gg",
    rating: 5,
    message:
      "Akun Valorant immortal yang aku beli aman, sesuai deskripsi, support fast respon.",
    game: "Valorant",
  },
  {
    id: "t-3",
    name: "Daffa",
    handle: "@daffa.id",
    rating: 4,
    message:
      "Voucher Google Play langsung masuk email. Recommended buat top up rutin.",
    game: "Free Fire",
  },
  {
    id: "t-4",
    name: "Nadya",
    handle: "@nadyahoyo",
    rating: 5,
    message: "Genshin GC nya banyak bonusnya, prosesnya kilat. Mantap!",
    game: "Genshin Impact",
  },
];

export const MOCK_FAQ: FaqItem[] = [
  {
    id: "faq-1",
    question: "Apakah transaksi di sini aman?",
    answer:
      "Semua transaksi diproses melalui payment gateway terverifikasi. Setiap pembelian akun dilengkapi garansi 100% anti-minus dan rekam jejak pengiriman.",
  },
  {
    id: "faq-2",
    question: "Berapa lama proses top up sampai masuk?",
    answer:
      "Mayoritas top up otomatis masuk dalam 1–3 menit. Kalau lewat 5 menit belum masuk, tim support akan memproses manual.",
  },
  {
    id: "faq-3",
    question: "Bagaimana kalau akun yang dibeli bermasalah?",
    answer:
      "Kami sediakan garansi 7 hari untuk akun. Selama itu kalau ada kendala login atau klaim balik, kami refund full atau ganti akun setara.",
  },
  {
    id: "faq-4",
    question: "Metode pembayaran apa saja yang didukung?",
    answer:
      "Kami menerima QRIS, e-wallet (GoPay, OVO, Dana, ShopeePay), Virtual Account semua bank besar, dan kartu kredit/debit Visa & Mastercard.",
  },
];
