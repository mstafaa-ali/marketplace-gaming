import { HelpCircle, MessagesSquare } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getFaqItems } from "@/lib/data/content";

/**
 * Server component for the landing page FAQ section. Reads from the cached
 * data layer (`getFaqItems`) so it stays cacheable when Cache Components is
 * enabled later. The interactive Accordion below is a client component, but
 * the question/answer JSX is rendered ahead of time on the server and passed
 * through as children — keeping the JS payload minimal.
 */
export async function FaqAccordion() {
  const items = await getFaqItems();

  if (items.length === 0) return null;

  const defaultOpen = items[0]?.id;

  return (
    <section
      aria-labelledby="faq-heading"
      className="container-page py-12 sm:py-16"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-12">
        <header className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-violet-200">
            <HelpCircle className="size-3.5" strokeWidth={2} aria-hidden />
            FAQ
          </span>
          <h2
            id="faq-heading"
            className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Pertanyaan yang sering ditanyakan
          </h2>
          <p className="max-w-md text-sm text-fg-muted">
            Belum ketemu jawabannya? Tim support LootBox siap bantu di kanal
            chat 24 jam, atau lihat pusat bantuan untuk panduan lengkap.
          </p>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Button asChild variant="primary" size="md">
              <Link href="/contact">
                <MessagesSquare className="size-4" aria-hidden />
                Hubungi Support
              </Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/help">Pusat Bantuan</Link>
            </Button>
          </div>
        </header>

        <Accordion
          type="single"
          collapsible
          defaultValue={defaultOpen}
          className="flex flex-col gap-3"
        >
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
