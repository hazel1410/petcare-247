import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './lib/store.js';
import { Layout } from './components/Layout.js';
import { HomePage } from './pages/HomePage.js';
import { SignInPage } from './pages/SignInPage.js';
import { SignUpPage } from './pages/SignUpPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { PetsPage } from './pages/PetsPage.js';
import { PetDetailPage } from './pages/PetDetailPage.js';
import { AskVetPage } from './pages/AskVetPage.js';
import { QuestionDetailPage } from './pages/QuestionDetailPage.js';
import { VetDashboardPage } from './pages/VetDashboardPage.js';
import { VetQuestionPage } from './pages/VetQuestionPage.js';
import { VetProfilePage } from './pages/VetProfilePage.js';
import { AdminPage } from './pages/AdminPage.js';
import { SymptomCheckerPage } from './pages/SymptomCheckerPage.js';
import { PoisonLookupPage } from './pages/PoisonLookupPage.js';
import { EmergencyFinderPage } from './pages/EmergencyFinderPage.js';
import { RecordsPage } from './pages/RecordsPage.js';
import { RemindersPage } from './pages/RemindersPage.js';
import { CommunityPage } from './pages/CommunityPage.js';
import { LocalServicesPage } from './pages/LocalServicesPage.js';
import { TelehealthPage } from './pages/TelehealthPage.js';
import { PetFriendlyPage } from './pages/PetFriendlyPage.js';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, role: userRole } = useAuthStore();
  if (!user) return <Navigate to="/sign-in" replace />;
  if (role && userRole !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function VetRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute role="vet">{children}</ProtectedRoute>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute role="admin">{children}</ProtectedRoute>;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/pets" element={<ProtectedRoute><PetsPage /></ProtectedRoute>} />
          <Route path="/pets/:id" element={<ProtectedRoute><PetDetailPage /></ProtectedRoute>} />
          <Route path="/ask" element={<ProtectedRoute><AskVetPage /></ProtectedRoute>} />
          <Route path="/questions/:id" element={<ProtectedRoute><QuestionDetailPage /></ProtectedRoute>} />
          <Route path="/symptom-checker" element={<ProtectedRoute><SymptomCheckerPage /></ProtectedRoute>} />
          <Route path="/poison-lookup" element={<ProtectedRoute><PoisonLookupPage /></ProtectedRoute>} />
          <Route path="/emergency-finder" element={<EmergencyFinderPage />} />
          <Route path="/records" element={<ProtectedRoute><RecordsPage /></ProtectedRoute>} />
          <Route path="/reminders" element={<ProtectedRoute><RemindersPage /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><LocalServicesPage /></ProtectedRoute>} />
          <Route path="/telehealth" element={<ProtectedRoute><TelehealthPage /></ProtectedRoute>} />
          <Route path="/pet-friendly" element={<ProtectedRoute><PetFriendlyPage /></ProtectedRoute>} />
          <Route path="/vet" element={<VetRoute><VetDashboardPage /></VetRoute>} />
          <Route path="/vet/questions/:id" element={<VetRoute><VetQuestionPage /></VetRoute>} />
          <Route path="/vets/:id" element={<VetProfilePage />} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
