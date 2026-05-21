import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Themed input. Mirrors the recipe in `styling-guideline.md` so search,
 * filter, and form fields stay visually consistent. Forward `ref` so it can
 * be paired with libraries that need direct access (Radix, react-hook-form).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-10 w-full rounded-md border border-border bg-bg-overlay px-3 text-sm text-fg",
        "placeholder:text-fg-subtle",
        "transition-colors duration-(--duration-base) ease-snappy",
        "focus:outline-none focus-visible:border-violet-400",
        "disabled:cursor-not-allowed disabled:opacity-60",
        // Hide native number spinners — looks tidier next to a label.
        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        className,
      )}
      {...props}
    />
  );
});
