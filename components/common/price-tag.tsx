import { cn } from "@/lib/utils/cn";
import { discountPercent, formatIDR } from "@/lib/utils/format";

interface PriceTagProps {
  amount: number;
  originalAmount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { final: "text-base", original: "text-xs" },
  md: { final: "text-lg", original: "text-sm" },
  lg: { final: "text-2xl", original: "text-base" },
} as const;

export function PriceTag({
  amount,
  originalAmount,
  size = "md",
  className,
}: PriceTagProps) {
  const pct = originalAmount ? discountPercent(originalAmount, amount) : null;
  const styles = sizes[size];

  return (
    <div
      className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}
    >
      <span
        className={cn(
          "font-semibold tabular-nums text-violet-300",
          styles.final,
        )}
      >
        {formatIDR(amount)}
      </span>
      {originalAmount && pct ? (
        <>
          <span
            className={cn(
              "tabular-nums text-fg-subtle line-through",
              styles.original,
            )}
            aria-label={`Harga normal ${formatIDR(originalAmount)}`}
          >
            {formatIDR(originalAmount)}
          </span>
          <span
            className="rounded-full bg-accent-pink/15 px-2 py-0.5 text-xs font-semibold text-accent-pink"
            aria-label={`Hemat ${pct} persen`}
          >
            -{pct}%
          </span>
        </>
      ) : null}
    </div>
  );
}
