import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';
import { Menu, X } from 'lucide-react';
import logoPath from "@assets/WhatsApp_Image_2026-05-13_at_6.33.10_PM_1778840554626.jpeg";

export function Navbar() {
  const { lang, toggleLang, dir } = useLanguage();
  const t = translations[lang];
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.about, href: '#about' },
    { name: t.nav.vision, href: '#vision' },
    { name: t.nav.values, href: '#values' },
    { name: t.nav.leadership, href: '#leadership' },
    { name: t.nav.methodology, href: '#methodology' },
    { name: t.nav.sectors, href: '#sectors' },
    { name: t.nav.services, href: '#services' },
    { name: t.nav.projects, href: '#projects' },
    { name: t.nav.contact, href: '#contact' },
  ];

  const scrollTo = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer" onClick={() => scrollTo('#hero')}>
          <div className="bg-white p-1 rounded-sm w-12 h-12 flex items-center justify-center overflow-hidden">
            <img src={logoPath} alt="Al-Maamoura Logo" className="w-full h-full object-contain" />
          </div>
          <span className={`text-xl font-bold ${isScrolled ? 'text-secondary' : 'text-white'} hidden sm:block`}>
            المعمورة | Al-Maamoura
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollTo(link.href)}
              className={`text-sm hover:text-secondary transition-colors ${
                isScrolled ? 'text-white' : 'text-white/90 hover:text-white'
              }`}
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={toggleLang}
            className="px-4 py-1.5 rounded-full bg-secondary text-primary border border-secondary hover:bg-secondary/80 transition-all text-sm font-bold shadow-md"
            data-testid="button-toggle-lang"
          >
            {t.nav.toggle}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={toggleLang}
            className="px-3 py-1 rounded-full bg-secondary text-primary border border-secondary text-sm font-bold shadow-md"
          >
            {t.nav.toggle}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-primary shadow-xl border-t border-white/10">
          <div className="flex flex-col py-4">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.href)}
                className="py-3 px-6 text-start text-white hover:bg-white/5 hover:text-secondary transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
