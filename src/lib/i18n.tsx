import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ml";

const en = {
  names: { bride: "Febi", groom: "Shahbaz" },
  loading: "Bismillah",
  hero: {
    bismillahLatin: "Bismillahir Rahmanir Rahim",
    quote:
      "“And among His signs is that He created for you mates from among yourselves so that you may find tranquility in them.”",
    quoteRef: "— Qur'an 30:21",
    together: "Together With Their Families",
    invite:
      "request the honour of your presence to celebrate the blessed occasion of their Nikah and Wedding Reception.",
    open: "Open Invitation",
  },
  countdown: {
    eyebrow: "Counting Down",
    title: "Until We Say Qabul",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
  },
  events: {
    dateDisplay: "Monday, 15 February 2027",
    title: "The Blessed Day",
    nikah: "Nikah Ceremony",
    nikahTime: "10:00 AM",
    nikahVenue: "Manna Juma Masjid",
    nikahAddress: "Manna",
    reception: "Reception",
    receptionTime: "1:00 PM",
    receptionVenue: "“Zainab” — Bride's Home",
    receptionAddress: "Puthiyatheru",
  },
  story: {
    eyebrow: "Our Journey",
    title: "Written by Allah",
    items: [
      {
        year: "2024",
        title: "First Meeting",
        body: "A chance introduction through family — a quiet salaam that changed everything.",
      },
      {
        year: "2025",
        title: "The Proposal",
        body: "Under the guidance of both families, hearts were spoken for with grace and prayer.",
      },
      {
        year: "2026",
        title: "Engagement",
        body: "A small, sacred ceremony celebrated with those closest to us.",
      },
      {
        year: "2027",
        title: "The Nikah",
        body: "InshaAllah, we begin our forever — bound by faith, love, and duas.",
      },
    ],
  },
  gallery: { eyebrow: "Moments", title: "Our Gallery" },
  schedule: {
    eyebrow: "Programme",
    title: "Wedding Schedule",
    items: [
      { time: "9:30 AM", title: "Guest Arrival" },
      { time: "10:00 AM", title: "Nikah Ceremony" },
      { time: "11:00 AM", title: "Group Photos" },
      { time: "1:00 PM", title: "Reception & Lunch" },
      { time: "3:00 PM", title: "Vote of Thanks" },
    ],
  },
  location: { eyebrow: "Find Us", title: "The Venue", directions: "Get Directions" },
  rsvp: {
    eyebrow: "Kindly Reply",
    title: "RSVP",
    name: "Full Name",
    guests: "Number of Guests",
    phone: "Phone Number",
    attendQ: "Will you attend?",
    yes: "Joyfully Accepts",
    no: "Regretfully Declines",
    message: "Special Message",
    send: "Send via WhatsApp",
    sent: "JazakAllah khair — your reply is on its way. 🌿",
  },
  blessings: {
    translit: "“Barakallahu laka wa baraka 'alayka wa jama'a baynakuma fi khayr.”",
    meaning:
      "May Allah bless your marriage, shower His mercy upon you, and unite you both in goodness.",
  },
  dress: {
    eyebrow: "Dress Code",
    title: "Traditional / Formal Attire",
    colors: "Cream · Champagne · Sage · Emerald",
  },
  contact: {
    eyebrow: "Contact & Support",
    title: "We're Here to Help",
    body: "For any assistance or enquiries, please feel free to reach out:",
    role: "Bride's Father",
    name: "Haneef",
    call: "Call",
    whatsapp: "WhatsApp",
  },
  guestbook: {
    eyebrow: "Leave a Note",
    title: "Guest Book",
    namePh: "Your name",
    wishPh: "Your wish or dua…",
  },
  footer: {
    tag: "With Love & Duas",
    thanks1: "Thank you for celebrating this beautiful journey with us.",
    thanks2: "We look forward to celebrating our special day with you.",
    made: "Made with love, InshaAllah",
  },
};

export type Translation = typeof en;

