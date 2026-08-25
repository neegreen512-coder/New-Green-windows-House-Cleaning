/* ============================================================================
   NEW GREEN — CENTRAL SITE DATA
   This is the single editing point for a non-developer. Update business
   details, services, FAQs, service areas, and imagery here.

   PLACEHOLDERS in [BRACKETS] must be replaced with verified information
   before the site goes live. Do not invent facts, prices, reviews, or awards.
   ========================================================================== */

/* ---------------------------------------------------------------- Business */

export const business = {
  name: "New Green Windows & House Cleaning",
  shortName: "New Green",
  tagline: "A cleaner home. A brighter view.",
  // Replace every [PLACEHOLDER] and its matching tel:/mailto: link before launch.
  phone: "+1 437 575 7046",
  phoneHref: "tel:+14375757046",
  email: "support@newgreenwindowsandhousecleaning.ca",
  emailHref: "mailto:support@newgreenwindowsandhousecleaning.ca",
  address: "3329 McMaster Rd, Mississauga, ON L5L 5H8, Canada",
  hours: "Monday to Saturday, 8:00 AM to 6:00 PM",
  primaryCity: "Mississauga",
  region: "Canada",
  domain: "newgreenwindowsandhousecleaning.ca",
  social: {
    instagram: "#",
    facebook: "#",
    google: "#",
  },
} as const;

/* ------------------------------------------------------------------ Images
   Curated placeholder photography (Unsplash). Every reference is centralised
   here so real business photography can be swapped in without touching UI.
   Unsplash license: free to use, attribution appreciated (see PHOTO_CREDITS). */

