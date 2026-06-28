import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

/* ============================================================
   APP CONTRACT — the "frozen seam" every screen builds against.
   Screens import { useApp } and the types from here.
   ============================================================ */

export type Species = 'Dog' | 'Cat' | 'Parrot' | 'Rabbit' | 'Other';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  color: string;
  weightKg: string;
  age: string;
  allergies: string;
  likes: string;
  dislikes: string;
}

export interface Owner {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export type Urgency = 'emergency' | 'soon' | 'monitor';

export interface ConsultDraft {
  petId: string | null;
  description: string;
  symptoms: string[];
  answers: Record<string, string>;
  urgency: Urgency | null;
  urgencyScore: number | null; // 1..5
  vetId: string | null;
}

export type TabName = 'home' | 'pets' | 'services' | 'community' | 'account';

export type ScreenName =
  | TabName
  | 'welcome'
  | 'auth'
  | 'otp'
  | 'ownerProfile'
  | 'petProfile'
  | 'addPet'
  | 'petDetail'
  | 'askVet'
  | 'matching'
  | 'consult'
  | 'rate'
  | 'erFallback'
  | 'vetProfile'
  | 'serviceCategory'
  | 'records'
  | 'reminders';

export const TABS: TabName[] = ['home', 'pets', 'services', 'community', 'account'];
export const isTabScreen = (s: ScreenName): s is TabName => (TABS as string[]).includes(s);

const emptyConsult = (): ConsultDraft => ({
  petId: null,
  description: '',
  symptoms: [],
  answers: {},
  urgency: null,
  urgencyScore: null,
  vetId: null,
});

interface AppCtx {
  /* navigation */
  screen: ScreenName;
  tab: TabName;
  params: Record<string, any>;
  go: (s: ScreenName, params?: Record<string, any>) => void;
  back: () => void;
  setTab: (t: TabName) => void;

  /* auth (mock) */
  authMethod: 'phone' | 'email';
  authValue: string;
  setAuthMethod: (m: 'phone' | 'email') => void;
  setAuthValue: (v: string) => void;

  /* data (mock) */
  owner: Owner | null;
  setOwner: (o: Owner) => void;
  pets: Pet[];
  addPet: (p: Omit<Pet, 'id'>) => string;
  selectedPetId: string | null;
  selectPet: (id: string) => void;
  vetsOnline: number;

  /* consult flow */
  consult: ConsultDraft;
  patchConsult: (c: Partial<ConsultDraft>) => void;
  resetConsult: () => void;

  /* dev helper: jump straight into the app with seed data (used by "I already have an account") */
  seedAndEnter: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside <AppProvider>');
  return v;
}

const seedPet: Pet = {
  id: 'pet_seed',
  name: 'Mochi',
  species: 'Dog',
  breed: 'Shiba Inu',
  color: 'Cream',
  weightKg: '9',
  age: '3 yrs',
  allergies: 'Chicken',
  likes: 'Sweet potato, long walks',
  dislikes: 'Car rides, the vacuum',
};

const seedOwner: Owner = {
  name: 'Ipsita Ghosh',
  address: '221 Maple Ave, Lansing, MI',
  phone: '+1 (517) 555-0142',
  email: 'ipsita@example.com',
};

// Dev-only deep link: ?screen=<name> jumps straight to a screen (with seed data)
// so any screen can be opened/screenshotted directly. No param => normal welcome flow.
function readInitial() {
  const def = {
    stack: ['welcome'] as ScreenName[],
    params: {} as Record<string, any>,
    tab: 'home' as TabName,
    owner: null as Owner | null,
    pets: [] as Pet[],
    selectedPetId: null as string | null,
    consult: emptyConsult(),
  };
  if (typeof location === 'undefined') return def;
  const s = new URLSearchParams(location.search).get('screen') as ScreenName | null;
  if (!s) return def;
  const needsData = !['welcome', 'auth', 'otp', 'ownerProfile', 'petProfile'].includes(s);
  let consult = emptyConsult();
  let params: Record<string, any> = {};
  let stack: ScreenName[];
  let tab: TabName = 'home';
  if (isTabScreen(s)) {
    stack = [s];
    tab = s;
  } else {
    stack = ['home', s];
    if (s === 'petDetail') params = { petId: seedPet.id };
    if (s === 'vetProfile') params = { vetId: 'vet_aisha' };
    if (s === 'serviceCategory') { stack = ['services', s]; tab = 'services'; params = { categoryId: 'groomers' }; }
    if (s === 'records' || s === 'reminders') params = { petId: seedPet.id };
    if (s === 'askVet') consult = { ...consult, petId: seedPet.id };
    if (s === 'erFallback') consult = { ...consult, petId: seedPet.id, urgency: 'emergency', urgencyScore: 5 };
    if (s === 'consult' || s === 'rate' || s === 'vetProfile') {
      consult = { ...consult, petId: seedPet.id, vetId: 'vet_aisha', urgency: 'soon', urgencyScore: 3, description: 'My dog vomited twice this morning and seems a bit tired.' };
    }
  }
  return {
    stack,
    params,
    tab,
    owner: needsData ? seedOwner : null,
    pets: needsData ? [seedPet] : [],
    selectedPetId: needsData ? seedPet.id : null,
    consult,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [init] = useState(readInitial);
  const [stack, setStack] = useState<ScreenName[]>(init.stack);
  const [params, setParams] = useState<Record<string, any>>(init.params);
  const [tab, setTabState] = useState<TabName>(init.tab);

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [authValue, setAuthValue] = useState('');

  const [owner, setOwner] = useState<Owner | null>(init.owner);
  const [pets, setPets] = useState<Pet[]>(init.pets);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(init.selectedPetId);
  const [vetsOnline] = useState(14);

  const [consult, setConsult] = useState<ConsultDraft>(init.consult);

  const screen = stack[stack.length - 1];

  const go = useCallback((s: ScreenName, p: Record<string, any> = {}) => {
    setParams(p);
    if (isTabScreen(s)) {
      setTabState(s);
      setStack([s]);
    } else {
      setStack((prev) => [...prev, s]);
    }
  }, []);

  const back = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const setTab = useCallback((t: TabName) => {
    setParams({});
    setTabState(t);
    setStack([t]);
  }, []);

  const addPet = useCallback((p: Omit<Pet, 'id'>) => {
    const id = 'pet_' + Math.round(performance.now()).toString(36);
    setPets((prev) => [...prev, { ...p, id }]);
    setSelectedPetId(id);
    return id;
  }, []);

  const patchConsult = useCallback(
    (c: Partial<ConsultDraft>) => setConsult((prev) => ({ ...prev, ...c })),
    [],
  );
  const resetConsult = useCallback(() => setConsult(emptyConsult()), []);

  const seedAndEnter = useCallback(() => {
    setOwner(seedOwner);
    setPets([seedPet]);
    setSelectedPetId(seedPet.id);
    setTabState('home');
    setStack(['home']);
  }, []);

  const value: AppCtx = {
    screen,
    tab,
    params,
    go,
    back,
    setTab,
    authMethod,
    authValue,
    setAuthMethod,
    setAuthValue,
    owner,
    setOwner,
    pets,
    addPet,
    selectedPetId,
    selectPet: setSelectedPetId,
    vetsOnline,
    consult,
    patchConsult,
    resetConsult,
    seedAndEnter,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
