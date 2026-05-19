import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium tabular-nums",
  {
    variants: {
      variant: {
        neutral: "border-border bg-bg-overlay text-fg-muted",
        primary: "border-violet-500/40 bg-violet-500/15 text-violet-200",
        success: "border-success/40 bg-success-soft text-success",
        danger: "border-danger/40 bg-danger-soft text-danger",
        promo: "border-accent-pink/40 bg-accent-pink/15 text-accent-pink",
        amber: "border-accent-amber/40 bg-accent-amber/15 text-accent-amber",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
