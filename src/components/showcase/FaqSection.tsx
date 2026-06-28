import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { getFaqSchema } from '@/lib/seo';
import { FAQ_ITEMS } from '@/lib/faq';

export function FaqSection() {
  return (
    <section id="faq" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <JsonLd data={getFaqSchema(FAQ_ITEMS)} />
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-primary">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base sm:text-lg text-foreground">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
