import type { Species, Urgency } from './app';

/* Shared mock data for the prototype. Screens import what they need. */

export const SPECIES: { name: Species; emoji: string; triage: boolean }[] = [
  { name: 'Dog', emoji: '🐕', triage: true },
  { name: 'Cat', emoji: '🐈', triage: true },
  { name: 'Parrot', emoji: '🦜', triage: false },
  { name: 'Rabbit', emoji: '🐇', triage: false },
  { name: 'Other', emoji: '🐾', triage: false },
];

export const speciesEmoji = (s: Species): string =>
  SPECIES.find((x) => x.name === s)?.emoji ?? '🐾';

export interface Vet {
  id: string;
  name: string;
  initials: string;
  city: string;
  country: string;
  flag: string;
  rating: number;
  reviews: number;
  helped: number;
  years: number;
  specialty: string;
  langs: string[];
  online: boolean;
  avgReplyMin: number;
}

export const VETS: Vet[] = [
  {
    id: 'vet_aisha',
    name: 'Dr. Aisha Khan',
    initials: 'AK',
    city: 'Mumbai',
    country: 'India',
    flag: '🇮🇳',
    rating: 4.9,
    reviews: 1284,
    helped: 1240,
    years: 11,
    specialty: 'Small animals · Emergency',
    langs: ['English', 'Hindi'],
    online: true,
    avgReplyMin: 2,
  },
  {
    id: 'vet_ravi',
    name: 'Dr. Ravi Menon',
    initials: 'RM',
    city: 'Bengaluru',
    country: 'India',
    flag: '🇮🇳',
    rating: 4.8,
    reviews: 902,
    helped: 870,
    years: 8,
    specialty: 'Dogs · Internal medicine',
    langs: ['English', 'Hindi', 'Kannada'],
    online: true,
    avgReplyMin: 3,
  },
  {
    id: 'vet_sara',
    name: 'Dr. Sara Lopez',
    initials: 'SL',
    city: 'Toronto',
    country: 'Canada',
    flag: '🇨🇦',
    rating: 4.9,
    reviews: 640,
    helped: 612,
    years: 9,
    specialty: 'Cats · Feline behavior',
    langs: ['English', 'French'],
    online: false,
    avgReplyMin: 4,
  },
];

export const onlineVets = () => VETS.filter((v) => v.online);

/* Triage AI pre-screen: structured follow-up questions */
export interface PreScreenQuestion {
  id: string;
  q: string;
  options: { label: string; redAlert?: boolean }[];
}

export const PRESCREEN: PreScreenQuestion[] = [
  {
    id: 'breathing',
    q: 'Is your pet breathing normally?',
    options: [
      { label: 'Yes, breathing normally' },
      { label: 'Breathing fast but okay' },
      { label: 'Struggling to breathe', redAlert: true },
    ],
  },
  {
    id: 'alert',
    q: 'How alert is your pet right now?',
    options: [
      { label: 'Normal and responsive' },
      { label: 'A bit quiet / tired' },
      { label: 'Collapsed or unresponsive', redAlert: true },
    ],
  },
  {
    id: 'duration',
    q: 'How long has this been going on?',
    options: [
      { label: 'Just started (minutes)' },
      { label: 'A few hours' },
      { label: 'A day or more' },
    ],
  },
];

/* common symptom quick-chips for the "describe" step */
export const SYMPTOM_CHIPS = [
  'Vomiting',
  'Diarrhea',
  'Not eating',
  'Limping',
  'Lethargic',
  'Ate something',
  'Coughing',
  'Itching',
];

export interface ErClinic {
  id: string;
  name: string;
  distanceMi: number;
  open: boolean;
  phone: string;
  address: string;
}

export const ER_CLINICS: ErClinic[] = [
  { id: 'er1', name: 'Lansing Animal Emergency Hospital', distanceMi: 2.1, open: true, phone: '+1 (517) 555-0911', address: '4100 Okemos Rd' },
  { id: 'er2', name: 'MSU Veterinary Medical Center', distanceMi: 4.6, open: true, phone: '+1 (517) 555-0444', address: '736 Wilson Rd' },
  { id: 'er3', name: 'Capital Area Pet ER', distanceMi: 7.3, open: false, phone: '+1 (517) 555-0777', address: '2900 E Grand River' },
];