const ml: Translation = {
  names: { bride: "ഫെബി", groom: "ഷഹബാസ്" },
  loading: "ബിസ്മില്ലാഹ്",
  hero: {
    bismillahLatin: "ബിസ്മില്ലാഹി റഹ്മാനി റഹീം",
    quote:
      "“നിങ്ങൾക്ക് ശാന്തി കണ്ടെത്താനായി നിങ്ങളിൽ നിന്നു തന്നെ ഇണകളെ സൃഷ്ടിച്ചത് അവന്റെ ദൃഷ്ടാന്തങ്ങളിൽ പെട്ടതാകുന്നു.”",
    quoteRef: "— ഖുർആൻ 30:21",
    together: "ഇരു കുടുംബങ്ങളോടൊപ്പം",
    invite:
      "അവരുടെ നിക്കാഹിന്റെയും വിവാഹ സൽക്കാരത്തിന്റെയും അനുഗ്രഹീത വേളയിൽ പങ്കുചേരാൻ നിങ്ങളെ സാദരം ക്ഷണിക്കുന്നു.",
    open: "ക്ഷണക്കത്ത് തുറക്കുക",
  },
  countdown: {
    eyebrow: "കാത്തിരിപ്പിന്റെ നിമിഷങ്ങൾ",
    title: "ഖബൂൽ പറയും വരെ",
    days: "ദിവസം",
    hours: "മണിക്കൂർ",
    minutes: "മിനിറ്റ്",
    seconds: "സെക്കൻഡ്",
  },
  events: {
    dateDisplay: "2027 ഫെബ്രുവരി 15, തിങ്കളാഴ്ച",
    title: "അനുഗ്രഹീത ദിനം",
    nikah: "നിക്കാഹ്",
    nikahTime: "രാവിലെ 10:00",
    nikahVenue: "മന്ന ജുമാ മസ്ജിദ്",
    nikahAddress: "മന്ന",
    reception: "റിസപ്ഷൻ",
    receptionTime: "ഉച്ചയ്ക്ക് 1:00",
    receptionVenue: "“സൈനബ്” — വധുവിന്റെ വീട്",
    receptionAddress: "പുതിയതെരു",
  },
  story: {
    eyebrow: "ഞങ്ങളുടെ യാത്ര",
    title: "അല്ലാഹു എഴുതിയ കഥ",
    items: [
      {
        year: "2024",
        title: "ആദ്യ കാഴ്ച",
        body: "കുടുംബങ്ങളിലൂടെയുള്ള ഒരു പരിചയപ്പെടൽ — എല്ലാം മാറ്റിമറിച്ച ഒരു സലാം.",
      },
      {
        year: "2025",
        title: "വിവാഹാലോചന",
        body: "ഇരു കുടുംബങ്ങളുടെയും ആശീർവാദത്തോടെ, പ്രാർത്ഥനയോടെ ഹൃദയങ്ങൾ ഒന്നായി.",
      },
      {
        year: "2026",
        title: "നിശ്ചയം",
        body: "ഏറ്റവും പ്രിയപ്പെട്ടവരോടൊപ്പം നടന്ന ലളിതവും പവിത്രവുമായ ചടങ്ങ്.",
      },
      {
        year: "2027",
        title: "നിക്കാഹ്",
        body: "ഇൻശാ അല്ലാഹ്, വിശ്വാസത്തിലും സ്നേഹത്തിലും ദുആകളിലും ചേർന്ന് ഞങ്ങളുടെ എന്നേക്കുമുള്ള യാത്ര ആരംഭിക്കുന്നു.",
      },
    ],
  },
  gallery: { eyebrow: "നിമിഷങ്ങൾ", title: "ഞങ്ങളുടെ ഗാലറി" },
  schedule: {
    eyebrow: "പരിപാടികൾ",
    title: "വിവാഹ ക്രമം",
    items: [
      { time: "രാവിലെ 9:30", title: "അതിഥികളുടെ വരവ്" },
      { time: "രാവിലെ 10:00", title: "നിക്കാഹ്" },
      { time: "രാവിലെ 11:00", title: "ഗ്രൂപ്പ് ഫോട്ടോ" },
      { time: "ഉച്ചയ്ക്ക് 1:00", title: "റിസപ്ഷൻ & ഉച്ചഭക്ഷണം" },
      { time: "ഉച്ചകഴിഞ്ഞ് 3:00", title: "നന്ദി പ്രകാശനം" },
    ],
  },
  location: { eyebrow: "സ്ഥലം", title: "വേദി", directions: "വഴി കാണുക" },
  rsvp: {
    eyebrow: "മറുപടി അറിയിക്കുക",
    title: "RSVP",
    name: "പേര്",
    guests: "അതിഥികളുടെ എണ്ണം",
    phone: "ഫോൺ നമ്പർ",
    attendQ: "നിങ്ങൾ പങ്കെടുക്കുമോ?",
    yes: "സന്തോഷത്തോടെ പങ്കെടുക്കുന്നു",
    no: "പങ്കെടുക്കാനാവില്ല",
    message: "പ്രത്യേക സന്ദേശം",
    send: "വാട്സ്ആപ്പ് വഴി അയയ്ക്കുക",
    sent: "ജസാകല്ലാഹു ഖൈർ — നിങ്ങളുടെ മറുപടി അയച്ചു. 🌿",
  },
  blessings: {
    translit: "“ബാറകല്ലാഹു ലക വ ബാറക അലൈക വ ജമഅ ബൈനകുമാ ഫീ ഖൈർ.”",
    meaning:
      "അല്ലാഹു നിങ്ങളുടെ വിവാഹത്തെ അനുഗ്രഹിക്കുകയും, അവന്റെ കാരുണ്യം നിങ്ങളുടെ മേൽ ചൊരിയുകയും, നന്മയിൽ നിങ്ങളെ ഒന്നിപ്പിക്കുകയും ചെയ്യട്ടെ.",
  },
  dress: {
    eyebrow: "വസ്ത്രധാരണം",
    title: "പരമ്പരാഗത / ഔപചാരിക വേഷം",
    colors: "ക്രീം · ഷാംപെയ്ൻ · സേജ് · എമറാൾഡ്",
  },
  contact: {
    eyebrow: "ബന്ധപ്പെടുക",
    title: "സഹായത്തിന് ഞങ്ങളുണ്ട്",
    body: "എന്തെങ്കിലും സഹായത്തിനോ അന്വേഷണങ്ങൾക്കോ ദയവായി ബന്ധപ്പെടുക:",
    role: "വധുവിന്റെ പിതാവ്",
    name: "ഹനീഫ്",
    call: "വിളിക്കുക",
    whatsapp: "വാട്സ്ആപ്പ്",
  },
  guestbook: {
    eyebrow: "ആശംസ എഴുതുക",
    title: "അതിഥി പുസ്തകം",
    namePh: "നിങ്ങളുടെ പേര്",
    wishPh: "ആശംസയോ ദുആയോ…",
  },
  footer: {
    tag: "സ്നേഹവും ദുആയും",
    thanks1: "ഈ മനോഹര യാത്രയിൽ ഞങ്ങളോടൊപ്പം ചേർന്നതിന് നന്ദി.",
    thanks2: "ഞങ്ങളുടെ വിശേഷ ദിനം നിങ്ങളോടൊപ്പം ആഘോഷിക്കാൻ കാത്തിരിക്കുന്നു.",
    made: "സ്നേഹത്തോടെ നിർമ്മിച്ചത്, ഇൻശാ അല്ലാഹ്",
  },
};

export const translations: Record<Lang, Translation> = { en, ml };

const STORAGE_KEY = "invite-lang";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translation;
}>({ lang: "en", setLang: () => {}, t: en });

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start with "en" on both server and client so hydration matches, then
  // restore the saved choice after mount.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ml" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
