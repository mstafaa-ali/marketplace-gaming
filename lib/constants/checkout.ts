import type { PaymentMethod } from "@/lib/types/checkout";

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "bca",
    type: "bank_transfer",
    name: "Bank BCA",
    icon: "Landmark",
    description: "Transfer manual ke rekening BCA",
  },
  {
    id: "mandiri",
    type: "bank_transfer",
    name: "Bank Mandiri",
    icon: "Landmark",
    description: "Transfer manual ke rekening Mandiri",
  },
  {
    id: "bri",
    type: "bank_transfer",
    name: "Bank BRI",
    icon: "Landmark",
    description: "Transfer manual ke rekening BRI",
  },
  {
    id: "gopay",
    type: "ewallet",
    name: "GoPay",
    icon: "Wallet",
    description: "Bayar via GoPay",
  },
  {
    id: "ovo",
    type: "ewallet",
    name: "OVO",
    icon: "Wallet",
    description: "Bayar via OVO",
  },
  {
    id: "dana",
    type: "ewallet",
    name: "Dana",
    icon: "Wallet",
    description: "Bayar via Dana",
  },
  {
    id: "qris",
    type: "qris",
    name: "QRIS",
    icon: "QrCode",
    description: "Scan QR dari aplikasi apapun",
  },
];

/** Mock voucher codes untuk simulasi */
export const MOCK_VOUCHERS: Record<
  string,
  { discountPercent: number; message: string }
> = {
  HEMAT10: { discountPercent: 10, message: "Diskon 10% berhasil diterapkan!" },
  GAMING20: {
    discountPercent: 20,
    message: "Diskon 20% berhasil diterapkan!",
  },
  NEWUSER15: {
    discountPercent: 15,
    message: "Diskon 15% untuk pengguna baru!",
  },
};
