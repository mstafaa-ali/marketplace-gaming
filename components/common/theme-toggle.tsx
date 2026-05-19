"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils/cn";

const ORDER = ["light", "dark", "system"] as const;
type ThemeId = (typeof ORDER)[number];

const ICONS: Record<ThemeId, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS: Record<ThemeId, string> = {
  light: "Tema terang",
  dark: "Tema gelap",
  system: "Ikuti sistem",
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();

  // Render a stable placeholder until hydration to avoid mismatches.
  const current: ThemeId = hydrated
    ? ((theme as ThemeId) ?? "system")
    : "system";
  const Icon = ICONS[current];

  function cycle() {
    const idx = ORDER.indexOf(current);
    const next = ORDER[(idx + 1) % ORDER.length];
    setTheme(next);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      aria-label={`Ubah tema (saat ini: ${LABELS[current]})`}
      title={LABELS[current]}
      className={cn("rounded-full", className)}
    >
      <Icon className="size-5" aria-hidden />
    </Button>
  );
}
