import { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';
import { Phone, Mail, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Server error");
      setSubmitted(true);
      form.reset();
    } catch {
      setError(t.footer.form.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer id="contact" className="bg-primary text-white pt-24 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Contact Info */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-secondary font-bold text-lg">{t.footer.badge}</span>
              <div className="h-px bg-white/20 w-16" />
            </div>

            <h2 className="text-secondary font-bold text-2xl mb-4 tracking-wider">
              {t.footer.companyName}
            </h2>
            <p className="text-white/70 mb-12 max-w-md">
              {t.footer.tagline}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-secondary mt-1" />
                <div>
                  <h4 className="font-bold mb-1">{t.footer.locationLabel}</h4>
                  <p className="text-white/70">{t.footer.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-secondary mt-1" />
                <div>
                  <h4 className="font-bold mb-1">{t.footer.phoneLabel}</h4>
                  <p className="text-white/70">+962 79 502 9922</p>
                  <p className="text-white/50 text-sm">{t.footer.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-secondary mt-1" />
                <div>
                  <h4 className="font-bold mb-1">{t.footer.emailLabel}</h4>
                  <p className="text-white/70">vchman@mideasteagles.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 p-8 border border-white/10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-4">
                <CheckCircle2 className="text-secondary w-14 h-14" />
                <h3 className="text-white text-xl font-bold">{t.footer.form.successTitle}</h3>
                <p className="text-white/70">{t.footer.form.successMessage}</p>
                <Button
                  variant="outline"
                  className="mt-4 border-white/20 text-white hover:bg-white/10"
                  onClick={() => setSubmitted(false)}
                >
                  {t.footer.form.sendAnother}
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{t.footer.form.name} *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-secondary focus-visible:border-secondary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{t.footer.form.email} *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-secondary focus-visible:border-secondary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{t.footer.form.phone}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-secondary focus-visible:border-secondary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">{t.footer.form.subject}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-secondary focus-visible:border-secondary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">{t.footer.form.message} *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/30 min-h-[120px] focus-visible:ring-secondary focus-visible:border-secondary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-sm py-6 text-lg"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.footer.form.sending}
                      </span>
                    ) : t.footer.form.send}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
