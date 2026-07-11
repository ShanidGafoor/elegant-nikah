import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Home,
  ImagePlus,
  MoonStar,
  Phone,
  Send,
  Share2,
  Download,
  Volume2,
  VolumeX,
  X,
  MessageCircleHeart,
  ChevronDown,
} from "lucide-react";

import { LanguageProvider, useLang, type Lang } from "@/lib/i18n";
import weddingSong from "@/assets/febi.mp3";
import heroBg from "@/assets/hero-bg.jpg";
import calligraphy from "@/assets/calligraphy.png";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ property: "og:url", content: "/" }],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: InvitationPage,
});

// ─── Config ───────────────────────────────────────────────────────────────────
const BRIDE = "Febi";
const GROOM = "Shahbaz";
const WEDDING_DATE_ISO = "2027-02-15T10:00:00";
const NIKAH_VENUE = "Manna Juma Masjid";
const NIKAH_ADDRESS = "Manna";
const RECEPTION_ADDRESS = "Puthiyatheru";
const MAPS_QUERY = encodeURIComponent(`${NIKAH_VENUE}, Kannur`);
const RECEPTION_MAPS_QUERY = encodeURIComponent(`${RECEPTION_ADDRESS}, Kannur, Kerala`);
const CONTACT_PHONE = "9400674324";
const CONTACT_PHONE_DISPLAY = "+91 94006 74324";
const WHATSAPP_NUMBER = `91${CONTACT_PHONE}`;

// ─── Guest book backend (Google Form + published Sheet) ──────────────────────
// Wishes submit invisibly to a Google Form and display from a published,
// family-approved Google Sheet tab. Until these four values are filled in,
// the guest book runs in local-preview mode (wishes are not saved).
const GUESTBOOK_FORM_ID: string = "1FAIpQLScCRVELDmWXJ57Bq425CWSCwjR0hzbvA7MCOemn5LEO79Txkg";
const GUESTBOOK_NAME_ENTRY: string = "entry.1860960418";
const GUESTBOOK_WISH_ENTRY: string = "entry.1734280208";
const GUESTBOOK_APPROVED_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOZQ1M2341ahGG8x7Q-ln-F0jpUJp-JkPh7-id0NM5S6vtbRdltdOnfJ_F8VXTIWflKYBiW19LJuZS/pub?gid=1598118424&single=true&output=csv";
const GUESTBOOK_CONFIGURED =
  GUESTBOOK_FORM_ID !== "" && GUESTBOOK_NAME_ENTRY !== "" && GUESTBOOK_WISH_ENTRY !== "";

// ─── Reusable animation helpers ───────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

// Malayalam script reads poorly with very wide letter-spacing, so eyebrow
// labels use a gentler tracking when that language is active.
function useEyebrowTracking() {
  const { lang } = useLang();
  return lang === "ml" ? "tracking-[0.18em]" : "tracking-[0.5em]";
}

// Rub el Hizb — the eight-pointed Islamic star, used as the signature ornament.
function RubElHizb({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      className={className}
    >
      <rect x="6.5" y="6.5" width="11" height="11" />
      <rect x="6.5" y="6.5" width="11" height="11" transform="rotate(45 12 12)" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" opacity="0.8" />
    </svg>
  );
}

// Arabesque corner flourish for framing key content.
function OrnateCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" className={className}>
      <path d="M4 76 V24 Q4 4 24 4 H76" strokeWidth="1.6" />
      <path d="M14 76 V30 Q14 14 30 14 H76" strokeWidth="0.9" opacity="0.55" />
      <path
        d="M4 44 Q14 40 14 30 Q18 40 28 40 Q18 44 18 54 Q14 44 4 44 Z"
        strokeWidth="0.9"
        opacity="0.7"
      />
      <circle cx="4" cy="76" r="2.6" fill="currentColor" stroke="none" opacity="0.85" />
      <circle cx="76" cy="4" r="2.6" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  const tracking = useEyebrowTracking();
  return (
    <motion.div {...fadeUp} className="mb-14 flex flex-col items-center text-center">
      <span className={`mb-4 text-[0.7rem] uppercase ${tracking} text-gold-deep`}>{eyebrow}</span>
      <div className="mb-4 flex items-center gap-4 text-gold">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          <RubElHizb className="h-5 w-5" />
        </motion.span>
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
      </div>
      <h2 className="text-4xl font-light italic text-foreground sm:text-5xl md:text-6xl">
        {title}
      </h2>
    </motion.div>
  );
}

// ─── Language toggle ──────────────────────────────────────────────────────────
const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ml", label: "മലയാളം" },
];

