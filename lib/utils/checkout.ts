import { MOCK_VOUCHERS } from "@/lib/constants/checkout";
import type { VoucherResult, OrderItem } from "@/lib/types/checkout";

/**
 * Validate a voucher code against mock data.
 * Returns a result object with validity status and message.
 */
export function validateVoucher(code: string): VoucherResult {
  const normalized = code.trim().toUpperCase();

  if (!normalized) {
    return {
      code: "",
      valid: false,
      message: "Masukkan kode voucher.",
    };
  }

  const found = MOCK_VOUCHERS[normalized];
  if (!found) {
    return {
      code: normalized,
      valid: false,
      message: "Kode voucher tidak valid.",
    };
  }

  return {
    code: normalized,
    valid: true,
    discountPercent: found.discountPercent,
    message: found.message,
  };
}

/**
 * Calculate order totals from cart items and optional voucher discount.
 */
export function calculateOrderSummary(
  items: OrderItem[],
  discountPercent?: number,
): { subtotal: number; voucherDiscount: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const voucherDiscount = discountPercent
    ? Math.round(subtotal * (discountPercent / 100))
    : 0;
  const total = subtotal - voucherDiscount;
  return { subtotal, voucherDiscount, total: Math.max(total, 0) };
}

/**
 * Generate a unique order ID for the confirmation page.
 * Format: GM-{timestamp_base36}-{random_4chars}
 */
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GM-${timestamp}-${random}`;
}

/**
 * Opsi tambahan untuk `validateCustomerInfo`. Membuka pintu bagi pemanggil
 * untuk men-toggle validasi field game tanpa memaksakan parameter posisi.
 */
export interface ValidateCustomerInfoOptions {
  /**
   * Jika `true`, `gameId` dan `gameServer` divalidasi sebagai mandatory.
   * Jika `false` atau dihilangkan, kedua field di-skip (alur cart non-game).
   */
  requireGameFields?: boolean;
}

/**
 * Validasi field data pemesan. Mengembalikan map `field → pesan error`.
 * Map kosong berarti semua valid.
 *
 * Backward compatibility: parameter `options` opsional. Jika tidak
 * diberikan, validasi default tidak menyentuh field game (`gameId` dan
 * `gameServer` di-skip), sehingga alur cart existing tetap berjalan.
 *
 * @param info Map field name → value (boleh `undefined`).
 * @param options Opsi validasi tambahan; `requireGameFields` mengaktifkan
 *   pengecekan `gameId` dan `gameServer` untuk alur topup/account.
 */
export function validateCustomerInfo(
  info: Record<string, string | undefined>,
  options: ValidateCustomerInfoOptions = {},
): Record<string, string> {
  const errors: Record<string, string> = {};

  const name = (info.name ?? "").trim();
  if (!name) {
    errors.name = "Nama wajib diisi.";
  } else if (name.length < 3) {
    errors.name = "Nama minimal 3 karakter.";
  }

  const email = (info.email ?? "").trim();
  if (!email) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Format email tidak valid.";
  }

  const whatsapp = (info.whatsapp ?? "").trim();
  if (!whatsapp) {
    errors.whatsapp = "Nomor WhatsApp wajib diisi.";
  } else if (!/^08\d{8,11}$/.test(whatsapp)) {
    errors.whatsapp = "Format: 08xxxxxxxxxx (10-13 digit).";
  }

  if (options.requireGameFields) {
    const gameId = (info.gameId ?? "").trim();
    if (!gameId) {
      errors.gameId = "ID Game wajib diisi untuk produk ini.";
    }

    const gameServer = (info.gameServer ?? "").trim();
    if (!gameServer) {
      errors.gameServer = "Server game wajib diisi untuk produk ini.";
    }
  }

  return errors;
}
