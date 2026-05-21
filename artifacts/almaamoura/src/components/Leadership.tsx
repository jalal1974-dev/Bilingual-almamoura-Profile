import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { translations } from '@/lib/translations';
import captPhoto from '@assets/capt_mohammad_alkhashman.jpg';
import mohammedPhoto from '@assets/mohammed_abdelrahman.jpg';

export function Leadership() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="leadership" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-secondary font-bold text-lg">{t.leadership.badge}</span>
          <div className="h-px bg-border flex-grow" />
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
          {t.leadership.title}
        </h2>
        
        <p className="text-lg text-muted-foreground mb-16 max-w-3xl">
          {t.leadership.intro}
        </p>

        <div className="space-y-12">
          {t.leadership.team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col md:flex-row gap-8 items-start bg-muted p-8 border border-border"
            >
              <div className="flex-shrink-0">
                {index === 0 ? (
                  <div className="w-24 h-24 rounded-full border-4 border-secondary overflow-hidden flex-shrink-0">
                    <img
                      src={captPhoto}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center 10%', transform: 'scale(1.3)', transformOrigin: 'center 15%' }}
                    />
                  </div>
                ) : (
                  <img
                    src={mohammedPhoto}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover object-top border-4 border-secondary"
                  />
                )}
              </div>
              
              <div>
                <div className="text-secondary font-bold text-sm tracking-widest uppercase mb-2">
                  {member.role}
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {member.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
