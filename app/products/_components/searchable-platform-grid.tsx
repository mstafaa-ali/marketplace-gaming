"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategorySearchInput } from "./category-search-input";
import { PlatformCard } from "./platform-card";
import type { Platform } from "@/lib/types/platform";

const NUMBER_FORMATTER = new Intl.NumberFormat("id-ID");

export interface SearchablePlatformGridProps {
  platforms: Platform[];
  emptyText: string;
}

/**
 * Client wrapper around PlatformGrid that adds a search bar for filtering
 * platforms by name. Used on the Voucher category landing page.
 */
export function SearchablePlatformGrid({
  platforms,
  emptyText,
}: SearchablePlatformGridProps) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? platforms.filter((p) => p.name.toLowerCase().includes(query))
    : platforms;

  if (platforms.length === 0) {
    return (
      <div
        role="status"
        className="grid place-items-center rounded-2xl border border-dashed border-border-strong bg-bg-elevated/60 px-6 py-16 text-center"
      >
        <div className="mx-auto max-w-md space-y-4">
          <p className="text-sm text-fg-muted">{emptyText}</p>
          <Button asChild variant="outline" size="md">
            <Link href="/">Kembali ke beranda</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CategorySearchInput
        placeholder="Cari platform..."
        onSearch={setQuery}
        className="max-w-md"
      />

      {filtered.length === 0 ? (
        <div
          role="status"
          className="grid place-items-center rounded-2xl border border-dashed border-border-strong bg-bg-elevated/60 px-6 py-12 text-center"
        >
          <p className="text-sm text-fg-muted">
            Tidak ada platform yang cocok dengan &ldquo;{query}&rdquo;
          </p>
        </div>
      ) : (
        <ul
          role="list"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        >
          {filtered.map((platform) => {
            const formattedCount = NUMBER_FORMATTER.format(
              platform.productCount,
            );
            const countLabel = `${formattedCount} voucher`;

            return (
              <li key={platform.slug}>
                <PlatformCard platform={platform} countLabel={countLabel} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