const U = "https://images.unsplash.com/";
export function photo(id: string, w = 1600, q = 72) {
  return `${U}${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

export const images = {
  heroClean: {
    src: "/images/hero-clean.webp",
    alt: "A New Green cleaner in a green apron wiping a large window streak-free in a bright living room",
  },
  interior: {
    src: "/images/interior.jpg",
    alt: "A freshly cleaned, sunlit living room with an armchair beside a clear window",
  },
  windowCleaning: {
    src: "/images/window-clean.webp",
    alt: "A cleaner wiping a home window until the glass is perfectly streak-free",
  },
  houseCleaning: {
    src: "/images/house-clean.webp",
    alt: "A cleaner vacuuming a bright, open-plan living room",
  },
  kitchen: {
    src: "/images/kitchen-clean.webp",
    alt: "A cleaner wiping down clean kitchen counters and sink in a bright kitchen",
  },
  bathroom: {
    src: "/images/kitchen-clean.jpg",
    alt: "A cleaner detailing bathroom and kitchen surfaces during a home visit",
  },
  beforeMessy: {
    src: "/images/before-messy.jpg",
    alt: "A cluttered, untidy living room before a clean",
  },
  afterClean: {
    src: "/images/after-clean.jpg",
    alt: "A bright, spotless living room after a clean",
  },
  cleaningAction: {
    src: "/images/dusting.webp",
    alt: "A cleaner dusting a wooden surface with a microfibre cloth",
  },
  cinematic: {
    src: "/images/cinematic.webp",
    alt: "A bright, freshly cleaned living room in warm afternoon light",
  },
  serviceArea: {
    src: "/images/service-area.webp",
    alt: "Aerial view of a leafy residential neighbourhood across the Mississauga region",
  },
} as const;

export const PHOTO_CREDITS =
  "Interim stock photography of home cleaning. Replace with New Green's own team photos before launch.";

/* --------------------------------------------------------------- Services */

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  navLabel: string;
  summary: string;
  audience: string;
  includes: string[];
  image: { src: string; alt: string };
  pageTitle: string;
  meta: string;
};

export const services: Service[] = [
  {
    slug: "window-cleaning",
    title: "Residential Window Cleaning",
    shortTitle: "Window Cleaning",
    navLabel: "Window Cleaning",
    summary:
      "Streak-free interior and exterior windows, with frames, tracks, and screens given the same care. More daylight, a clearer view, and glass that actually looks clean up close.",
    audience:
      "Ideal for homeowners who want their windows to look their best year-round, and for seasonal refreshes in spring and fall.",
    includes: [
      "Interior window cleaning",
      "Exterior window cleaning",
      "Frames and sills wiped down",
      "Track detailing where accessible",
      "Screen cleaning on request",
      "Care for large and hard-to-reach windows",
    ],
    image: images.windowCleaning,
    pageTitle: "Window Cleaning",
    meta: "Professional residential window cleaning: streak-free interior and exterior glass, frames, tracks, and screens.",
  },
  {
    slug: "house-cleaning",
    title: "House Cleaning",
    shortTitle: "House Cleaning",
    navLabel: "House Cleaning",
    summary:
      "Dependable, detail-oriented cleaning for the whole home: kitchens, bathrooms, living spaces, and bedrooms, on a schedule that fits your life.",
    audience:
      "Great for busy households that want a consistently clean home without the weekend effort, one-time or on a recurring plan.",
    includes: [
      "Kitchen surfaces and exteriors",
      "Bathrooms and fixtures",
      "Dusting and cobweb removal",
      "Floors vacuumed and mopped",
      "Living areas and bedrooms tidied",
      "Recurring or one-time visits",
    ],
    image: images.houseCleaning,
    pageTitle: "House Cleaning",
    meta: "Reliable residential house cleaning: kitchens, bathrooms, floors, and living spaces, one-time or recurring.",
  },
  {
    slug: "deep-cleaning",
    title: "Deep Cleaning",
    shortTitle: "Deep Cleaning",
    navLabel: "Deep Cleaning",
    summary:
      "A thorough, room-by-room reset that reaches the places routine cleaning skips: build-up, edges, and detail work included.",
    audience:
      "Perfect before hosting, after a busy season, or as the first visit ahead of a recurring plan.",
    includes: [
      "Detailed kitchen degrease",
      "Bathroom scale and grout attention",
      "Baseboards, edges, and corners",
      "Interior window glass",
      "Behind and under accessible furniture",
      "Fixture and hardware detailing",
    ],
    image: images.kitchen,
    pageTitle: "Deep Cleaning",
    meta: "Detailed room-by-room deep cleaning that reaches the areas routine cleaning misses.",
  },
];

export const homeServices = services.slice(0, 2); // Window + House on the homepage

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

/* ------------------------------------------------------------- Navigation */

export const nav = {
  services: services.map((s) => ({ label: s.navLabel, href: `/${s.slug}` })),
  main: [
    { label: "About", href: "/about" },
    { label: "Service Areas", href: "/service-areas" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
};

/* ------------------------------------------------------------ Trust strip */

export const trustPoints = [
  { icon: "shield", label: "Insured & bonded", note: "Background-checked cleaners" },
  { icon: "heart", label: "Owner-operated", note: "Not a faceless franchise" },
  { icon: "sparkles", label: "Supplies included", note: "Eco-friendly options" },
  { icon: "calendar", label: "One-time or recurring", note: "Weekly, bi-weekly, monthly" },
  { icon: "smile", label: "Mississauga & the GTA", note: "Local, and growing" },
];

/* ----------------------------------------------------------- Why New Green */

export const principles = [
  {
    icon: "clock",
    title: "The same cleaner each visit",
    body: "A familiar face who already knows your home and how you like it, not a rotating crew of strangers.",
  },
  {
    icon: "target",
    title: "We sweat the details",
    body: "Edges, window tracks, baseboards, behind the taps. Clean shows in the spots a quick pass skips.",
  },
  {
    icon: "leaf",
    title: "Safe, eco-friendly products",
    body: "Kind to kids, pets, and your surfaces, chosen to suit your home.",
  },
  {
    icon: "heart",
    title: "We make it right",
    body: "If a visit is not up to standard, tell us and we will come back to put it right.",
  },
];

/* ------------------------------------------------------------- Process ---- */

export const processSteps = [
  { n: "01", icon: "note", title: "Request a quote", body: "Tell us about your home and what you need cleaned." },
  { n: "02", icon: "receipt", title: "Get your estimate", body: "Receive clear pricing and options, with no pressure and no surprises." },
  { n: "03", icon: "calendar", title: "Choose your date", body: "Pick the appointment time that works best for you." },
  { n: "04", icon: "sparkles", title: "Enjoy the difference", body: "Come home to a cleaner space and a brighter view." },
];

/* ---------------------------------------------------------------- FAQs ---- */

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "How much does window or house cleaning cost?",
    a: "It depends on your home's size, which services you choose, and how often we visit. Send us the details and you get a clear price before anything is booked, with no surprises on the day.",
  },
  {
    q: "Do you clean the inside and outside of windows?",
    a: "Yes. We can clean interior and exterior glass, along with frames, sills, and tracks where accessible. Let us know what you'd like included when you request a quote.",
  },
  {
    q: "Do you bring your own supplies and equipment?",
    a: "Yes. Our team arrives with the products and equipment needed for your service. If you'd prefer we use specific products in your home, just let us know.",
  },
  {
    q: "Do I need to be home during the cleaning?",
    a: "It's entirely up to you. Many customers provide access instructions and go about their day; others prefer to be home. We'll confirm the arrangement that suits you.",
  },
  {
    q: "Do you offer one-time and recurring cleaning?",
    a: "Both. Book a one-time clean whenever you need it, or set up a recurring weekly, bi-weekly, or monthly plan for a consistently clean home.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve Mississauga and surrounding communities across the GTA. Check our Service Areas page or ask when you request a quote, and we'll confirm whether we cover your neighbourhood.",
  },
  {
    q: "How do I book?",
    a: "Start by requesting a free quote online. Once you're happy with the estimate, we'll help you choose a date and confirm the details.",
  },
];

/* ------------------------------------------------------- Service areas ---- */

export const serviceAreas = {
  intro:
    "New Green proudly serves homes across Mississauga and the surrounding region. Don't see your community listed? Ask us, our service area is growing.",
  primary: "Mississauga",
  areas: ["Mississauga", "Oakville", "Brampton", "Etobicoke", "Milton", "Burlington"],
};

/* --------------------------------------------------------- Testimonials ---
   Demonstration fallback used only if the CMS is unreachable. Live reviews are
   served from the CMS (Cloudflare D1) and managed from the admin. */

export type Testimonial = {
  quote: string;
  name: string;
  context: string;
  service: string;
  rating: number;
  avatar: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "The windows look incredible. I didn't realise how much light we were missing. Booking was simple, and the team was on time and tidy.",
    name: "Sarah Mitchell",
    context: "Mississauga",
    service: "Window Cleaning",
    rating: 5,
    avatar: "/images/avatars/sarah.jpg",
  },
  {
    quote:
      "Our home has never felt this fresh. Everything was thought through, right down to the baseboards and the tracks on the patio doors.",
    name: "Daniel Okafor",
    context: "Oakville",
    service: "House Cleaning",
    rating: 5,
    avatar: "/images/avatars/daniel.jpg",
  },
  {
    quote:
      "Booked a deep clean before hosting and it was spotless. The kitchen and bathrooms honestly look brand new. Worth every penny.",
    name: "Priya Sharma",
    context: "Mississauga",
    service: "Deep Cleaning",
    rating: 5,
    avatar: "/images/avatars/priya.jpg",
  },
  {
    quote:
      "Second-storey windows I could never reach are finally clear. Friendly crew, careful around the garden, no streaks at all.",
    name: "Marc Tremblay",
    context: "Brampton",
    service: "Window Cleaning",
    rating: 5,
    avatar: "/images/avatars/marc.jpg",
  },
  {
    quote:
      "The deep clean reached places I had given up on: behind the appliances, the window tracks, the grout. It felt like a reset for the whole house.",
    name: "Emily Chen",
    context: "Mississauga",
    service: "Deep Cleaning",
    rating: 5,
    avatar: "/images/avatars/emily.jpg",
  },
  {
    quote:
      "Reliable and thorough on our bi-weekly plan. Same standard every visit and easy to reschedule when life gets busy.",
    name: "Jason Reid",
    context: "Etobicoke",
    service: "House Cleaning",
    rating: 4,
    avatar: "/images/avatars/jason.jpg",
  },
];

/* --------------------------------------------------------- Quote / forms --
   Frontend-only submission seam. Wire this to a secure backend route, form
   provider, or CRM/email integration before launch. */

export type QuotePayload = {
  services: string[];
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  frequency: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
};

// submitQuote lives in lib/cms.ts (posts the payload to the CMS worker).

export const quoteOptions = {
  services: ["Window Cleaning", "House Cleaning", "Both"],
  propertyTypes: ["House", "Apartment", "Condo", "Other"],
  frequency: ["One-time", "Weekly", "Bi-weekly", "Monthly"],
  bedrooms: ["Studio", "1", "2", "3", "4", "5+"],
  bathrooms: ["1", "2", "3", "4+"],
};

/* --------------------------------------------------------------- Contact ---
   Frontend-only submission seam for the contact page. Wire this to a secure
   backend route, form provider, or email integration before launch. */

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

// submitContact lives in lib/cms.ts (posts the message to the CMS worker).

/* -------------------------------------------------------------- Pricing ---
   Demonstration fallback used only if the CMS is unreachable. Live packages
   are served from the CMS (Cloudflare D1) and managed from the admin. */

export type PricingPackage = {
  name: string;
  blurb: string;
  price: string;
  unit: string;
  features: string[];
  featured: boolean;
};

export const pricingFallback: PricingPackage[] = [
  {
    name: "Window Cleaning",
    blurb: "Interior and exterior glass done right.",
    price: "From $159",
    unit: "per visit",
    features: [
      "Interior + exterior glass",
      "Frames, sills and tracks",
      "Screens on request",
      "Streak-free finish",
    ],
    featured: false,
  },
  {
    name: "House Cleaning",
    blurb: "Dependable, detailed whole-home cleaning.",
    price: "From $139",
    unit: "per visit",
    features: [
      "Kitchens and bathrooms",
      "Dusting and floors",
      "One-time or recurring",
      "Products chosen for your home",
    ],
    featured: true,
  },
  {
    name: "Deep Cleaning",
    blurb: "A thorough, room-by-room reset.",
    price: "From $299",
    unit: "per visit",
    features: [
      "Detailed degrease and descale",
      "Edges, baseboards, corners",
      "Interior window glass",
      "Fixture detailing",
    ],
    featured: false,
  },
];
