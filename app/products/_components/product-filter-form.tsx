"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORY_LABELS, CATEGORY_VALUES } from "@/lib/constants/products";
import { draftToOverride, useFilterDraftStore } from "@/stores/filter-store";
import type { Game } from "@/lib/types/game";
import type { ProductCategory, ProductQuery } from "@/lib/types/product";
import { buildProductsHref } from "@/lib/utils/product-query";
import { cn } from "@/lib/utils/cn";

interface ProductFilterFormProps {
  query: ProductQuery;
  games: Game[];
  /**
   * Optional callback fired right after a successful apply/reset — used by the
   * mobile drawer to close itself. Desktop sidebar can omit it.
   */
  onCommit?: () => void;
  /** Hide the section title on mobile (the drawer header already shows one). */
  hideTitle?: boolean;
  className?: string;
}

/**
 * Filter form shared between the desktop sidebar and the mobile drawer.
 *
 * State flow:
 * 1. URL is the source of truth for applied filters.
 * 2. On mount + when URL changes, hydrate the draft from `query` so the form
 *    matches what's currently active.
 * 3. User edits → updates Zustand draft only.
 * 4. "Terapkan" commits the draft to the URL via `router.push`.
 * 5. "Reset" navigates to `/products` without filters.
 */
export function ProductFilterForm({
  query,
  games,
  onCommit,
  hideTitle = false,
  className,
}: ProductFilterFormProps) {
  const router = useRouter();
  const formId = useId();
  const [isPending, startTransition] = useTransition();

  const draft = useFilterDraftStore();

  // Sync the draft with the URL whenever the URL changes (back/forward,
  // active-filter chip removal, reset link). Comparing serialized
  // representations avoids redundant resets on every render.
  const querySig = `${query.category ?? ""}|${query.games.join(",")}|${
    query.min ?? ""
  }|${query.max ?? ""}`;

  useEffect(() => {
    draft.hydrateFrom(query);
    // We intentionally depend on the signature, not `draft.hydrateFrom`,
    // because Zustand setters are stable but the ESLint exhaustive-deps rule
    // can't see that statically.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySig]);

  function commit(href: string) {
    startTransition(() => {
      router.push(href, { scroll: false });
    });
    onCommit?.();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const override = draftToOverride(draft);
    commit(buildProductsHref(query, override));
  }

  function handleReset() {
    draft.reset();
    commit("/products");
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className={cn("flex h-full flex-col gap-6", className)}
      aria-label="Filter produk"
    >
      <div className="flex flex-1 flex-col gap-6">
        {!hideTitle ? (
          <div className="space-y-1">
            <h2 className="font-display text-base font-semibold tracking-tight">
              Filter
            </h2>
            <p className="text-xs text-fg-subtle">
              Persempit hasil sesuai preferensimu.
            </p>
          </div>
        ) : null}

        <CategoryFieldset value={draft.category} onChange={draft.setCategory} />

        <GameFieldset
          games={games}
          selected={draft.games}
          onToggle={draft.toggleGame}
          onClear={draft.clearGames}
        />

        <PriceFieldset
          minInput={draft.minInput}
          maxInput={draft.maxInput}
          onMinChange={draft.setMinInput}
          onMaxChange={draft.setMaxInput}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="sm:flex-1"
          disabled={isPending}
        >
          {isPending ? "Memuat..." : "Terapkan filter"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={handleReset}
          disabled={isPending}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}

function CategoryFieldset({
  value,
  onChange,
}: {
  value: ProductCategory | undefined;
  onChange: (category: ProductCategory | undefined) => void;
}) {
  const groupName = useId();
  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
        Kategori
      </legend>
      <div className="flex flex-col gap-1.5">
        <RadioRow
          name={groupName}
          checked={value === undefined}
          onChange={() => onChange(undefined)}
          label="Semua kategori"
        />
        {CATEGORY_VALUES.map((category) => (
          <RadioRow
            key={category}
            name={groupName}
            checked={value === category}
            onChange={() => onChange(category)}
            label={CATEGORY_LABELS[category]}
          />
        ))}
      </div>
    </fieldset>
  );
}

function GameFieldset({
  games,
  selected,
  onToggle,
  onClear,
}: {
  games: Game[];
  selected: string[];
  onToggle: (slug: string) => void;
  onClear: () => void;
}) {
  return (
    <fieldset className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <legend className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Game
        </legend>
        {selected.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-violet-300 underline-offset-4 hover:underline"
          >
            Bersihkan
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        {games.map((game) => (
          <CheckboxRow
            key={game.slug}
            checked={selected.includes(game.slug)}
            onChange={() => onToggle(game.slug)}
            label={game.name}
            hint={`${game.productCount} produk`}
          />
        ))}
      </div>
    </fieldset>
  );
}

function PriceFieldset({
  minInput,
  maxInput,
  onMinChange,
  onMaxChange,
}: {
  minInput: string;
  maxInput: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}) {
  const minId = useId();
  const maxId = useId();
  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
        Rentang harga
      </legend>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor={minId} className="text-xs text-fg-muted">
            Minimum (Rp)
          </label>
          <Input
            id={minId}
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={minInput}
            onChange={(event) => onMinChange(event.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={maxId} className="text-xs text-fg-muted">
            Maksimum (Rp)
          </label>
          <Input
            id={maxId}
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={maxInput}
            onChange={(event) => onMaxChange(event.target.value)}
            placeholder="∞"
          />
        </div>
      </div>
    </fieldset>
  );
}

interface RadioRowProps {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}

function RadioRow({ name, checked, onChange, label }: RadioRowProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-md border border-transparent px-2 py-1.5",
        "text-sm text-fg-muted transition-colors",
        "hover:bg-bg-overlay hover:text-fg",
        "has-checked:border-violet-500/40 has-checked:bg-violet-500/10 has-checked:text-fg",
      )}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4 cursor-pointer accent-violet-500"
      />
      <span>{label}</span>
    </label>
  );
}

interface CheckboxRowProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
}

function CheckboxRow({ checked, onChange, label, hint }: CheckboxRowProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2.5 rounded-md border border-transparent px-2 py-1.5",
        "text-sm text-fg-muted transition-colors",
        "hover:bg-bg-overlay hover:text-fg",
        "has-checked:border-violet-500/40 has-checked:bg-violet-500/10 has-checked:text-fg",
      )}
    >
      <span className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="size-4 cursor-pointer accent-violet-500"
        />
        <span>{label}</span>
      </span>
      {hint ? (
        <span className="text-xs tabular-nums text-fg-subtle">{hint}</span>
      ) : null}
    </label>
  );
}
