import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';

export function FloatingContact() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const servicesEl = document.querySelector('#services');
      if (servicesEl) {
        const rect = servicesEl.getBoundingClientRect();
        setVisible(rect.top < window.innerHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToContact}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-secondary text-white px-5 py-3 rounded-full shadow-2xl hover:bg-secondary/90 active:scale-95 transition-transform"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
        >
          <MessageCircle size={18} />
          <span className="text-sm font-semibold">{t.nav.contact}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
