import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message is required")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log("Form data:", data);
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We will get back to you shortly.",
    });
    form.reset();
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
                  <h4 className="font-bold mb-1">Location</h4>
                  <p className="text-white/70">{t.footer.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-secondary mt-1" />
                <div>
                  <h4 className="font-bold mb-1">Phone</h4>
                  <p className="text-white/70">+962 79 502 9922</p>
                  <p className="text-white/50 text-sm">{t.footer.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-secondary mt-1" />
                <div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <p className="text-white/70">vchman@mideasteagles.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 p-8 border border-white/10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">{t.footer.form.name}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-white/10 border-white/20 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
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
                      <FormLabel className="text-white">{t.footer.form.email}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          className="bg-white/10 border-white/20 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">{t.footer.form.message}</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="bg-white/10 border-white/20 text-white min-h-[120px] focus-visible:ring-secondary focus-visible:border-secondary" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-sm py-6 text-lg"
                >
                  {t.footer.form.send}
                </Button>
              </form>
            </Form>
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
