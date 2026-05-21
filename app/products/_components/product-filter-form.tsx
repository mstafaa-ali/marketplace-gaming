"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORY_LABELS, CATEGORY_VALUES } from "@/lib/constants/products";
import { draftToOverride, useFilterDraftStore } from "@/stores/filter-store";
import type { GameFilterDefinition } from "@/lib/data/game-filters";
import type { Game } from "@/lib/types/game";
import type { ProductCategory, ProductQuery } from "@/lib/types/product";
import { buildProductQueryString } from "@/lib/utils/product-query";
import { cn } from "@/lib/utils/cn";

/**
 * Cakupan halaman tempat form filter dipakai.
 *
 * - `"global"`: dipakai di `/products` listing flat (default, perilaku lama).
 * - `"game-detail"`: dipakai di `/products/account/{gameSlug}`.
 *   `gameSlug` sudah dipatok oleh URL segment, jadi multi-select Game
 *   disembunyikan dan tidak boleh ikut ditulis ke URL params.
 */
export type ProductFilterScope = "global" | "game-detail";

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
  /**
   * Cakupan tempat form ini dirender. Defaultnya `"global"` agar pemanggil
   * lama di `/products` tetap berperilaku sama tanpa perubahan call site.
   */
  scope?: ProductFilterScope;
  /**
   * Path dasar yang dipakai saat membangun URL Apply/Reset. Default
   * `/products` untuk scope `"global"`. Scope `"game-detail"` wajib
   * memberikan path lengkap, mis. `/products/account/mobile-legends`,
   * supaya navigasi tetap berada di Game_Detail_Page.
   */
  basePath?: string;
  /**
   * Definisi filter spesifik game (rank, skin, character, dll.).
   * Hanya diisi saat `scope === "game-detail"`. Jika kosong/undefined,
   * fieldset game filter tidak ditampilkan.
   */
  gameFilters?: GameFilterDefinition[];
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
 * 5. "Reset" navigates to `basePath` without filters.
 *
 * Saat `scope === "game-detail"`, multi-select Game disembunyikan dan field
 * `games` di draft di-clear setelah hydrate sehingga seleksi dari sesi
 * `/products` sebelumnya tidak ikut bocor ke URL Game_Detail_Page.
 */
export function ProductFilterForm({
  query,
  games,
  onCommit,
  hideTitle = false,
  className,
  scope = "global",
  basePath = "/products",
  gameFilters = [],
}: ProductFilterFormProps) {
  const router = useRouter();
  const formId = useId();
  const [isPending, startTransition] = useTransition();

  const draft = useFilterDraftStore();
  const isGameDetail = scope === "game-detail";

  // Sync the draft with the URL whenever the URL changes (back/forward,
  // active-filter chip removal, reset link). Comparing serialized
  // representations avoids redundant resets on every render.
  const querySig = `${query.category ?? ""}|${query.games.join(",")}|${
    query.min ?? ""
  }|${query.max ?? ""}|${JSON.stringify(query.filterTags ?? {})}`;

  useEffect(() => {
    draft.hydrateFrom(query);
    // Pada scope game-detail, `gameSlug` ditetapkan oleh URL segment, jadi
    // setiap seleksi multi-select Game (baik dari sesi global sebelumnya
    // maupun dari `?game=…` yang di-paste manual) harus dibuang agar
    // tidak terbawa ke URL params Game_Detail_Page.
    if (isGameDetail) {
      draft.clearGames();
    }
    // We intentionally depend on the signature, not `draft.hydrateFrom`,
    // because Zustand setters are stable but the ESLint exhaustive-deps rule
    // can't see that statically.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySig, isGameDetail]);

  function buildHref(qs: string): string {
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function commit(href: string) {
    startTransition(() => {
      router.push(href, { scroll: false });
    });
    onCommit?.();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const override = draftToOverride(draft);
    // Pada scope game-detail, `games` tidak boleh ikut ditulis ke URL.
    // `null` membuat `buildProductQueryString` menghapus seluruh entry
    // `?game=…` (lihat `lib/utils/product-query.ts`).
    if (isGameDetail) {
      override.games = null;
    }
    commit(buildHref(buildProductQueryString(query, override)));
  }

  function handleReset() {
    draft.reset();
    commit(basePath);
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

        {/* Kategori & Game hanya ditampilkan di scope global.
            Di game-detail, keduanya sudah dipatok oleh URL segment. */}
        {!isGameDetail && (
          <CategoryFieldset
            value={draft.category}
            onChange={draft.setCategory}
          />
        )}

        {!isGameDetail && (
          <GameFieldset
            games={games}
            selected={draft.games}
            onToggle={draft.toggleGame}
            onClear={draft.clearGames}
          />
        )}

        {/* Filter spesifik game (rank, skin, character, dll.) —
            hanya muncul di scope game-detail saat definisi tersedia. */}
        {isGameDetail && gameFilters.length > 0 && (
          <GameTagFilters
            filters={gameFilters}
            filterTags={draft.filterTags}
            onToggle={draft.toggleFilterTag}
            onClear={draft.clearFilterTags}
          />
        )}

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

/**
 * Game-specific filter fieldsets (rank, skin, character, etc.).
 * Renders one fieldset per filter definition with chip-style toggles.
 */
function GameTagFilters({
  filters,
  filterTags,
  onToggle,
  onClear,
}: {
  filters: GameFilterDefinition[];
  filterTags: Record<string, string[]>;
  onToggle: (key: string, value: string, type: "select" | "multi") => void;
  onClear: () => void;
}) {
  const hasActive = Object.keys(filterTags).length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Filter Game
        </span>
        {hasActive && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-violet-300 underline-offset-4 hover:underline"
          >
            Bersihkan
          </button>
        )}
      </div>
      {filters.map((filter) => (
        <GameTagFieldset
          key={filter.key}
          filter={filter}
          activeValues={filterTags[filter.key] ?? []}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

function GameTagFieldset({
  filter,
  activeValues,
  onToggle,
}: {
  filter: GameFilterDefinition;
  activeValues: string[];
  onToggle: (key: string, value: string, type: "select" | "multi") => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-medium text-fg-muted">
        {filter.label}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {filter.options.map((option) => {
          const isActive = activeValues.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(filter.key, option.value, filter.type)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:outline-violet-400 focus-visible:outline-offset-2",
                isActive
                  ? "border-violet-500 bg-violet-500/20 text-violet-200"
                  : "border-border text-fg-muted hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-fg",
              )}
              aria-pressed={isActive}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
