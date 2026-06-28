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
