"use client";

import { Loader2, Tag, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCheckoutStore } from "@/stores/checkout-store";
import { validateVoucher } from "@/lib/utils/checkout";
import { cn } from "@/lib/utils/cn";

/**
 * Voucher code input with apply/remove functionality and feedback.
 */
export function VoucherSection() {
  const [code, setCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const voucher = useCheckoutStore((s) => s.voucher);
  const applyVoucher = useCheckoutStore((s) => s.applyVoucher);
  const clearVoucher = useCheckoutStore((s) => s.clearVoucher);

  async function handleApply() {
    if (!code.trim()) {
      setErrorMsg("Masukkan kode voucher.");
      return;
    }

    setIsChecking(true);
    setErrorMsg("");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const result = validateVoucher(code);
    setIsChecking(false);

    if (result.valid) {
      applyVoucher(result);
      setErrorMsg("");
    } else {
      setErrorMsg(result.message);
    }
  }

  function handleRemove() {
    clearVoucher();
    setCode("");
    setErrorMsg("");
  }

  // If voucher is already applied, show badge
  if (voucher?.valid) {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-bg-elevated p-5">
        <h2 className="text-base font-semibold text-fg">Kode Voucher</h2>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-sm font-medium text-success">
            <Tag className="size-3.5" aria-hidden />
            {voucher.code} (−{voucher.discountPercent}%)
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="grid size-6 place-items-center rounded-full text-fg-subtle transition-colors hover:bg-bg-overlay hover:text-fg"
            aria-label="Hapus voucher"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </div>
        <p className="text-xs text-success">{voucher.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-bg-elevated p-5">
      <h2 className="text-base font-semibold text-fg">Kode Voucher</h2>

      <div className="flex gap-2">
        <Input
          placeholder="Masukkan kode voucher"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (errorMsg) setErrorMsg("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApply();
            }
          }}
          aria-invalid={!!errorMsg}
          aria-describedby={errorMsg ? "voucher-error" : undefined}
          disabled={isChecking}
        />
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleApply}
          disabled={isChecking}
          className="shrink-0"
        >
          {isChecking ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            "Terapkan"
          )}
        </Button>
      </div>

      {errorMsg && (
        <p
          id="voucher-error"
          className={cn("text-xs text-danger")}
          role="alert"
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
}