export interface ToxicFood {
  name: string;
  severity: 'Toxic' | 'Caution' | 'Safe';
  note: string;
}

export const TOXIC_FOODS: ToxicFood[] = [
  { name: 'Chocolate', severity: 'Toxic', note: 'Theobromine — can cause seizures. Call a vet now if eaten.' },
  { name: 'Grapes & raisins', severity: 'Toxic', note: 'Can cause kidney failure even in small amounts.' },
  { name: 'Xylitol (gum)', severity: 'Toxic', note: 'Causes a dangerous blood-sugar drop. Emergency.' },
  { name: 'Onion & garlic', severity: 'Toxic', note: 'Damages red blood cells. Avoid all forms.' },
  { name: 'Cheese', severity: 'Caution', note: 'Many dogs are lactose intolerant. Small amounts only.' },
  { name: 'Peanut butter', severity: 'Caution', note: 'Safe ONLY if xylitol-free. Check the label.' },
  { name: 'Carrot', severity: 'Safe', note: 'Great low-calorie crunchy treat.' },
  { name: 'Plain rice', severity: 'Safe', note: 'Gentle on an upset stomach.' },
];

export interface CommunityPost {
  id: string;
  author: string;
  initials: string;
  type: 'Lost' | 'Found' | 'Advice';
  time: string;
  text: string;
  likes: number;
  replies: number;
}

export const COMMUNITY_POSTS: CommunityPost[] = [
  { id: 'c1', author: 'Maria T.', initials: 'MT', type: 'Lost', time: '12m ago', text: 'Lost our orange tabby "Cheeto" near Riverfront Park. Very friendly, blue collar. Please DM!', likes: 8, replies: 3 },
  { id: 'c2', author: 'Devon K.', initials: 'DK', type: 'Found', time: '1h ago', text: 'Found a small brown dog wandering on Oak St. No tag. Keeping safe — scanning for a chip tomorrow.', likes: 22, replies: 7 },
  { id: 'c3', author: 'Priya S.', initials: 'PS', type: 'Advice', time: '3h ago', text: 'Any gentle nail-trim tips for an anxious rescue? She panics at the clippers.', likes: 14, replies: 11 },
];

export interface ServiceProvider {
  id: string;
  name: string;
  kind: string;
  rating: number;
  distanceMi: number;
}

export const SERVICES_COMING: { kind: string; emoji: string; desc: string }[] = [
  { kind: 'Groomers', emoji: '✂️', desc: 'Book a trusted local groomer' },
  { kind: 'Walkers & sitters', emoji: '🦮', desc: 'Find vetted walkers near you' },
  { kind: 'Trainers', emoji: '🎓', desc: 'Certified behavior trainers' },
  { kind: 'Pet supplies', emoji: '🛍️', desc: 'Picked for your pet’s likes' },
  { kind: 'Pet-friendly places', emoji: '📍', desc: 'Cafés, parks & hotels that welcome pets' },
];

export const URGENCY_META: Record<Urgency, { label: string; verdict: string; cls: string; emoji: string }> = {
  emergency: { label: 'Emergency', verdict: 'Go to an ER now', cls: 'urgency-emergency', emoji: '🚨' },
  soon: { label: 'See a vet soon', verdict: 'Within 24 hours', cls: 'urgency-soon', emoji: '⏱️' },
  monitor: { label: 'Safe to monitor', verdict: 'Watch at home', cls: 'urgency-monitor', emoji: '✅' },
};

