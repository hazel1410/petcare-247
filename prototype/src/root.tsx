import { AppProvider, useApp, isTabScreen, type ScreenName, type TabName } from './app';
import { StatusBar, Icon } from './ui';
import { WelcomeScreen, AuthScreen, OtpScreen } from './screens/Onboarding';
import { OwnerProfileScreen, PetProfileScreen, AddPetScreen } from './screens/Profiles';
import { HomeScreen } from './screens/Home';
import { PetsScreen, PetDetailScreen } from './screens/Pets';
import { AskVetScreen, MatchingScreen } from './screens/Triage';
import { ConsultScreen, RateScreen, ErFallbackScreen, VetProfileScreen } from './screens/Consult';
import { ServicesScreen } from './screens/Services';
import { CommunityScreen } from './screens/Community';
import { AccountScreen } from './screens/Account';

const SCREENS: Record<ScreenName, () => JSX.Element> = {
  welcome: WelcomeScreen,
  auth: AuthScreen,
  otp: OtpScreen,
  ownerProfile: OwnerProfileScreen,
  petProfile: PetProfileScreen,
  addPet: AddPetScreen,
  home: HomeScreen,
  pets: PetsScreen,
  petDetail: PetDetailScreen,
  services: ServicesScreen,
  community: CommunityScreen,
  account: AccountScreen,
  askVet: AskVetScreen,
  matching: MatchingScreen,
  consult: ConsultScreen,
  rate: RateScreen,
  erFallback: ErFallbackScreen,
  vetProfile: VetProfileScreen,
};

const TAB_ITEMS: { t: TabName; icon: string; label: string }[] = [
  { t: 'home', icon: 'home', label: 'Home' },
  { t: 'pets', icon: 'paw', label: 'My Pets' },
  { t: 'services', icon: 'services', label: 'Services' },
  { t: 'community', icon: 'community', label: 'Community' },
  { t: 'account', icon: 'account', label: 'Account' },
];

function TabBar() {
  const { tab, setTab } = useApp();
  return (
    <div className="tabbar">
      {TAB_ITEMS.map((i) => (
        <button key={i.t} className={'tab' + (tab === i.t ? ' on' : '')} onClick={() => setTab(i.t)}>
          <Icon name={i.icon} size={22} />
          <span>{i.label}</span>
        </button>
      ))}
    </div>
  );
}

function Fab() {
  const { go } = useApp();
  return (
    <div className="fab-wrap">
      <button className="fab" onClick={() => go('askVet')} aria-label="Ask a Vet Now">
        <Icon name="paw" size={22} color="#3b2600" />
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span className="fab-title">Ask a Vet Now</span>
          <span className="fab-sub">It's 3am? We're here.</span>
        </span>
      </button>
    </div>
  );
}

function Shell() {
  const { screen } = useApp();
  const Comp = SCREENS[screen] ?? WelcomeScreen;
  const tabish = isTabScreen(screen);
  return (
    <div className="stage">
      <div className="stage-caption">🐾 PetCare 24/7 · prototype</div>
      <div className="phone">
        <div className="notch" />
        <StatusBar />
        <Comp key={screen} />
        {tabish && <Fab />}
        {tabish && <TabBar />}
      </div>
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
