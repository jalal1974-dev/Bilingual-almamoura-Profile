import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2 } from 'lucide-react';

export function Services() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-secondary font-bold text-lg">{t.services.badge}</span>
          <div className="h-px bg-border flex-grow" />
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-primary mb-16">
          {t.services.title}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {t.services.categories.map((category, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border bg-muted/30 px-6">
                <AccordionTrigger className="text-xl font-bold text-primary hover:text-secondary hover:no-underline py-6">
                  {category.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 pt-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
