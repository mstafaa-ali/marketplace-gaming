"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@/lib/utils/cn";

/**
 * shadcn-style Accordion primitives backed by `@radix-ui/react-accordion`.
 *
 * The whole module is `"use client"` because Radix Accordion uses local state
 * and event handlers. Server Components can still pass the items as JSX
 * children: the boundary stops at this file, but the children themselves are
 * rendered ahead of time in the Server tree (RSC pattern from Next.js 16
 * "Interleaving Server and Client Components" guidance).
 */
export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        "group overflow-hidden rounded-xl border border-border bg-bg-elevated/70",
        "transition-colors duration-(--duration-base) ease-snappy",
        "data-[state=open]:border-violet-500/50 data-[state=open]:bg-bg-elevated",
        "hover:border-border-strong",
        className,
      )}
      {...props}
    />
  );
});

export const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between gap-4 px-5 py-4 text-left",
          "font-display text-base font-semibold tracking-tight text-fg",
          "transition-colors duration-(--duration-base) ease-snappy",
          "hover:text-violet-200",
          "focus-visible:outline-2 focus-visible:outline-violet-400 focus-visible:outline-offset-[-2px]",
          "[&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden
          strokeWidth={1.75}
          className="size-5 shrink-0 text-violet-300 transition-transform duration-(--duration-base) ease-snappy"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden text-sm leading-6 text-fg-muted",
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      )}
      {...props}
    >
      <div className={cn("px-5 pb-5 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
});
