import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Send,
  Share2,
  Download,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Gift,
  Users,
  MessageCircleHeart,
  ChevronDown,
} from "lucide-react";

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
    meta: [
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: InvitationPage,
});

// ─── Config ───────────────────────────────────────────────────────────────────
const BRIDE = "Aisha";
const GROOM = "Ahmed";
const WEDDING_DATE_ISO = "2026-08-15T16:00:00";
const WEDDING_DATE_DISPLAY = "Sunday, 15 August 2026";
const NIKAH_TIME = "4:00 PM";
const NIKAH_VENUE = "Al-Noor Grand Mosque";
const NIKAH_ADDRESS = "12 Rose Garden Avenue, Hyderabad";
const RECEPTION_TIME = "7:30 PM";
const RECEPTION_VENUE = "The Ivory Ballroom";
const RECEPTION_ADDRESS = "Grand Avenue, Banjara Hills, Hyderabad";
const MAPS_QUERY = encodeURIComponent(`${NIKAH_VENUE}, ${NIKAH_ADDRESS}`);
const WHATSAPP_NUMBER = "911234567890";

// ─── Reusable animation helpers ───────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div {...fadeUp} className="mb-14 flex flex-col items-center text-center">
      <span className="mb-4 text-[0.7rem] uppercase tracking-[0.5em] text-gold-deep">
        {eyebrow}
      </span>
      <div className="mb-4 flex items-center gap-4 text-gold">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
        <Sparkles className="h-4 w-4" />
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
      </div>
      <h2 className="text-4xl font-light italic text-foreground sm:text-5xl md:text-6xl">
        {title}
      </h2>
    </motion.div>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
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
          <svg viewBox="0 0 100 100" className="h-full w-full text-gold" fill="none" stroke="currentColor" strokeWidth="0.6">
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
          Bismillah
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
        className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center"
      >
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
          className="mt-3 text-xs uppercase tracking-[0.4em] text-muted-foreground"
        >
          Bismillahir Rahmanir Rahim
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="mx-auto mt-10 max-w-xl text-sm italic leading-relaxed text-foreground/70 sm:text-base"
        >
          "And among His signs is that He created for you mates from among yourselves so that you may find tranquility in them."
          <br />
          <span className="mt-2 inline-block text-xs not-italic tracking-widest text-gold-deep">
            — Qur'an 30:21
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-16 text-xs uppercase tracking-[0.5em] text-gold-deep"
        >
          Together With Their Families
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 text-5xl italic sm:gap-6 sm:text-7xl md:text-8xl"
        >
          <span className="text-gold-gradient animate-gradient-drift">{BRIDE}</span>
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block text-gold"
          >
            <Heart className="h-8 w-8 fill-current sm:h-12 sm:w-12" />
          </motion.span>
          <span className="text-gold-gradient animate-gradient-drift">{GROOM}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="mx-auto mt-10 max-w-lg text-sm leading-relaxed text-foreground/70 sm:text-base"
        >
          request the honour of your presence to celebrate the blessed occasion of their Nikah and Wedding Reception.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.4 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpen}
          className="animate-glow-pulse group relative mt-12 overflow-hidden rounded-full border border-gold/50 bg-luxe px-10 py-4 text-xs uppercase tracking-[0.35em] text-gold-deep transition-all hover:border-gold"
        >
          <span className="relative z-10">Open Invitation</span>
          <span className="absolute inset-0 -z-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" style={{ background: "var(--gradient-gold)" }} />
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
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE_ISO);
  const items = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="bg-arabesque absolute inset-0" />
      <div className="relative mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow="Counting Down" title="Until We Say Qabul" />
        <motion.div {...fadeUp} className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {items.map((it) => (
            <div key={it.label} className="glass-card group relative rounded-3xl p-6 text-center sm:p-8">
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
              <div className="mt-3 text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
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
  const events = [
    {
      label: "Nikah Ceremony",
      time: NIKAH_TIME,
      venue: NIKAH_VENUE,
      address: NIKAH_ADDRESS,
      icon: Sparkles,
    },
    {
      label: "Reception",
      time: RECEPTION_TIME,
      venue: RECEPTION_VENUE,
      address: RECEPTION_ADDRESS,
      icon: Gift,
    },
  ];
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow={WEDDING_DATE_DISPLAY} title="The Blessed Day" />
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
  const events = [
    { year: "2022", title: "First Meeting", body: "A chance introduction through family — a quiet salaam that changed everything." },
    { year: "2023", title: "The Proposal", body: "Under the guidance of both families, hearts were spoken for with grace and prayer." },
    { year: "2024", title: "Engagement", body: "A small, sacred ceremony celebrated with those closest to us." },
    { year: "2026", title: "The Nikah", body: "InshaAllah, we begin our forever — bound by faith, love, and duas." },
  ];
  return (
    <section className="relative py-24 sm:py-32">
      <div className="bg-arabesque absolute inset-0" />
      <div className="relative mx-auto max-w-3xl px-6">
        <SectionHeading eyebrow="Our Journey" title="Written by Allah" />
        <div className="relative">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent sm:left-1/2" />
          {events.map((e, i) => (
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
        <SectionHeading eyebrow="Moments" title="Our Gallery" />
        <motion.div {...fadeUp} className="columns-2 gap-4 sm:columns-3 sm:gap-6 [&>*]:mb-4 sm:[&>*]:mb-6">
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
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow="Find Us" title="The Venue" />
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
          <div className="grid gap-4 p-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <div className="text-xl italic">{NIKAH_VENUE}</div>
              <div className="text-sm text-muted-foreground">{NIKAH_ADDRESS}</div>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-gold/50 bg-luxe px-6 py-3 text-xs uppercase tracking-[0.3em] text-gold-deep transition-all hover:border-gold hover:shadow-gold"
            >
              <MapPin className="h-4 w-4" /> Get Directions
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Schedule ─────────────────────────────────────────────────────────────────
function Schedule() {
  const items = [
    { time: "3:30 PM", title: "Guest Arrival" },
    { time: "4:00 PM", title: "Nikah Ceremony" },
    { time: "5:00 PM", title: "Group Photos" },
    { time: "6:00 PM", title: "Lunch / Dinner" },
    { time: "7:30 PM", title: "Reception" },
    { time: "9:30 PM", title: "Vote of Thanks" },
  ];
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading eyebrow="Programme" title="Wedding Schedule" />
        <div className="glass-card overflow-hidden rounded-3xl">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-6 p-6 sm:p-8 ${
                i !== items.length - 1 ? "border-b border-gold/15" : ""
              }`}
            >
              <div className="text-gold-gradient w-20 shrink-0 text-lg italic sm:w-28 sm:text-xl">
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
        <motion.p {...fadeUp} className="font-arabic text-3xl leading-loose text-gold-deep sm:text-4xl">
          بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
        </motion.p>
        <motion.p {...fadeUp} className="mt-6 text-sm italic text-muted-foreground sm:text-base">
          "Barakallahu laka wa baraka 'alayka wa jama'a baynakuma fi khayr."
        </motion.p>
        <motion.p {...fadeUp} className="mt-6 text-base leading-relaxed text-foreground/75 sm:text-lg">
          May Allah bless your marriage, shower His mercy upon you, and unite you both in goodness.
        </motion.p>
      </div>
    </section>
  );
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────
function RSVP() {
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

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6">
        <SectionHeading eyebrow="Kindly Reply" title="RSVP" />
        <motion.form
          {...fadeUp}
          onSubmit={submit}
          className="glass-card space-y-5 rounded-3xl p-8 sm:p-10"
        >
          {[
            { key: "name", label: "Full Name", type: "text", required: true },
            { key: "guests", label: "Number of Guests", type: "number", required: true },
            { key: "phone", label: "Phone Number", type: "tel", required: true },
          ].map((f) => (
            <div key={f.key}>
              <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.3em] text-gold-deep">
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
            <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.3em] text-gold-deep">
              Will you attend?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["yes", "no"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setForm({ ...form, attending: v })}
                  className={`rounded-xl border py-3 text-sm capitalize transition-all ${
                    form.attending === v
                      ? "border-gold bg-luxe text-gold-deep shadow-gold"
                      : "border-gold/25 bg-ivory/40 text-muted-foreground hover:border-gold/50"
                  }`}
                >
                  {v === "yes" ? "Joyfully Accepts" : "Regretfully Declines"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.3em] text-gold-deep">
              Special Message
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
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-luxe px-8 py-4 text-xs uppercase tracking-[0.35em] text-gold-deep shadow-gold transition-all"
            style={{ background: "var(--gradient-gold)", color: "oklch(0.985 0.008 90)" }}
          >
            <Send className="h-4 w-4" />
            Send via WhatsApp
          </motion.button>
          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-sage/40 bg-sage/10 p-4 text-center text-sm text-emerald-deep"
              >
                JazakAllah khair — your reply is on its way. 🌿
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}

// ─── Dress code + Gift ────────────────────────────────────────────────────────
function DressAndGift() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-2">
        <motion.div {...fadeUp} className="glass-card rounded-3xl p-10 text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-gold-deep">Dress Code</div>
          <h3 className="mt-4 text-3xl italic">Traditional / Formal Attire</h3>
          <div className="mx-auto mt-6 flex gap-3">
            {["oklch(0.965 0.018 85)", "oklch(0.82 0.1 82)", "oklch(0.55 0.06 145)", "oklch(0.38 0.07 155)"].map(
              (c) => (
                <div
                  key={c}
                  className="h-10 w-10 rounded-full border border-gold/30"
                  style={{ background: c }}
                />
              ),
            )}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Cream · Champagne · Sage · Emerald
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="glass-card rounded-3xl p-10 text-center">
          <Gift className="mx-auto h-8 w-8 text-gold-deep" />
          <h3 className="mt-4 text-3xl italic">Digital Blessing</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Your duas are the greatest gift. Should you wish to add a token:
          </p>
          <div className="mt-6 rounded-2xl border border-gold/25 bg-ivory/50 p-4 text-left text-sm">
            <div className="text-xs uppercase tracking-widest text-gold-deep">UPI</div>
            <div className="mt-1 font-mono">aisha.ahmed@upi</div>
            <div className="mt-3 text-xs uppercase tracking-widest text-gold-deep">Bank</div>
            <div className="mt-1 font-mono">Al-Barakah Bank · 0012-3456-7890</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Guest book ───────────────────────────────────────────────────────────────
function GuestBook() {
  const [wishes, setWishes] = useState<{ name: string; text: string }[]>([
    { name: "Zainab", text: "Barakallahu lakuma! May your home be filled with sakinah." },
    { name: "Yusuf", text: "So happy for you both. Duas always. ✨" },
    { name: "Fatima", text: "MashaAllah, a beautiful union written in the heavens." },
  ]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  function add(e: FormEvent) {
    e.preventDefault();
    if (!name || !text) return;
    setWishes([{ name, text }, ...wishes]);
    setName("");
    setText("");
  }

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading eyebrow="Leave a Note" title="Guest Book" />
        <motion.form {...fadeUp} onSubmit={add} className="glass-card mb-10 grid gap-4 rounded-3xl p-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]">
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-w-0 rounded-xl border border-gold/25 bg-ivory/60 px-4 py-3 text-sm outline-none focus:border-gold"
          />
          <input
            placeholder="Your wish or dua…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-w-0 rounded-xl border border-gold/25 bg-ivory/60 px-4 py-3 text-sm outline-none focus:border-gold"
          />
          <button className="shrink-0 rounded-xl px-6 py-3 text-xs uppercase tracking-[0.3em] text-ivory shadow-gold" style={{ background: "var(--gradient-gold)" }}>
            <MessageCircleHeart className="inline h-4 w-4" />
          </button>
        </motion.form>
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
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative overflow-hidden bg-luxe py-20 text-center">
      <div className="bg-arabesque absolute inset-0" />
      <div className="relative mx-auto max-w-2xl px-6">
        <div className="text-xs uppercase tracking-[0.4em] text-gold-deep">With Love & Duas</div>
        <h3 className="mt-4 text-4xl italic sm:text-5xl">
          <span className="text-gold-gradient">{BRIDE}</span>
          <span className="mx-3 text-gold">&</span>
          <span className="text-gold-gradient">{GROOM}</span>
        </h3>
        <p className="mt-6 text-sm leading-relaxed text-foreground/70">
          Thank you for celebrating this beautiful journey with us.
          <br />
          We look forward to celebrating our special day with you.
        </p>
        <div className="mt-8 text-xs tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} — Made with love, InshaAllah
        </div>
      </div>
    </footer>
  );
}

// ─── Floating action toolbar ─────────────────────────────────────────────────
function Toolbar() {
  const [muted, setMuted] = useState(true);
  const [dark, setDark] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio(
        "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8e2b06e1a.mp3?filename=oud-instrumental-ambient-loop.mp3",
      );
      a.loop = true;
      a.volume = 0.35;
      audioRef.current = a;
    }
    if (muted) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
  }, [muted]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function downloadICS() {
    const dt = "20260815T163000";
    const end = "20260815T220000";
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
      <button onClick={() => setMuted((m) => !m)} className={btn} aria-label="Toggle music">
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
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  function openInvitation() {
    setOpened(true);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-luxe text-foreground">
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
      <Petals />

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
            <Blessings />
            <DressAndGift />
            <GuestBook />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {opened && <Toolbar />}
    </div>
  );
}