"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface CategorySearchInputProps {
  /** Placeholder text for the search input. */
  placeholder: string;
  /** Callback fired on every value change (already trimmed & lowercased). */
  onSearch: (query: string) => void;
  className?: string;
}

/**
 * Lightweight client-side search input for category landing pages.
 * Filters games or platforms locally without URL navigation — the full
 * dataset is already loaded server-side so instant filtering is preferred.
 */
export function CategorySearchInput({
  placeholder,
  onSearch,
  className,
}: CategorySearchInputProps) {
  const [value, setValue] = useState("");

  function handleChange(next: string) {
    setValue(next);
    onSearch(next.trim().toLowerCase());
  }

  function clear() {
    setValue("");
    onSearch("");
  }

  return (
    <div
      className={cn(
        "group relative flex items-center rounded-lg border border-border bg-bg-overlay",
        "transition-colors focus-within:border-violet-400",
        className,
      )}
    >
      <Search
        className="pointer-events-none absolute left-3 size-4 text-fg-subtle"
        aria-hidden
      />
      <label htmlFor="category-search" className="sr-only">
        {placeholder}
      </label>
      <input
        id="category-search"
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          "h-10 w-full bg-transparent pl-9 pr-9 text-sm text-fg",
          "placeholder:text-fg-subtle focus:outline-none",
        )}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={clear}
          aria-label="Hapus pencarian"
          className={cn(
            "absolute right-2 inline-flex size-7 items-center justify-center rounded-full",
            "text-fg-subtle transition-colors hover:bg-bg-elevated hover:text-fg",
            "focus-visible:outline-2 focus-visible:outline-violet-400 focus-visible:outline-offset-2",
          )}
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
