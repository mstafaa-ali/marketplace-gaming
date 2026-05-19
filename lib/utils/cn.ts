import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely. Use everywhere instead of manual string concat
 * so duplicate utilities (e.g. `p-4 p-6`) collapse to the last one.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
