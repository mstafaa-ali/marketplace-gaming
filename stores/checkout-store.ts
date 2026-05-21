"use client";

import { create } from "zustand";
import type {
  CustomerInfo,
  PaymentMethod,
  VoucherResult,
  OrderResult,
} from "@/lib/types/checkout";

interface CheckoutState {
  customer: Partial<CustomerInfo>;
  selectedPayment: PaymentMethod | null;
  voucher: VoucherResult | null;
  orderResult: OrderResult | null;
  isProcessing: boolean;
  /**
   * ID `Topup_Denomination` yang dipilih pengguna di `Topup_Picker`
   * saat alur Topup aktif (`/checkout?category=topup&game=…`).
   *
   * Bernilai `null` selama alur cart biasa atau saat denominasi belum dipilih.
   */
  topupSelectedId: string | null;

  setCustomer: (info: Partial<CustomerInfo>) => void;
  setPayment: (method: PaymentMethod) => void;
  applyVoucher: (result: VoucherResult) => void;
  clearVoucher: () => void;
  setProcessing: (v: boolean) => void;
  setOrderResult: (result: OrderResult) => void;
  /**
   * Setter untuk `topupSelectedId`. Terima `null` untuk membatalkan pilihan
   * (mis. saat denominasi yang sebelumnya dipilih sudah tidak tersedia).
   */
  setTopupSelectedId: (id: string | null) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  customer: {},
  selectedPayment: null,
  voucher: null,
  orderResult: null,
  isProcessing: false,
  topupSelectedId: null,
} as const;

/**
 * Ephemeral checkout store — NOT persisted.
 * Holds draft customer info, selected payment, voucher state, order result,
 * and the currently selected Topup_Denomination id during the Topup flow.
 * Cleared on reset or when user navigates away.
 */
export const useCheckoutStore = create<CheckoutState>()((set) => ({
  ...INITIAL_STATE,

  setCustomer: (info) =>
    set((state) => ({ customer: { ...state.customer, ...info } })),

  setPayment: (method) => set({ selectedPayment: method }),

  applyVoucher: (result) => set({ voucher: result }),

  clearVoucher: () => set({ voucher: null }),

  setProcessing: (v) => set({ isProcessing: v }),

  setOrderResult: (result) => set({ orderResult: result }),

  setTopupSelectedId: (id) => set({ topupSelectedId: id }),

  reset: () => set({ ...INITIAL_STATE }),
}));