export interface ServiceItem {
  name: string;
  rating: number;
  meta: string;
  price: string;
}
export interface ServiceCategory {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
  kind: 'providers' | 'products';
  cta: string;
  items: ServiceItem[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'groomers', label: 'Groomers', emoji: '✂️', blurb: 'Trusted local groomers', kind: 'providers', cta: 'Contact',
    items: [
      { name: 'Paws & Polish', rating: 4.9, meta: '1.2 mi · Mobile + salon', price: 'from $45' },
      { name: 'The Furry Spa', rating: 4.8, meta: '2.0 mi · Cats welcome', price: 'from $50' },
      { name: 'Clip & Cuddle', rating: 4.7, meta: '3.4 mi · Same-day', price: 'from $38' },
    ],
  },
  {
    id: 'walkers', label: 'Walkers & sitters', emoji: '🦮', blurb: 'Vetted walkers & sitters near you', kind: 'providers', cta: 'Book',
    items: [
      { name: 'Maya R.', rating: 5.0, meta: '0.6 mi · 320 walks', price: '$22/walk' },
      { name: 'Carlos D.', rating: 4.9, meta: '1.1 mi · Overnight ok', price: '$28/walk' },
      { name: 'Happy Tails Co.', rating: 4.8, meta: '1.9 mi · Insured', price: '$25/walk' },
    ],
  },
  {
    id: 'boarding', label: 'Boarding', emoji: '🏠', blurb: 'Safe overnight stays', kind: 'providers', cta: 'Book',
    items: [
      { name: 'Cozy Paws Boarding', rating: 4.9, meta: '2.3 mi · 24/7 staff', price: '$55/night' },
      { name: 'Wag Manor', rating: 4.7, meta: '4.0 mi · Live webcams', price: '$48/night' },
      { name: "Whiskers' Retreat", rating: 4.8, meta: '5.1 mi · Cats only', price: '$40/night' },
    ],
  },
  {
    id: 'trainers', label: 'Trainers', emoji: '🎓', blurb: 'Certified behaviour trainers', kind: 'providers', cta: 'Contact',
    items: [
      { name: 'Good Dog Academy', rating: 4.9, meta: '1.5 mi · Puppy + adult', price: 'from $60' },
      { name: 'Calm Canine', rating: 4.8, meta: '2.7 mi · Anxiety specialist', price: 'from $75' },
    ],
  },
  {
    id: 'supplies', label: 'Pet supplies', emoji: '🛍️', blurb: "Picked for your pet's likes", kind: 'products', cta: 'Add to cart',
    items: [
      { name: 'Grain-free salmon kibble', rating: 4.8, meta: "Matches Mochi's likes", price: '$34.99' },
      { name: 'Orthopedic dog bed (M)', rating: 4.9, meta: 'Best seller', price: '$59.00' },
      { name: 'Sweet-potato chews', rating: 4.7, meta: 'Mochi loves these', price: '$12.49' },
    ],
  },
  {
    id: 'places', label: 'Pet-friendly places', emoji: '📍', blurb: 'Cafés, parks & hotels that welcome pets', kind: 'providers', cta: 'Directions',
    items: [
      { name: 'Riverside Dog Park', rating: 4.9, meta: '0.8 mi · Off-leash', price: 'Free' },
      { name: 'The Daily Grind Café', rating: 4.6, meta: '1.0 mi · Patio + water bowls', price: '$' },
      { name: 'Lakeside Pet Hotel', rating: 4.7, meta: '6.2 mi · Pets stay free', price: '$$' },
    ],
  },
];

export const serviceCategory = (id: string) => SERVICE_CATEGORIES.find((c) => c.id === id) ?? SERVICE_CATEGORIES[0];

// ---- Vet-side mock data ----
export interface VetQueueItem {
  id: string;
  ownerName: string;
  petName: string;
  species: Species;
  summary: string;
  urgencyHint: Urgency;
  waitedMin: number;
  feeUsd: number;
  region: string;
}
export const VET_QUEUE: VetQueueItem[] = [
  { id: 'q1', ownerName: 'Jordan M.', petName: 'Biscuit', species: 'Dog', summary: 'Ate a small piece of chocolate ~30 min ago, now drooling.', urgencyHint: 'emergency', waitedMin: 1, feeUsd: 3.99, region: 'Austin, US 🇺🇸' },
  { id: 'q2', ownerName: 'Priya R.', petName: 'Simba', species: 'Cat', summary: 'Not eating since yesterday, hiding under the bed.', urgencyHint: 'soon', waitedMin: 4, feeUsd: 3.99, region: 'Toronto, CA 🇨🇦' },
  { id: 'q3', ownerName: 'Dana K.', petName: 'Pepper', species: 'Dog', summary: 'Limping slightly on back left leg after a long walk.', urgencyHint: 'monitor', waitedMin: 6, feeUsd: 1.99, region: 'Chicago, US 🇺🇸' },
];

