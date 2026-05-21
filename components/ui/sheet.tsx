"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils/cn";

/**
 * shadcn-style Sheet primitives backed by `@radix-ui/react-dialog`.
 *
 * The whole module is `"use client"` because Radix Dialog uses portals and
 * focus management. Server Components can still pass children as JSX — the
 * boundary stops at this file (RSC interleaving pattern from Next.js 16).
 *
 * Animations are intentionally minimal so we don't depend on
 * `tailwindcss-animate`. Reduced motion is honored globally via the
 * `prefers-reduced-motion` rule in `globals.css`.
 */

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

export const SheetOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
        "data-[state=open]:animate-overlay-in",
        "data-[state=closed]:animate-overlay-out",
        className,
      )}
      {...props}
    />
  );
});

const sheetContentVariants = cva(
  cn(
    "fixed z-50 flex flex-col gap-0 bg-bg-elevated text-fg shadow-lg",
    "border-border outline-none",
  ),
  {
    variants: {
      side: {
        right:
          "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l " +
          "data-[state=open]:animate-sheet-in-right " +
          "data-[state=closed]:animate-sheet-out-right",
        left:
          "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r " +
          "data-[state=open]:animate-sheet-in-left " +
          "data-[state=closed]:animate-sheet-out-left",
        top:
          "inset-x-0 top-0 h-auto max-h-[90vh] border-b " +
          "data-[state=open]:animate-sheet-in-top " +
          "data-[state=closed]:animate-sheet-out-top",
        bottom:
          "inset-x-0 bottom-0 h-auto max-h-[90vh] border-t " +
          "data-[state=open]:animate-sheet-in-bottom " +
          "data-[state=closed]:animate-sheet-out-bottom",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends
    ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetContentVariants> {
  /** Hide the default top-right close button (use a custom one instead). */
  hideCloseButton?: boolean;
}

export const SheetContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(function SheetContent(
  { className, side = "right", hideCloseButton, children, ...props },
  ref,
) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(sheetContentVariants({ side }), className)}
        {...props}
      >
        {children}
        {!hideCloseButton ? (
          <DialogPrimitive.Close
            aria-label="Tutup panel"
            className={cn(
              "absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full",
              "border border-border bg-bg-overlay text-fg-muted",
              "transition-colors hover:border-violet-400 hover:text-fg",
              "focus-visible:outline-2 focus-visible:outline-violet-400 focus-visible:outline-offset-2",
            )}
          >
            <X className="size-4" aria-hidden />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});

export function SheetHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 border-b border-border px-5 py-4 text-left",
        className,
      )}
      {...props}
    />
  );
}

export function SheetBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto px-5 py-4", className)}
      {...props}
    />
  );
}

export function SheetFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export const SheetTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        "font-display text-lg font-semibold tracking-tight text-fg",
        className,
      )}
      {...props}
    />
  );
});

export const SheetDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-fg-muted", className)}
      {...props}
    />
  );
});
