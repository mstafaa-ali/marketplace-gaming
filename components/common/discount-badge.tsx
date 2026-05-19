import { Sparkles } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

interface DiscountBadgeProps extends Omit<BadgeProps, "variant" | "children"> {
  /** Discount percent as a positive integer, e.g. 15 → "-15%". */
  percent: number;
  /** Show a subtle sparkle glyph for hero/featured contexts. */
  withIcon?: boolean;
}

/**
 * Compact pink-accent pill for promotional discounts. Wraps the shared
 * `Badge` so styling tokens stay consistent across the marketplace.
 */
export function DiscountBadge({
  percent,
  withIcon = false,
  className,
  ...props
}: DiscountBadgeProps) {
  if (!Number.isFinite(percent) || percent <= 0) return null;

  return (
    <Badge
      variant="promo"
      className={cn("uppercase tracking-wider", className)}
      aria-label={`Diskon ${percent} persen`}
      {...props}
    >
      {withIcon ? (
        <Sparkles className="size-3" strokeWidth={2.25} aria-hidden />
      ) : null}
      -{percent}%
    </Badge>
  );
}
