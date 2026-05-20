export type PaymentMethodType = "bank_transfer" | "ewallet" | "qris";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  /** Lucide icon name */
  icon: string;
  description?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  whatsapp: string;
  /** ID in-game, wajib untuk kategori topup & account */
  gameId?: string;
  /** Server game, opsional */
  gameServer?: string;
  notes?: string;
}

export interface VoucherResult {
  code: string;
  valid: boolean;
  discountPercent?: number;
  discountAmount?: number;
  message: string;
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  thumbnailUrl?: string;
}

export interface OrderSummary {
  items: OrderItem[];
  subtotal: number;
  voucherDiscount: number;
  voucherCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  customer: CustomerInfo;
}

export interface OrderResult {
  orderId: string;
  orderDate: string; // ISO
  summary: OrderSummary;
  paymentInstructions: string[];
  estimatedDelivery: string;
}
