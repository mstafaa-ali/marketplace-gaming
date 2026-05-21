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
  getEstimatedDelivery,
  getPaymentInstructions,
} from "@/lib/data/mock-checkout";
import type {
  CustomerInfo,
  OrderItem,
  OrderResult,
} from "@/lib/types/checkout";
import type { Game } from "@/lib/types/game";
import type { Product } from "@/lib/types/product";

import { CustomerInfoSection } from "./customer-info-section";
import { OrderSummaryCard } from "./order-summary-card";
import { PaymentMethodSection } from "./payment-method-section";
import { TopupPicker } from "./topup-picker";
import { VoucherSection } from "./voucher-section";

/**
 * Props `Checkout_Form`. Discriminated union berdasarkan `mode`:
 * - `"cart"` — alur keranjang biasa, sumber item dari `cart-store`.
 * - `"topup"` — alur Topup single-shot. `game` dan `denominations`
 *   dipasok dari `Checkout_Page`; `cart-store` TIDAK disentuh sama sekali
 *   (REQ-4.9).
 */
export type CheckoutFormProps =
  | { mode: "cart" }
  | { mode: "topup"; game: Game; denominations: Product[] };

/**
 * Dispatcher utama `Checkout_Form`. Memilih varian internal sesuai `mode`
 * sehingga implementasi cart dan topup tidak saling membaca state lawan.
 */
export function CheckoutForm(props: CheckoutFormProps) {
  if (props.mode === "topup") {
    return (
      <TopupCheckoutForm
        game={props.game}
        denominations={props.denominations}
      />
    );
  }
  return <CartCheckoutForm />;
}

// ───────────────────────────────────────────────────────────────────────────
// Shared helpers
// ───────────────────────────────────────────────────────────────────────────

/**
 * Mapping nama field validasi ke suffix DOM id pada `customer-info-section`.
 * Dipakai untuk meng-`focus` field pertama yang error setelah submit.
 */
const FIELD_TO_DOM_ID_SUFFIX: Record<string, string> = {
  whatsapp: "wa",
  gameId: "gameid",
  gameServer: "server",
};

/**
 * Fokuskan elemen input pertama yang error berdasarkan nama field.
 */
function focusFirstError(errors: Record<string, string>): void {
  const firstField = Object.keys(errors)[0];
  if (!firstField) return;
  const suffix = FIELD_TO_DOM_ID_SUFFIX[firstField] ?? firstField;
  const el = document.getElementById(`checkout-${suffix}`);
  el?.focus();
}

/**
 * REQ-4.10 — Commit `OrderResult` ke `checkout-store` dengan jalur fallback.
 *
 * Jalur normal:
 *   - Panggil `setOrderResult(result)` (sinkron — `set({ orderResult })` di
 *     Zustand). Kembalikan `/checkout/confirmation`.
 *
 * Jalur fallback (jika `setOrderResult` melempar):
 *   - Coba simpan `OrderResult` ke `sessionStorage` dengan key
 *     `"gm-pending-order"` sebagai JSON. Jika `sessionStorage` juga gagal
 *     (mis. quota / mode privat), log error tetapi tetap navigate — worst
 *     case halaman konfirmasi tidak punya data, namun navigasi tidak hang.
 *   - Kembalikan `/checkout/confirmation?fallback=session` sehingga
 *     `Confirmation_Content` tahu harus membaca `sessionStorage`.
 */
function commitOrderResult(
  result: OrderResult,
  setOrderResult: (r: OrderResult) => void,
): string {
  try {
    setOrderResult(result);
    return "/checkout/confirmation";
  } catch (storeError) {
    try {
      sessionStorage.setItem("gm-pending-order", JSON.stringify(result));
    } catch (storageError) {
      // Worst-case: store + sessionStorage keduanya gagal. Tetap navigate
      // agar user tidak terjebak di halaman checkout; halaman konfirmasi
      // akan menampilkan empty state dan redirect ke `/products`.
      console.error(
        "[checkout] gagal menyimpan OrderResult di store dan sessionStorage",
        { storeError, storageError },
      );
    }
    return "/checkout/confirmation?fallback=session";
  }
}

/**
 * Tata letak kerangka `Checkout_Form` (back link + grid 2 kolom).
 * Konten kolom kiri/kanan dipasok via `slotForm` dan `slotSummary`.
 */