function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="fixed right-4 top-4 z-[60] flex items-center rounded-full border border-gold/40 bg-ivory/70 p-1 shadow-glass backdrop-blur-xl sm:right-6 sm:top-6"
    >
      {LANG_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLang(opt.value)}
          aria-pressed={lang === opt.value}
          className={`relative rounded-full px-4 py-2 text-xs transition-colors duration-300 sm:px-5 ${
            lang === opt.value ? "text-ivory" : "text-gold-deep hover:text-foreground"
          }`}
        >
          {lang === opt.value && (
            <motion.span
              layoutId="lang-pill"
              transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
              className="absolute inset-0 rounded-full shadow-gold"
              style={{ background: "var(--gradient-gold)" }}
            />
          )}
          <span className="relative z-10 font-medium">{opt.label}</span>
        </button>
      ))}
    </motion.div>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-luxe"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="h-40 w-40"
        >
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full text-gold"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
          >
            <circle cx="50" cy="50" r="48" opacity="0.4" />
            <circle cx="50" cy="50" r="36" />
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 45} 50 50)`}>
                <path d="M50 14 Q58 30 50 50 Q42 30 50 14 Z" opacity="0.7" />
              </g>
            ))}
            <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.5" />
          </svg>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm uppercase tracking-[0.4em] text-gold-deep"
        >
          {t.loading}
        </motion.p>
      </div>
    </motion.div>
  );
}

// ─── Falling petals ───────────────────────────────────────────────────────────
function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 18 + Math.random() * 18,
        size: 10 + Math.random() * 14,
        rotation: Math.random() * 360,
        key: i,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.key}
          className="animate-petal-fall absolute top-0 block"
          style={{
            left: `${p.left}%`,
            animationDelay: `-${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 20 20"
            style={{ transform: `rotate(${p.rotation}deg)` }}
          >
            <path
              d="M10 2 C 14 6, 14 14, 10 18 C 6 14, 6 6, 10 2 Z"
              fill="oklch(0.9 0.05 82)"
              opacity="0.55"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onOpen }: { onOpen: () => void }) {
  const { t, lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
    >
      <motion.img
        src={heroBg}
        alt=""
        width={1600}
        height={1800}
        style={{ y }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ivory/70 via-cream/50 to-ivory" />
      <div className="arabesque-pattern absolute inset-0" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto max-w-3xl px-8 py-24 text-center sm:px-14"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.4 }}
          className="pointer-events-none absolute inset-4 text-gold/70 sm:inset-2"
        >
          <OrnateCorner className="absolute left-0 top-0 h-14 w-14 sm:h-20 sm:w-20" />
          <OrnateCorner className="absolute right-0 top-0 h-14 w-14 -scale-x-100 sm:h-20 sm:w-20" />
          <OrnateCorner className="absolute bottom-0 left-0 h-14 w-14 -scale-y-100 sm:h-20 sm:w-20" />
          <OrnateCorner className="absolute bottom-0 right-0 h-14 w-14 -scale-x-100 -scale-y-100 sm:h-20 sm:w-20" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-arabic text-2xl text-gold-deep sm:text-3xl"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className={`mt-3 text-xs uppercase text-muted-foreground ${
            lang === "ml" ? "tracking-[0.15em]" : "tracking-[0.4em]"
          }`}
        >
          {t.hero.bismillahLatin}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="mx-auto mt-10 max-w-xl text-sm italic leading-relaxed text-foreground/70 sm:text-base"
        >
          {t.hero.quote}
          <br />
          <span className="mt-2 inline-block text-xs not-italic tracking-widest text-gold-deep">
            {t.hero.quoteRef}
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className={`mt-16 text-xs uppercase text-gold-deep ${
            lang === "ml" ? "tracking-[0.18em]" : "tracking-[0.5em]"
          }`}
        >
          {t.hero.together}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 text-5xl italic sm:gap-6 sm:text-7xl md:text-8xl"
        >
          <span className="text-gold-gradient animate-gradient-drift">{t.names.bride}</span>
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block text-gold"
          >
            <Heart className="h-8 w-8 fill-current sm:h-12 sm:w-12" />
          </motion.span>
          <span className="text-gold-gradient animate-gradient-drift">{t.names.groom}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="mx-auto mt-10 max-w-lg text-sm leading-relaxed text-foreground/70 sm:text-base"
        >
          {t.hero.invite}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.4 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className={`animate-glow-pulse group relative mt-12 overflow-hidden rounded-full border border-gold/50 bg-luxe px-10 py-4 text-xs uppercase text-gold-deep transition-all hover:border-gold ${
            lang === "ml" ? "tracking-[0.15em]" : "tracking-[0.35em]"
          }`}
        >
          <span className="relative z-10">{t.hero.open}</span>
          <span
            className="absolute inset-0 -z-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{ background: "var(--gradient-gold)" }}
          />
        </motion.button>
      </motion.div>

      <motion.div
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-gold-deep"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown(iso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(iso).getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function Countdown() {
  const { t } = useLang();
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE_ISO);
  const items = [
    { label: t.countdown.days, value: days },
    { label: t.countdown.hours, value: hours },
    { label: t.countdown.minutes, value: minutes },
    { label: t.countdown.seconds, value: seconds },
  ];
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="bg-arabesque absolute inset-0" />
      <div className="relative mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow={t.countdown.eyebrow} title={t.countdown.title} />
        <motion.div {...fadeUp} className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {items.map((it) => (
            <div
              key={it.label}
              className="glass-card group relative rounded-3xl p-6 text-center sm:p-8"
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={it.value}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-gold-gradient text-5xl font-light tabular-nums sm:text-6xl"
                >
                  {String(it.value).padStart(2, "0")}
                </motion.div>
              </AnimatePresence>
              <div className="mt-3 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                {it.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Event details ────────────────────────────────────────────────────────────
function EventCards() {
  const { t } = useLang();
  const events = [
    {
      label: t.events.nikah,
      time: t.events.nikahTime,
      venue: t.events.nikahVenue,
      address: t.events.nikahAddress,
      icon: MoonStar,
    },
    {
      label: t.events.reception,
      time: t.events.receptionTime,
      venue: t.events.receptionVenue,
      address: t.events.receptionAddress,
      icon: Home,
    },
  ];
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow={t.events.dateDisplay} title={t.events.title} />
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((e, i) => {
            const Icon = e.icon;
            return (
              <motion.article
                key={e.label}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className="glass-card group relative overflow-hidden rounded-3xl p-10"
              >
                <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-champagne to-transparent opacity-40 blur-2xl transition-opacity group-hover:opacity-70" />
                <div className="relative">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-ivory/70 text-gold-deep">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-3xl italic sm:text-4xl">{e.label}</h3>
                  <div className="mt-6 space-y-3 text-sm text-foreground/80">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gold-deep" />
                      <span>{e.time}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                      <div>
                        <div className="font-medium">{e.venue}</div>
                        <div className="text-muted-foreground">{e.address}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Our Story timeline ───────────────────────────────────────────────────────
function Story() {
  const { t } = useLang();
  return (
    <section className="relative py-24 sm:py-32">
      <div className="bg-arabesque absolute inset-0" />
      <div className="relative mx-auto max-w-3xl px-6">
        <SectionHeading eyebrow={t.story.eyebrow} title={t.story.title} />
        <div className="relative">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent sm:left-1/2" />
          {t.story.items.map((e, i) => (
            <motion.div
              key={e.year}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className={`relative mb-12 flex items-start gap-6 sm:mb-16 sm:justify-between ${
                i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
              }`}
            >
              <div className="hidden flex-1 sm:block" />
              <div className="absolute left-4 top-3 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_16px_var(--gold)] sm:left-1/2" />
              <div className="flex-1 pl-12 sm:pl-0 sm:px-8">
                <div className="glass-card rounded-2xl p-6">
                  <div className="text-xs uppercase tracking-[0.35em] text-gold-deep">{e.year}</div>
                  <h4 className="mt-2 text-2xl italic">{e.title}</h4>
                  <p className="mt-2 text-sm text-foreground/70">{e.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
const galleryImages = [g1, g2, g3, g4, g5, g6];
function Gallery() {
  const { t } = useLang();
  const [active, setActive] = useState<number | null>(null);
  const [auto, setAuto] = useState(0);
  useEffect(() => {
    if (active === null) return;
    const t = setInterval(() => setAuto((a) => a + 1), 3500);
    return () => clearInterval(t);
  }, [active]);
  useEffect(() => {
    if (active !== null) setActive((active + 1) % galleryImages.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t.gallery.eyebrow} title={t.gallery.title} />
        <motion.div
          {...fadeUp}
          className="columns-2 gap-4 sm:columns-3 sm:gap-6 [&>*]:mb-4 sm:[&>*]:mb-6"
        >
          {galleryImages.map((src, i) => (
            <motion.button
              key={src}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              onClick={() => setActive(i)}
              className="block w-full overflow-hidden rounded-2xl border border-gold/20 shadow-glass"
            >
              <motion.img
                src={src}
                alt={`Gallery ${i + 1}`}
                loading="lazy"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              />
            </motion.button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-6 backdrop-blur-xl"
          >
            <button
              onClick={() => setActive(null)}
              className="absolute right-6 top-6 rounded-full border border-ivory/30 p-2 text-ivory hover:bg-ivory/10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              key={active}
              src={galleryImages[active]}
              alt=""
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Location ─────────────────────────────────────────────────────────────────
function Location() {
  const { t } = useLang();
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow={t.location.eyebrow} title={t.location.title} />
        <motion.div {...fadeUp} className="glass-card overflow-hidden rounded-3xl">
          <div className="aspect-video w-full">
            <iframe
              title="Wedding Venue"
              src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
              className="h-full w-full grayscale-[20%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="divide-y divide-gold/15">
            <div className="grid gap-4 p-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xl italic">
                  <MoonStar className="h-4 w-4 shrink-0 text-gold-deep" />
                  {t.events.nikahVenue}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {t.events.nikah} · {t.events.nikahTime}
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-gold/50 bg-luxe px-6 py-3 text-xs uppercase tracking-[0.2em] text-gold-deep transition-all hover:border-gold hover:shadow-gold"
              >
                <MapPin className="h-4 w-4" /> {t.location.directions}
              </a>
            </div>
            <div className="grid gap-4 p-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xl italic">
                  <Home className="h-4 w-4 shrink-0 text-gold-deep" />
                  {t.events.receptionVenue}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {t.events.reception} · {t.events.receptionTime} · {t.events.receptionAddress}
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${RECEPTION_MAPS_QUERY}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-gold/50 bg-luxe px-6 py-3 text-xs uppercase tracking-[0.2em] text-gold-deep transition-all hover:border-gold hover:shadow-gold"
              >
                <MapPin className="h-4 w-4" /> {t.location.directions}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Schedule ─────────────────────────────────────────────────────────────────
function Schedule() {
  const { t } = useLang();
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading eyebrow={t.schedule.eyebrow} title={t.schedule.title} />
        <div className="glass-card overflow-hidden rounded-3xl">
          {t.schedule.items.map((it, i) => (
            <motion.div
              key={it.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-6 p-6 sm:p-8 ${
                i !== t.schedule.items.length - 1 ? "border-b border-gold/15" : ""
              }`}
            >
              <div className="text-gold-gradient w-24 shrink-0 text-lg italic sm:w-32 sm:text-xl">
                {it.time}
              </div>
              <div className="min-w-0 text-base sm:text-lg">{it.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Blessings ────────────────────────────────────────────────────────────────
function Blessings() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="bg-arabesque absolute inset-0" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.img
          {...fadeUp}
          src={calligraphy}
          alt="Arabic calligraphy"
          width={512}
          height={256}
          loading="lazy"
          className="mx-auto mb-10 h-32 w-auto opacity-90"
        />
        <motion.p
          {...fadeUp}
          className="font-arabic text-3xl leading-loose text-gold-deep sm:text-4xl"
        >
          بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
        </motion.p>
        <motion.p {...fadeUp} className="mt-6 text-sm italic text-muted-foreground sm:text-base">
          {t.blessings.translit}
        </motion.p>
        <motion.p
          {...fadeUp}
          className="mt-6 text-base leading-relaxed text-foreground/75 sm:text-lg"
        >
          {t.blessings.meaning}
        </motion.p>
      </div>
    </section>
  );
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────
function RSVP() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    guests: "1",
    phone: "",
    attending: "yes",
    message: "",
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    const text =
      `*Wedding RSVP*%0A` +
      `Name: ${form.name}%0A` +
      `Guests: ${form.guests}%0A` +
      `Phone: ${form.phone}%0A` +
      `Attending: ${form.attending}%0A` +
      `Message: ${form.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    setSent(true);
  }

  const fields = [
    { key: "name", label: t.rsvp.name, type: "text", required: true },
    { key: "guests", label: t.rsvp.guests, type: "number", required: true },
    { key: "phone", label: t.rsvp.phone, type: "tel", required: true },
  ];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6">
        <SectionHeading eyebrow={t.rsvp.eyebrow} title={t.rsvp.title} />
        <motion.form
          {...fadeUp}
          onSubmit={submit}
          className="glass-card space-y-5 rounded-3xl p-8 sm:p-10"
        >
          {fields.map((f) => (
            <div key={f.key}>
              <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em] text-gold-deep">
                {f.label}
              </label>
              <input
                required={f.required}
                type={f.type}
                min={f.type === "number" ? 1 : undefined}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full rounded-xl border border-gold/25 bg-ivory/60 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:bg-ivory focus:shadow-[0_0_0_4px_oklch(0.82_0.1_82/0.15)]"
              />
            </div>
          ))}
          <div>
            <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em] text-gold-deep">
              {t.rsvp.attendQ}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["yes", "no"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setForm({ ...form, attending: v })}
                  className={`rounded-xl border py-3 text-sm transition-all ${
                    form.attending === v
                      ? "border-gold bg-luxe text-gold-deep shadow-gold"
                      : "border-gold/25 bg-ivory/40 text-muted-foreground hover:border-gold/50"
                  }`}
                >
                  {v === "yes" ? t.rsvp.yes : t.rsvp.no}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em] text-gold-deep">
              {t.rsvp.message}
            </label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-xl border border-gold/25 bg-ivory/60 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:bg-ivory focus:shadow-[0_0_0_4px_oklch(0.82_0.1_82/0.15)]"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-luxe px-8 py-4 text-xs uppercase tracking-[0.2em] text-gold-deep shadow-gold transition-all"
            style={{ background: "var(--gradient-gold)", color: "oklch(0.985 0.008 90)" }}
          >
            <Send className="h-4 w-4" />
            {t.rsvp.send}
          </motion.button>
          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-sage/40 bg-sage/10 p-4 text-center text-sm text-emerald-deep"
              >
                {t.rsvp.sent}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}

// ─── Dress code + Contact ─────────────────────────────────────────────────────
function DressAndContact() {
  const { t } = useLang();
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-2">
        <motion.div {...fadeUp} className="glass-card rounded-3xl p-10 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-gold-deep">{t.dress.eyebrow}</div>
          <h3 className="mt-4 text-3xl italic">{t.dress.title}</h3>
          <div className="mx-auto mt-6 flex justify-center gap-3">
            {[
              "oklch(0.965 0.018 85)",
              "oklch(0.82 0.1 82)",
              "oklch(0.55 0.06 145)",
              "oklch(0.38 0.07 155)",
            ].map((c) => (
              <div
                key={c}
                className="h-10 w-10 rounded-full border border-gold/30"
                style={{ background: c }}
              />
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{t.dress.colors}</p>
        </motion.div>

        <motion.div {...fadeUp} className="glass-card rounded-3xl p-10 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-gold-deep">
            {t.contact.eyebrow}
          </div>
          <h3 className="mt-4 text-3xl italic">{t.contact.title}</h3>
          <p className="mt-3 text-sm text-muted-foreground">{t.contact.body}</p>
          <div className="mt-6 rounded-2xl border border-gold/25 bg-ivory/50 p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-gold-deep">
              {t.contact.role}
            </div>
            <div className="mt-2 text-2xl italic">{t.contact.name}</div>
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              className="mt-1 inline-block font-mono text-sm text-foreground/80 hover:text-gold-deep"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
            <div className="mt-5 flex justify-center gap-3">
              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-luxe px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-gold-deep transition-all hover:border-gold hover:shadow-gold"
              >
                <Phone className="h-3.5 w-3.5" /> {t.contact.call}
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-ivory shadow-gold transition-all hover:opacity-90"
                style={{ background: "var(--gradient-gold)" }}
              >
                <MessageCircleHeart className="h-3.5 w-3.5" /> {t.contact.whatsapp}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Guest book ───────────────────────────────────────────────────────────────
// Minimal CSV parser that handles quoted fields (commas/newlines inside wishes).
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const SAMPLE_WISHES = [
  { name: "Zainab", text: "Barakallahu lakuma! May your home be filled with sakinah." },
  { name: "Yusuf", text: "So happy for you both. Duas always. ✨" },
  { name: "Fatima", text: "MashaAllah, a beautiful union written in the heavens." },
];

function GuestBook() {
  const { t } = useLang();
  const [wishes, setWishes] = useState<{ name: string; text: string }[]>(
    GUESTBOOK_CONFIGURED ? [] : SAMPLE_WISHES,
  );
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!GUESTBOOK_APPROVED_CSV_URL) return;
    fetch(GUESTBOOK_APPROVED_CSV_URL, { cache: "no-store" })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((csv) => {
        const approved = parseCsv(csv)
          .slice(1) // header row: Name, Wish
          .map((r) => ({ name: (r[0] ?? "").trim(), text: (r[1] ?? "").trim() }))
          .filter((w) => w.name && w.text)
          .reverse(); // newest first
        setWishes(approved);
      })
      .catch(() => {});
  }, []);

  function add(e: FormEvent) {
    e.preventDefault();
    if (!name || !text) return;
    if (GUESTBOOK_CONFIGURED) {
      // Submit invisibly to the Google Form; opaque no-cors response is expected.
      fetch(`https://docs.google.com/forms/d/e/${GUESTBOOK_FORM_ID}/formResponse`, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          [GUESTBOOK_NAME_ENTRY]: name,
          [GUESTBOOK_WISH_ENTRY]: text,
        }).toString(),
      }).catch(() => {});
      setSent(true);
    } else {
      setWishes([{ name, text }, ...wishes]);
    }
    setName("");
    setText("");
  }

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading eyebrow={t.guestbook.eyebrow} title={t.guestbook.title} />
        <motion.form
          {...fadeUp}
          onSubmit={add}
          className="glass-card mb-10 grid gap-4 rounded-3xl p-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]"
        >
          <input
            placeholder={t.guestbook.namePh}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-w-0 rounded-xl border border-gold/25 bg-ivory/60 px-4 py-3 text-sm outline-none focus:border-gold"
          />
          <input
            placeholder={t.guestbook.wishPh}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-w-0 rounded-xl border border-gold/25 bg-ivory/60 px-4 py-3 text-sm outline-none focus:border-gold"
          />
          <button
            className="shrink-0 rounded-xl px-6 py-3 text-xs uppercase tracking-[0.3em] text-ivory shadow-gold"
            style={{ background: "var(--gradient-gold)" }}
          >
            <MessageCircleHeart className="inline h-4 w-4" />
          </button>
        </motion.form>
        <AnimatePresence>
          {sent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-10 rounded-xl border border-sage/40 bg-sage/10 p-4 text-center text-sm text-emerald-deep"
            >
              {t.guestbook.sent}
            </motion.div>
          )}
        </AnimatePresence>
        {wishes.length === 0 ? (
          <motion.p {...fadeUp} className="text-center text-sm italic text-muted-foreground">
            {t.guestbook.empty}
          </motion.p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {wishes.map((w, i) => (
                <motion.div
                  key={`${w.name}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-luxe text-sm font-medium text-gold-deep">
                      {w.name[0]}
                    </div>
                    <div className="min-w-0 truncate italic text-foreground">{w.name}</div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/75">"{w.text}"</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Photo badge maker ────────────────────────────────────────────────────────
// Everything happens in-browser on a canvas; the guest's photo is never uploaded.
const BADGE_SIZE = 1080;

function drawBadgeStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = "#a37a2c";
  ctx.lineWidth = 3;
  ctx.strokeRect(-size / 2, -size / 2, size, size);
  ctx.rotate(Math.PI / 4);
  ctx.strokeRect(-size / 2, -size / 2, size, size);
  ctx.restore();
}

function drawBadgeCorner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sx: number,
  sy: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, sy);
  ctx.strokeStyle = "#c9a24b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 120);
  ctx.lineTo(0, 36);
  ctx.quadraticCurveTo(0, 0, 36, 0);
  ctx.lineTo(120, 0);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.moveTo(16, 120);
  ctx.lineTo(16, 48);
  ctx.quadraticCurveTo(16, 16, 48, 16);
  ctx.lineTo(120, 16);
  ctx.stroke();
  ctx.restore();
}

function BadgeMaker() {
  const { t, lang } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => {
      setImg(im);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    im.src = url;
  }

  useEffect(() => {
    let cancelled = false;
    async function draw() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      try {
        await Promise.all([
          document.fonts.load('italic 600 96px "Cormorant Garamond"'),
          document.fonts.load('500 40px "Inter"'),
          document.fonts.load('500 46px "Noto Sans Malayalam"'),
        ]);
      } catch {
        // draw with fallback fonts
      }
      if (cancelled) return;
      const S = BADGE_SIZE;

      // Warm luxe background
      const bg = ctx.createLinearGradient(0, 0, S, S);
      bg.addColorStop(0, "#fbf8f0");
      bg.addColorStop(0.5, "#f4ebd7");
      bg.addColorStop(1, "#ecdfc2");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, S, S);

      // Faint arabesque diamond lattice
      ctx.save();
      ctx.strokeStyle = "rgba(163, 122, 44, 0.08)";
      ctx.lineWidth = 1.5;
      const cell = 120;
      for (let x = 0; x < S; x += cell) {
        for (let y = 0; y < S; y += cell) {
          ctx.beginPath();
          ctx.moveTo(x + cell / 2, y);
          ctx.lineTo(x + cell, y + cell / 2);
          ctx.lineTo(x + cell / 2, y + cell);
          ctx.lineTo(x, y + cell / 2);
          ctx.closePath();
          ctx.stroke();
        }
      }
      ctx.restore();

      // Photo inside a golden circular frame
      const cx = S / 2;
      const cy = S * 0.4;
      const r = S * 0.26;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      if (img) {
        const cover = Math.max((2 * r) / img.width, (2 * r) / img.height) * zoom;
        const w = img.width * cover;
        const h = img.height * cover;
        ctx.drawImage(img, cx - w / 2 + offset.x, cy - h / 2 + offset.y, w, h);
      } else {
        ctx.fillStyle = "#efe6d0";
        ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
        ctx.fillStyle = "#a37a2c";
        ctx.textAlign = "center";
        ctx.font = '500 40px "Inter", "Noto Sans Malayalam", sans-serif';
        ctx.fillText(t.badge.pick, cx, cy + 12);
      }
      ctx.restore();

      // Double gold ring
      ctx.strokeStyle = "#c9a24b";
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(163, 122, 44, 0.55)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 30, 0, Math.PI * 2);
      ctx.stroke();

      drawBadgeStar(ctx, cx, cy - r - 30, 30);
      drawBadgeCorner(ctx, 46, 46, 1, 1);
      drawBadgeCorner(ctx, S - 46, 46, -1, 1);
      drawBadgeCorner(ctx, 46, S - 46, 1, -1);
      drawBadgeCorner(ctx, S - 46, S - 46, -1, -1);

      // Names, date, attendance line
      ctx.textAlign = "center";
      ctx.fillStyle = "#3d3527";
      ctx.font = 'italic 600 100px "Cormorant Garamond", "Noto Serif Malayalam", serif';
      ctx.fillText(`${t.names.bride}  ♥  ${t.names.groom}`, cx, S * 0.775);
      ctx.fillStyle = "#a37a2c";
      ctx.font = '500 40px "Inter", sans-serif';
      ctx.fillText("15 · 02 · 2027", cx, S * 0.835);
      ctx.fillStyle = "#5c4d33";
      ctx.font =
        lang === "ml"
          ? '500 46px "Noto Sans Malayalam", sans-serif'
          : 'italic 500 52px "Cormorant Garamond", serif';
      ctx.fillText(t.badge.attending, cx, S * 0.915);
    }
    draw();
    return () => {
      cancelled = true;
    };
  }, [img, zoom, offset, t, lang]);

  function pointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!img) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y };
  }

  function pointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const d = dragRef.current;
    if (!d) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scale = BADGE_SIZE / rect.width;
    setOffset({
      x: d.ox + (e.clientX - d.px) * scale,
      y: d.oy + (e.clientY - d.py) * scale,
    });
  }

  function pointerUp() {
    dragRef.current = null;
  }

  function download() {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "febi-shahbaz-wedding-badge.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  function shareBadge() {
    canvasRef.current?.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "febi-shahbaz-wedding-badge.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator
          .share({ files: [file], title: `${BRIDE} & ${GROOM} — Wedding` })
          .catch(() => {});
      } else {
        download();
      }
    }, "image/png");
  }

  const actionBtn =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] transition-all";

  return (
    <section className="relative py-24 sm:py-32">
      <div className="bg-arabesque absolute inset-0" />
      <div className="relative mx-auto max-w-2xl px-6">
        <SectionHeading eyebrow={t.badge.eyebrow} title={t.badge.title} />
        <motion.div {...fadeUp} className="glass-card rounded-3xl p-6 text-center sm:p-10">
          <p className="mb-6 text-sm text-foreground/70">{t.badge.intro}</p>
          <canvas
            ref={canvasRef}
            width={BADGE_SIZE}
            height={BADGE_SIZE}
            onPointerDown={pointerDown}
            onPointerMove={pointerMove}
            onPointerUp={pointerUp}
            onPointerCancel={pointerUp}
            className={`mx-auto w-full max-w-sm rounded-2xl border border-gold/30 shadow-glass ${
              img ? "cursor-move touch-none" : ""
            }`}
          />
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          <div className="mt-6 flex flex-col items-center gap-4">
            <button
              onClick={() => fileRef.current?.click()}
              className={`${actionBtn} border border-gold/50 bg-luxe text-gold-deep hover:border-gold hover:shadow-gold`}
            >
              <ImagePlus className="h-4 w-4" />
              {img ? t.badge.change : t.badge.pick}
            </button>
            {img && (
              <>
                <label className="flex w-full max-w-xs items-center gap-3 text-xs uppercase tracking-[0.2em] text-gold-deep">
                  {t.badge.zoom}
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: "var(--gold-deep)" }}
                  />
                </label>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={download}
                    className={`${actionBtn} text-ivory shadow-gold hover:opacity-90`}
                    style={{ background: "var(--gradient-gold)", color: "oklch(0.985 0.008 90)" }}
                  >
                    <Download className="h-4 w-4" /> {t.badge.download}
                  </button>
                  <button
                    onClick={shareBadge}
                    className={`${actionBtn} border border-gold/50 bg-luxe text-gold-deep hover:border-gold hover:shadow-gold`}
                  >
                    <Share2 className="h-4 w-4" /> {t.badge.share}
                  </button>
                </div>
              </>
            )}
            <p className="text-xs text-muted-foreground">{t.badge.privacy}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative overflow-hidden bg-luxe py-20 text-center">
      <div className="bg-arabesque absolute inset-0" />
      <div className="relative mx-auto max-w-2xl px-6">
        <div className="text-xs uppercase tracking-[0.25em] text-gold-deep">{t.footer.tag}</div>
        <h3 className="mt-4 text-4xl italic sm:text-5xl">
          <span className="text-gold-gradient">{t.names.bride}</span>
          <span className="mx-3 text-gold">&</span>
          <span className="text-gold-gradient">{t.names.groom}</span>
        </h3>
        <p className="mt-6 text-sm leading-relaxed text-foreground/70">
          {t.footer.thanks1}
          <br />
          {t.footer.thanks2}
        </p>
        <div className="mt-6 text-sm text-foreground/70">
          <span className="text-gold-deep">{t.contact.role}: </span>
          {t.contact.name} ·{" "}
          <a href={`tel:+${WHATSAPP_NUMBER}`} className="hover:text-gold-deep">
            {CONTACT_PHONE_DISPLAY}
          </a>
        </div>
        <div className="mt-8 text-xs tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} — {t.footer.made}
        </div>
      </div>
    </footer>
  );
}

// ─── Floating action toolbar ─────────────────────────────────────────────────
function Toolbar({ muted, onToggleMute }: { muted: boolean; onToggleMute: () => void }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function downloadICS() {
    const dt = "20270215T100000";
    const end = "20270215T160000";
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:${Date.now()}@wedding\nDTSTAMP:${dt}Z\nDTSTART:${dt}\nDTEND:${end}\nSUMMARY:${BRIDE} & ${GROOM} — Nikah\nLOCATION:${NIKAH_VENUE}, ${NIKAH_ADDRESS}\nDESCRIPTION:Join us for the blessed Nikah and Reception.\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  function share() {
    const data = {
      title: `${BRIDE} & ${GROOM} — Wedding Invitation`,
      text: "You're invited to our Nikah & Reception 🌙",
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    if (navigator.share) navigator.share(data).catch(() => {});
    else navigator.clipboard?.writeText(data.url);
  }

  const btn =
    "grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-ivory/80 text-gold-deep backdrop-blur-md transition-all hover:border-gold hover:shadow-gold";

  return (
    <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-gold/30 bg-ivory/60 p-2 shadow-glass backdrop-blur-xl">
      <button onClick={onToggleMute} className={btn} aria-label="Toggle music">
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
      <button onClick={downloadICS} className={btn} aria-label="Add to calendar">
        <Calendar className="h-4 w-4" />
      </button>
      <button onClick={downloadICS} className={btn} aria-label="Save the date">
        <Download className="h-4 w-4" />
      </button>
      <button onClick={share} className={btn} aria-label="Share invitation">
        <Share2 className="h-4 w-4" />
      </button>
      <button onClick={() => setDark((d) => !d)} className={btn} aria-label="Toggle theme">
        <span className="text-xs">{dark ? "☀" : "☾"}</span>
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function InvitationPage() {
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  function ensureAudio() {
    if (!audioRef.current) {
      const a = new Audio(weddingSong);
      a.loop = true;
      a.volume = 0.4;
      audioRef.current = a;
    }
    return audioRef.current;
  }

  function openInvitation() {
    setOpened(true);
    // Starting playback inside the click handler satisfies browser autoplay rules.
    ensureAudio()
      .play()
      .then(() => setMuted(false))
      .catch(() => {});
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  }

  function toggleMute() {
    const a = ensureAudio();
    if (muted) {
      a.play().catch(() => {});
      setMuted(false);
    } else {
      a.pause();
      setMuted(true);
    }
  }

  return (
    <LanguageProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-luxe text-foreground">
        <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
        <Petals />
        <LanguageToggle />

        <Hero onOpen={openInvitation} />

        <AnimatePresence>
          {opened && (
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <EventCards />
              <Countdown />
              <Story />
              <Gallery />
              <Schedule />
              <Location />
              <RSVP />
              <BadgeMaker />
              <Blessings />
              <DressAndContact />
              <GuestBook />
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>

        {opened && <Toolbar muted={muted} onToggleMute={toggleMute} />}
      </div>
    </LanguageProvider>
  );
}
