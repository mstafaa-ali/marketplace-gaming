"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof NextThemeProvider>;

/**
 * App-wide theme provider. We use `class` strategy so Tailwind v4 can react to
 * `.light` / `.dark` on <html>. Default theme is `system` so first paint
 * follows the user's OS preference.
 */
export function ThemeProvider({ children, ...props }: Props) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={["light", "dark"]}
      {...props}
    >
      {children}
    </NextThemeProvider>
  );
}