function CheckoutLayout({
  slotForm,
  slotSummary,
}: {
  slotForm: React.ReactNode;
  slotSummary: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/products">
          <ArrowLeft className="size-4" aria-hidden />
          Kembali belanja
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">{slotForm}</div>
        {slotSummary}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Cart variant (perilaku existing)
// ───────────────────────────────────────────────────────────────────────────

/**
 * Varian `Checkout_Form` untuk alur keranjang biasa. Membaca item dari
 * `cart-store`, redirect ke `/products` jika kosong, dan `clearCart()`
 * setelah submit sukses.
 */
function CartCheckoutForm() {
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

  // Redirect saat cart kosong (setelah hidrasi). Skip jika order baru saja
  // diselesaikan (`orderResult` ada, cart sengaja dikosongkan).
  useEffect(() => {
    if (hydrated && items.length === 0 && !orderResult) {
      router.replace("/products");
    }
  }, [hydrated, items.length, orderResult, router]);

  // Heuristik: jika ada item topup/account di cart, field game wajib diisi.
  const requireGameId = useMemo(() => {
    return items.some(
      (item) =>
        item.productId.startsWith("topup-") ||
        item.productId.startsWith("acc-"),
    );
  }, [items]);

  const orderItems = useMemo<OrderItem[]>(
    () =>
      items.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        qty: item.qty,
        thumbnailUrl: item.thumbnailUrl,
      })),
    [items],
  );

  function handleSubmit() {
    const customerErrors = validateCustomerInfo(
      {
        name: customer.name,
        email: customer.email,
        whatsapp: customer.whatsapp,
        gameId: customer.gameId,
        gameServer: customer.gameServer,
      },
      { requireGameFields: requireGameId },
    );

    const pmError = selectedPayment ? "" : "Pilih metode pembayaran.";

    setErrors(customerErrors);
    setPaymentError(pmError);

    if (Object.keys(customerErrors).length > 0 || pmError) {
      focusFirstError(customerErrors);
      return;
    }

    void processOrder();
  }

  async function processOrder() {
    setProcessing(true);

    // Simulasi delay API.
    await new Promise((resolve) => setTimeout(resolve, 1500));

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

    setProcessing(false);

    const destination = commitOrderResult(result, setOrderResult);
    clearCart();
    router.push(destination);
  }

  // Belum hidrasi: jangan render apapun (hindari flash empty state).
  if (!hydrated) return null;

  // Cart kosong tanpa order baru → useEffect akan redirect.
  if (items.length === 0 && !orderResult) return null;

  return (
    <CheckoutLayout
      slotForm={
        <>
          <CustomerInfoSection
            requireGameFields={requireGameId}
            errors={errors}
          />
          <PaymentMethodSection error={paymentError} />
          <VoucherSection />
        </>
      }
      slotSummary={
        <OrderSummaryCard
          items={orderItems}
          onSubmit={handleSubmit}
          disabled={isProcessing}
        />
      }
    />
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Topup variant (REQ-4.2, REQ-4.4, REQ-4.5, REQ-4.9)
// ───────────────────────────────────────────────────────────────────────────

interface TopupCheckoutFormProps {
  game: Game;
  denominations: Product[];
}

/**
 * Varian `Checkout_Form` untuk alur Topup. TIDAK pernah membaca atau
 * memodifikasi `cart-store` (REQ-4.9). Item ringkasan dibangun dari
 * `Topup_Denomination` terpilih lewat `topupSelectedId` di `checkout-store`.
 */
function TopupCheckoutForm({ game, denominations }: TopupCheckoutFormProps) {
  const router = useRouter();
  const hydrated = useHydrated();

  const customer = useCheckoutStore((s) => s.customer);
  const selectedPayment = useCheckoutStore((s) => s.selectedPayment);
  const voucher = useCheckoutStore((s) => s.voucher);
  const setProcessing = useCheckoutStore((s) => s.setProcessing);
  const setOrderResult = useCheckoutStore((s) => s.setOrderResult);
  const topupSelectedId = useCheckoutStore((s) => s.topupSelectedId);
  const setTopupSelectedId = useCheckoutStore((s) => s.setTopupSelectedId);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentError, setPaymentError] = useState("");

  // Bersihkan pilihan denominasi yang sudah tidak valid (mis. denominasi
  // dihapus oleh data layer di antara navigasi). Tidak menyentuh cart-store.
  useEffect(() => {
    if (
      topupSelectedId !== null &&
      !denominations.some((d) => d.id === topupSelectedId)
    ) {
      setTopupSelectedId(null);
    }
  }, [topupSelectedId, denominations, setTopupSelectedId]);

  // Denominasi terpilih (atau `null` saat belum ada pilihan).
  const selectedDenomination = useMemo<Product | null>(() => {
    if (topupSelectedId === null) return null;
    return denominations.find((d) => d.id === topupSelectedId) ?? null;
  }, [topupSelectedId, denominations]);

  // OrderItem[] turunan denominasi terpilih (qty selalu 1 untuk topup).
  const orderItems = useMemo<OrderItem[]>(() => {
    if (!selectedDenomination) return [];
    return [
      {
        id: selectedDenomination.id,
        title: selectedDenomination.title,
        price: selectedDenomination.price.amount,
        qty: 1,
        thumbnailUrl: selectedDenomination.coverImage.url,
      },
    ];
  }, [selectedDenomination]);

  // Tombol "Bayar Sekarang" disabled sampai (a) denominasi terpilih,
  // (b) customer info valid, (c) payment method terpilih (REQ-4.5).
  const customerErrorsLive = useMemo(
    () =>
      validateCustomerInfo(
        {
          name: customer.name,
          email: customer.email,
          whatsapp: customer.whatsapp,
          gameId: customer.gameId,
          gameServer: customer.gameServer,
        },
        { requireGameFields: true },
      ),
    [
      customer.name,
      customer.email,
      customer.whatsapp,
      customer.gameId,
      customer.gameServer,
    ],
  );

  const submitDisabled =
    selectedDenomination === null ||
    Object.keys(customerErrorsLive).length > 0 ||
    selectedPayment === null;

  function handleSubmit() {
    // Validasi runtime saat submit (tampilkan error inline & focus).
    const customerErrors = validateCustomerInfo(
      {
        name: customer.name,
        email: customer.email,
        whatsapp: customer.whatsapp,
        gameId: customer.gameId,
        gameServer: customer.gameServer,
      },
      { requireGameFields: true },
    );

    const pmError = selectedPayment ? "" : "Pilih metode pembayaran.";

    setErrors(customerErrors);
    setPaymentError(pmError);

    // Tombol seharusnya sudah disabled, tapi guard tambahan untuk submit
    // via Enter/keyboard pada browser tertentu.
    if (
      !selectedDenomination ||
      Object.keys(customerErrors).length > 0 ||
      pmError
    ) {
      focusFirstError(customerErrors);
      return;
    }

    void processOrder(selectedDenomination);
  }

  async function processOrder(denomination: Product) {
    setProcessing(true);

    // Simulasi delay API.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const items: OrderItem[] = [
      {
        id: denomination.id,
        title: denomination.title,
        price: denomination.price.amount,
        qty: 1,
        thumbnailUrl: denomination.coverImage.url,
      },
    ];

    const { subtotal, voucherDiscount, total } = calculateOrderSummary(
      items,
      voucher?.valid ? voucher.discountPercent : undefined,
    );

    const result: OrderResult = {
      orderId: generateOrderId(),
      orderDate: new Date().toISOString(),
      summary: {
        items,
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

    setProcessing(false);

    // REQ-4.10: commit dengan fallback sessionStorage jika `setOrderResult`
    // melempar. REQ-4.9: TIDAK memanggil `cart-store.clear()` di alur Topup.
    const destination = commitOrderResult(result, setOrderResult);
    router.push(destination);
  }

  // Belum hidrasi: jangan render apapun.
  if (!hydrated) return null;

  return (
    <CheckoutLayout
      slotForm={
        <>
          <TopupPicker
            game={game}
            denominations={denominations}
            selectedId={topupSelectedId}
            onSelect={setTopupSelectedId}
          />
          <CustomerInfoSection requireGameFields={true} errors={errors} />
          <PaymentMethodSection error={paymentError} />
          <VoucherSection />
        </>
      }
      slotSummary={
        <OrderSummaryCard
          items={orderItems}
          onSubmit={handleSubmit}
          disabled={submitDisabled}
          emptyText={`Pilih paket top up untuk ${game.name} di atas.`}
        />
      }
    />
  );
}
