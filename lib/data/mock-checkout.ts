import type { PaymentMethod } from "@/lib/types/checkout";

/**
 * Generate mock payment instructions based on the selected payment method.
 */
export function getPaymentInstructions(method: PaymentMethod): string[] {
  switch (method.type) {
    case "bank_transfer":
      return [
        `Buka aplikasi mobile banking atau ATM ${method.name}.`,
        "Pilih menu Transfer > Transfer ke Rekening Lain.",
        `Masukkan nomor rekening: 1234-5678-9012 (a.n. Gaming Marketplace).`,
        "Masukkan jumlah sesuai total pesanan.",
        "Konfirmasi dan simpan bukti transfer.",
        "Pesanan akan diproses dalam 5-10 menit setelah pembayaran terverifikasi.",
      ];
    case "ewallet":
      return [
        `Buka aplikasi ${method.name} di smartphone Anda.`,
        "Pilih menu Bayar / Pay.",
        "Masukkan nomor tujuan: 0812-3456-7890.",
        "Masukkan jumlah sesuai total pesanan.",
        "Konfirmasi pembayaran dengan PIN.",
        "Pesanan akan diproses otomatis dalam 1-3 menit.",
      ];
    case "qris":
      return [
        "Buka aplikasi e-wallet atau mobile banking yang mendukung QRIS.",
        "Pilih menu Scan QR / QRIS.",
        "Scan kode QR yang ditampilkan (akan dikirim via WhatsApp).",
        "Konfirmasi jumlah pembayaran.",
        "Pesanan akan diproses otomatis dalam 1-3 menit.",
      ];
    default:
      return ["Hubungi customer service untuk instruksi pembayaran."];
  }
}

/**
 * Get estimated delivery time based on product category context.
 */
export function getEstimatedDelivery(): string {
  return "1-15 menit setelah pembayaran dikonfirmasi";
}
