"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils/cn";

interface GlobalSearchProps {
  className?: string;
  /** Optional initial value (e.g. when reflecting the listing query). */
  defaultValue?: string;
}

export function GlobalSearch({
  className,
  defaultValue = "",
}: GlobalSearchProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    router.push(`/products${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={cn(
        "group relative flex w-full items-center",
        "rounded-md border border-border bg-bg-elevated",
        "transition-colors focus-within:border-violet-400",
        className,
      )}
    >
      <Search
        className="pointer-events-none absolute left-3 size-4 text-fg-subtle"
        aria-hidden
      />
      <label htmlFor="global-search" className="sr-only">
        Cari produk
      </label>
      <input
        id="global-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Cari game, akun, atau voucher..."
        className={cn(
          "h-10 w-full bg-transparent pl-9 pr-4 text-sm text-fg",
          "placeholder:text-fg-subtle",
          "focus:outline-none",
        )}
      />
    </form>
  );
}
