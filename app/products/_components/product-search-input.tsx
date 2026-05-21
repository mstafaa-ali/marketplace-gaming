"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils/cn";
import type { ProductQuery } from "@/lib/types/product";
import { buildProductsHref } from "@/lib/utils/product-query";

interface ProductSearchInputProps {
  query: ProductQuery;
  /**
   * Route dasar untuk navigasi search — default `"/products"`. Diisi route
   * turunan (`/products/account/{gameSlug}`, `/products/voucher/{platformSlug}`)
   * supaya pencarian tidak lompat balik ke listing global.
   */
  basePath?: string;
  className?: string;
}

/**
 * Listing search field. Pushes `?q=` to the URL with a 350ms debounce so each
 * keystroke doesn't trigger a server roundtrip. Submitting the form (Enter)
 * commits immediately. The route is the source of truth — local state only
 * exists to drive the controlled input.
 */
export function ProductSearchInput({
  query,
  basePath = "/products",
  className,
}: ProductSearchInputProps) {
  const router = useRouter();
  const [value, setValue] = useState(query.q ?? "");
  const debounced = useDebouncedValue(value, 350);
  const [isPending, startTransition] = useTransition();

  // Keep local state in sync if the URL changes from elsewhere
  // (e.g. clearing the active filter chip, navigating back).
  const lastSyncedRef = useRef(query.q ?? "");
  useEffect(() => {
    const next = query.q ?? "";
    if (next !== lastSyncedRef.current) {
      lastSyncedRef.current = next;
      setValue(next);
    }
  }, [query.q]);

  // Push debounced value to the URL — only when it actually differs from
  // what's already in the query, to avoid replace loops.
  const lastPushedRef = useRef(query.q ?? "");
  useEffect(() => {
    const trimmed = debounced.trim();
    const current = query.q ?? "";
    if (trimmed === current) {
      lastPushedRef.current = trimmed;
      return;
    }
    if (trimmed === lastPushedRef.current) return;

    lastPushedRef.current = trimmed;
    const href = buildProductsHref(
      query,
      {
        q: trimmed.length > 0 ? trimmed : undefined,
        resetPage: true,
      },
      basePath,
    );
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }, [debounced, query, router, basePath]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    const href = buildProductsHref(
      query,
      {
        q: trimmed.length > 0 ? trimmed : undefined,
        resetPage: true,
      },
      basePath,
    );
    router.push(href, { scroll: false });
  }

  function clear() {
    setValue("");
    const href = buildProductsHref(
      query,
      { q: undefined, resetPage: true },
      basePath,
    );
    router.replace(href, { scroll: false });
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "group relative flex items-center rounded-md border border-border bg-bg-overlay",
        "transition-colors focus-within:border-violet-400",
        isPending && "opacity-90",
        className,
      )}
    >
      <Search
        className="pointer-events-none absolute left-3 size-4 text-fg-subtle"
        aria-hidden
      />
      <label htmlFor="product-search" className="sr-only">
        Cari di daftar produk
      </label>
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Cari nama akun, top up, atau game..."
        autoComplete="off"
        className={cn(
          "h-10 w-full bg-transparent pl-9 pr-9 text-sm text-fg",
          "placeholder:text-fg-subtle focus:outline-none",
        )}
      />
      {value.length > 0 ? (
        <button
          type="button"
          onClick={clear}
          aria-label="Hapus kata kunci pencarian"
          className={cn(
            "absolute right-2 inline-flex size-7 items-center justify-center rounded-full",
            "text-fg-subtle transition-colors hover:bg-bg-elevated hover:text-fg",
            "focus-visible:outline-2 focus-visible:outline-violet-400 focus-visible:outline-offset-2",
          )}
        >
          <X className="size-4" aria-hidden />
        </button>
      ) : null}
    </form>
  );
}
