"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useTransition } from "react";
import { SORT_OPTIONS, type SortValue } from "@/lib/constants/products";
import { cn } from "@/lib/utils/cn";
import type { ProductQuery } from "@/lib/types/product";
import { buildProductsHref } from "@/lib/utils/product-query";

interface ProductSortSelectProps {
  query: ProductQuery;
  className?: string;
}

/**
 * Native `<select>` for sort. Native control gives us free a11y (keyboard,
 * VoiceOver, mobile sheet), and the listing isn't styling-heavy enough to
 * justify a custom Listbox here.
 */
export function ProductSortSelect({
  query,
  className,
}: ProductSortSelectProps) {
  const router = useRouter();
  const labelId = useId();
  const [isPending, startTransition] = useTransition();

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as SortValue;
    if (next === query.sort) return;
    const href = buildProductsHref(query, { sort: next, resetPage: true });
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  }

  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-2 rounded-md border border-border bg-bg-overlay px-3",
        "transition-colors focus-within:border-violet-400",
        isPending && "opacity-90",
        className,
      )}
    >
      <ArrowUpDown
        className="size-4 shrink-0 text-fg-subtle"
        aria-hidden
        strokeWidth={1.75}
      />
      <label
        id={labelId}
        htmlFor="product-sort"
        className="hidden text-xs text-fg-muted sm:inline"
      >
        Urutkan
      </label>
      <select
        id="product-sort"
        aria-labelledby={labelId}
        value={query.sort}
        onChange={onChange}
        className={cn(
          "h-10 cursor-pointer appearance-none bg-transparent pr-6 text-sm text-fg",
          "focus:outline-none",
        )}
      >
        {SORT_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-bg-overlay text-fg"
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2 size-4 text-fg-subtle"
        aria-hidden
        strokeWidth={1.75}
      />
    </div>
  );
}
