"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useCheckoutStore } from "@/stores/checkout-store";

export interface CustomerInfoSectionProps {
  /**
   * Menentukan apakah field `gameId` dan `gameServer` ditampilkan dan
   * divalidasi sebagai mandatory.
   *
   * - `true` → kedua field dirender dengan label asterisk, error inline,
   *   serta wiring `aria-invalid` + `aria-describedby`.
   * - `false` → kedua field disembunyikan (alur cart non-game).
   *
   * Tidak ada nilai default; callers wajib memilih secara eksplisit
   * karena alur topup dan alur cart memiliki semantik berbeda.
   */
  requireGameFields: boolean;
  /** Map error per nama field. Kunci yang relevan: `name`, `email`, `whatsapp`, `gameId`, `gameServer`. */
  errors: Record<string, string>;
}

/**
 * Section form data pemesan: nama, email, WhatsApp, ID game, server game,
 * dan catatan. Field game (`gameId`/`gameServer`) hanya dirender ketika
 * `requireGameFields` bernilai `true`.
 */
export function CustomerInfoSection({
  requireGameFields,
  errors,
}: CustomerInfoSectionProps) {
  const customer = useCheckoutStore((s) => s.customer);
  const setCustomer = useCheckoutStore((s) => s.setCustomer);

  const handleChange = useCallback(
    (field: string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCustomer({ [field]: e.target.value });
      },
    [setCustomer],
  );

  return (
    <fieldset className="space-y-4 rounded-xl border border-border bg-bg-elevated p-5">
      <legend className="text-base font-semibold text-fg">Data Pemesan</legend>

      {/* Nama */}
      <div className="space-y-1.5">
        <label
          htmlFor="checkout-name"
          className="text-sm font-medium text-fg-muted"
        >
          Nama Lengkap <span className="text-danger">*</span>
        </label>
        <Input
          id="checkout-name"
          placeholder="Masukkan nama lengkap"
          value={customer.name ?? ""}
          onChange={handleChange("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "checkout-name-error" : undefined}
        />
        {errors.name && (
          <p id="checkout-name-error" className="text-xs text-danger">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="checkout-email"
          className="text-sm font-medium text-fg-muted"
        >
          Email <span className="text-danger">*</span>
        </label>
        <Input
          id="checkout-email"
          type="email"
          placeholder="contoh@email.com"
          value={customer.email ?? ""}
          onChange={handleChange("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "checkout-email-error" : undefined}
        />
        {errors.email && (
          <p id="checkout-email-error" className="text-xs text-danger">
            {errors.email}
          </p>
        )}
      </div>

      {/* WhatsApp */}
      <div className="space-y-1.5">
        <label
          htmlFor="checkout-wa"
          className="text-sm font-medium text-fg-muted"
        >
          Nomor WhatsApp <span className="text-danger">*</span>
        </label>
        <Input
          id="checkout-wa"
          type="tel"
          placeholder="08xxxxxxxxxx"
          value={customer.whatsapp ?? ""}
          onChange={handleChange("whatsapp")}
          aria-invalid={!!errors.whatsapp}
          aria-describedby={errors.whatsapp ? "checkout-wa-error" : undefined}
        />
        {errors.whatsapp && (
          <p id="checkout-wa-error" className="text-xs text-danger">
            {errors.whatsapp}
          </p>
        )}
      </div>

      {/* ID Game — wajib ketika requireGameFields === true */}
      {requireGameFields && (
        <div className="space-y-1.5">
          <label
            htmlFor="checkout-gameid"
            className="text-sm font-medium text-fg-muted"
          >
            ID Game <span className="text-danger">*</span>
          </label>
          <Input
            id="checkout-gameid"
            placeholder="Masukkan ID in-game"
            value={customer.gameId ?? ""}
            onChange={handleChange("gameId")}
            aria-invalid={!!errors.gameId}
            aria-describedby={
              errors.gameId ? "checkout-gameid-error" : undefined
            }
          />
          {errors.gameId && (
            <p id="checkout-gameid-error" className="text-xs text-danger">
              {errors.gameId}
            </p>
          )}
        </div>
      )}

      {/* Server Game — wajib ketika requireGameFields === true */}
      {requireGameFields && (
        <div className="space-y-1.5">
          <label
            htmlFor="checkout-server"
            className="text-sm font-medium text-fg-muted"
          >
            Server Game <span className="text-danger">*</span>
          </label>
          <Input
            id="checkout-server"
            placeholder="Contoh: Asia, SEA, dll."
            value={customer.gameServer ?? ""}
            onChange={handleChange("gameServer")}
            aria-invalid={!!errors.gameServer}
            aria-describedby={
              errors.gameServer ? "checkout-server-error" : undefined
            }
          />
          {errors.gameServer && (
            <p id="checkout-server-error" className="text-xs text-danger">
              {errors.gameServer}
            </p>
          )}
        </div>
      )}

      {/* Catatan — opsional */}
      <div className="space-y-1.5">
        <label
          htmlFor="checkout-notes"
          className="text-sm font-medium text-fg-muted"
        >
          Catatan <span className="text-fg-subtle">(opsional)</span>
        </label>
        <textarea
          id="checkout-notes"
          rows={3}
          placeholder="Catatan tambahan untuk penjual..."
          value={customer.notes ?? ""}
          onChange={handleChange("notes")}
          className="w-full rounded-md border border-border bg-bg-overlay px-3 py-2 text-sm text-fg placeholder:text-fg-subtle transition-colors duration-(--duration-base) ease-snappy focus:outline-none focus-visible:border-violet-400 disabled:cursor-not-allowed disabled:opacity-60 resize-none"
        />
      </div>
    </fieldset>
  );
}