export const VET_STATS = {
  name: 'Dr. Aisha Khan',
  initials: 'AK',
  answeredToday: 12,
  earningsTodayUsd: 41.4,
  rating: 4.9,
  reviews: 1284,
  helped: 1240,
  avgReplyMin: 2,
};

export interface Payout {
  date: string;
  amountUsd: number;
  status: 'Paid' | 'Pending';
  rail: string;
}
export const VET_PAYOUTS: Payout[] = [
  { date: 'Jun 15, 2025', amountUsd: 286.2, status: 'Paid', rail: 'Wise → INR' },
  { date: 'Jun 01, 2025', amountUsd: 312.75, status: 'Paid', rail: 'Wise → INR' },
  { date: 'May 15, 2025', amountUsd: 298.4, status: 'Paid', rail: 'Wise → INR' },
];
export const VET_BALANCE_USD = 154.8;

export interface TelehealthDay {
  label: string;
  times: string[];
}
export const TELEHEALTH_SLOTS: TelehealthDay[] = [
  { label: 'Today', times: ['2:00 PM', '4:30 PM', '7:00 PM'] },
  { label: 'Tomorrow', times: ['9:00 AM', '11:30 AM', '3:00 PM', '6:00 PM'] },
  { label: 'Sat', times: ['10:00 AM', '1:00 PM'] },
];

export interface Vaccine {
  name: string;
  date: string;
  due: string;
  status: 'up-to-date' | 'due-soon' | 'overdue';
}
export const VACCINES: Vaccine[] = [
  { name: 'Rabies', date: 'Mar 2025', due: 'Mar 2028', status: 'up-to-date' },
  { name: 'DHPP (distemper)', date: 'Mar 2025', due: 'Mar 2026', status: 'up-to-date' },
  { name: 'Leptospirosis', date: 'Jun 2025', due: 'Jul 2026', status: 'due-soon' },
  { name: 'Bordetella (kennel cough)', date: 'Dec 2024', due: 'Dec 2025', status: 'overdue' },
];

export interface VisitRecord {
  date: string;
  type: string;
  vet: string;
  note: string;
}
export const VISITS: VisitRecord[] = [
  { date: 'Jun 12, 2025', type: 'Triage consult', vet: 'Dr. Aisha Khan', note: 'Mild stomach upset — advised bland diet, resolved.' },
  { date: 'Mar 03, 2025', type: 'Annual checkup', vet: 'Lansing Vet Clinic', note: 'Healthy. Weight 9 kg. Vaccines updated.' },
  { date: 'Nov 20, 2024', type: 'Skin issue', vet: 'Dr. Ravi Menon', note: 'Mild allergy flare — antihistamine course.' },
];

export interface ReminderItem {
  id: string;
  title: string;
  type: 'medication' | 'feeding' | 'vaccine' | 'grooming';
  emoji: string;
  schedule: string;
  caregiver: string;
  on: boolean;
}
export const REMINDERS: ReminderItem[] = [
  { id: 'r1', title: 'Heartworm tablet', type: 'medication', emoji: '💊', schedule: '1st of every month', caregiver: 'You', on: true },
  { id: 'r2', title: 'Breakfast', type: 'feeding', emoji: '🍽️', schedule: 'Daily · 8:00 AM', caregiver: 'You & Sam', on: true },
  { id: 'r3', title: 'Dinner', type: 'feeding', emoji: '🍽️', schedule: 'Daily · 6:30 PM', caregiver: 'Sam', on: true },
  { id: 'r4', title: 'Leptospirosis booster', type: 'vaccine', emoji: '💉', schedule: 'Jul 2026', caregiver: 'You', on: true },
  { id: 'r5', title: 'Grooming appointment', type: 'grooming', emoji: '✂️', schedule: 'Every 6 weeks', caregiver: 'You', on: false },
];
