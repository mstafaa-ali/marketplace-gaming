"use client";

import { Landmark, QrCode, Wallet } from "lucide-react";
import { PAYMENT_METHODS } from "@/lib/constants/checkout";
import { useCheckoutStore } from "@/stores/checkout-store";
import { cn } from "@/lib/utils/cn";
import type { PaymentMethod } from "@/lib/types/checkout";

export interface PaymentMethodSectionProps {
  error?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Landmark,
  Wallet,
  QrCode,
};

const TYPE_LABELS: Record<string, string> = {
  bank_transfer: "Transfer Bank",
  ewallet: "E-Wallet",
  qris: "QRIS",
};

/**
 * Payment method selection with radio-card style grouped by type.
 */
export function PaymentMethodSection({ error }: PaymentMethodSectionProps) {
  const selectedPayment = useCheckoutStore((s) => s.selectedPayment);
  const setPayment = useCheckoutStore((s) => s.setPayment);

  // Group methods by type
  const grouped = PAYMENT_METHODS.reduce(
    (acc, method) => {
      if (!acc[method.type]) acc[method.type] = [];
      acc[method.type].push(method);
      return acc;
    },
    {} as Record<string, PaymentMethod[]>,
  );

  return (
    <fieldset className="space-y-4 rounded-xl border border-border bg-bg-elevated p-5">
      <legend className="text-base font-semibold text-fg">
        Metode Pembayaran <span className="text-danger">*</span>
      </legend>

      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-5">
        {Object.entries(grouped).map(([type, methods]) => (
          <div key={type} className="space-y-2.5">
            <h3 className="text-xs font-medium uppercase tracking-wider text-fg-subtle">
              {TYPE_LABELS[type] ?? type}
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {methods.map((method) => {
                const Icon = ICON_MAP[method.icon];
                const isSelected = selectedPayment?.id === method.id;

                return (
                  <label
                    key={method.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors duration-(--duration-base)",
                      isSelected
                        ? "border-violet-400 bg-violet-500/10"
                        : "border-border hover:border-border-strong hover:bg-bg-overlay",
                    )}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={method.id}
                      checked={isSelected}
                      onChange={() => setPayment(method)}
                      className="sr-only"
                    />
                    {/* Visual radio indicator */}
                    <span
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded-full border-2 transition-colors",
                        isSelected ? "border-violet-400" : "border-fg-subtle",
                      )}
                      aria-hidden
                    >
                      {isSelected && (
                        <span className="size-2 rounded-full bg-violet-400" />
                      )}
                    </span>

                    {/* Icon */}
                    {Icon && (
                      <Icon
                        className={cn(
                          "size-5 shrink-0",
                          isSelected ? "text-violet-300" : "text-fg-subtle",
                        )}
                      />
                    )}

                    {/* Label */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-fg">
                        {method.name}
                      </p>
                      {method.description && (
                        <p className="text-xs text-fg-muted">
                          {method.description}
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
