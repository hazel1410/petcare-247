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
  | 'vetProfile';

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

export function AppProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<ScreenName[]>(['welcome']);
  const [params, setParams] = useState<Record<string, any>>({});
  const [tab, setTabState] = useState<TabName>('home');

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [authValue, setAuthValue] = useState('');

  const [owner, setOwner] = useState<Owner | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [vetsOnline] = useState(14);

  const [consult, setConsult] = useState<ConsultDraft>(emptyConsult());

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
