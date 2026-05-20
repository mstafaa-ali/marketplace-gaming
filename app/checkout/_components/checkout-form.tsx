"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import {
  calculateOrderSummary,
  generateOrderId,
  validateCustomerInfo,
} from "@/lib/utils/checkout";
import {
  getPaymentInstructions,
  getEstimatedDelivery,
} from "@/lib/data/mock-checkout";
import type { CustomerInfo, OrderResult } from "@/lib/types/checkout";
import { CustomerInfoSection } from "./customer-info-section";
import { OrderSummaryCard } from "./order-summary-card";
import { PaymentMethodSection } from "./payment-method-section";
import { VoucherSection } from "./voucher-section";

/**
 * Main checkout form orchestrator. Handles layout, validation, and submit flow.
 * Redirects to /products if cart is empty.
 */
export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useHydrated();

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  const customer = useCheckoutStore((s) => s.customer);
  const selectedPayment = useCheckoutStore((s) => s.selectedPayment);
  const voucher = useCheckoutStore((s) => s.voucher);
  const isProcessing = useCheckoutStore((s) => s.isProcessing);
  const setProcessing = useCheckoutStore((s) => s.setProcessing);
  const setOrderResult = useCheckoutStore((s) => s.setOrderResult);
  const orderResult = useCheckoutStore((s) => s.orderResult);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentError, setPaymentError] = useState("");

  // Redirect if cart is empty (after hydration) — but NOT if we just
  // completed an order (orderResult exists, cart was intentionally cleared).
  useEffect(() => {
    if (hydrated && items.length === 0 && !orderResult) {
      router.replace("/products");
    }
  }, [hydrated, items.length, orderResult, router]);

  // Determine if game ID is required (any item is topup/account category)
  // For simplicity in mock, we check if any item ID contains "topup" or "account"
  // In production this would come from product metadata
  const requireGameId = useMemo(() => {
    // Since CartItem doesn't carry category, we'll make game ID optional by default
    // The guideline says: "Required jika kategori item = topup atau account"
    // We'll use a heuristic: if any item's productId starts with "topup-" or "acc-"
    return items.some(
      (item) =>
        item.productId.startsWith("topup-") ||
        item.productId.startsWith("acc-"),
    );
  }, [items]);

  function handleSubmit() {
    // Validate customer info
    const customerErrors = validateCustomerInfo(
      {
        name: customer.name,
        email: customer.email,
        whatsapp: customer.whatsapp,
        gameId: customer.gameId,
      },
      requireGameId,
    );

    // Validate payment
    let pmError = "";
    if (!selectedPayment) {
      pmError = "Pilih metode pembayaran.";
    }

    setErrors(customerErrors);
    setPaymentError(pmError);

    // If any errors, focus first error field
    if (Object.keys(customerErrors).length > 0 || pmError) {
      const firstErrorField = Object.keys(customerErrors)[0];
      if (firstErrorField) {
        const el = document.getElementById(
          `checkout-${firstErrorField === "whatsapp" ? "wa" : firstErrorField}`,
        );
        el?.focus();
      }
      return;
    }

    // Process order
    processOrder();
  }

  async function processOrder() {
    setProcessing(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      qty: item.qty,
      thumbnailUrl: item.thumbnailUrl,
    }));

    const { subtotal, voucherDiscount, total } = calculateOrderSummary(
      orderItems,
      voucher?.valid ? voucher.discountPercent : undefined,
    );

    const result: OrderResult = {
      orderId: generateOrderId(),
      orderDate: new Date().toISOString(),
      summary: {
        items: orderItems,
        subtotal,
        voucherDiscount,
        voucherCode: voucher?.valid ? voucher.code : undefined,
        total,
        paymentMethod: selectedPayment!,
        customer: customer as CustomerInfo,
      },
      paymentInstructions: getPaymentInstructions(selectedPayment!),
      estimatedDelivery: getEstimatedDelivery(),
    };

    setOrderResult(result);
    setProcessing(false);

    // Clear cart and navigate to confirmation
    clearCart();
    router.push("/checkout/confirmation");
  }

  // Don't render until hydrated (prevents flash of empty state)
  if (!hydrated) {
    return null;
  }

  // If cart is empty and no order was just placed, show nothing (redirect will happen via useEffect)
  if (items.length === 0 && !orderResult) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/products">
          <ArrowLeft className="size-4" aria-hidden />
          Kembali belanja
        </Link>
      </Button>

      {/* 2-column layout */}
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left: form sections */}
        <div className="space-y-6">
          <CustomerInfoSection requireGameId={requireGameId} errors={errors} />
          <PaymentMethodSection error={paymentError} />
          <VoucherSection />
        </div>

        {/* Right: order summary */}
        <OrderSummaryCard onSubmit={handleSubmit} disabled={isProcessing} />
      </div>
    </div>
  );
}
