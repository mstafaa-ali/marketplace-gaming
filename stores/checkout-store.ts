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

  setCustomer: (info: Partial<CustomerInfo>) => void;
  setPayment: (method: PaymentMethod) => void;
  applyVoucher: (result: VoucherResult) => void;
  clearVoucher: () => void;
  setProcessing: (v: boolean) => void;
  setOrderResult: (result: OrderResult) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  customer: {},
  selectedPayment: null,
  voucher: null,
  orderResult: null,
  isProcessing: false,
} as const;

/**
 * Ephemeral checkout store — NOT persisted.
 * Holds draft customer info, selected payment, voucher state, and order result.
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

  reset: () => set({ ...INITIAL_STATE }),
}));
