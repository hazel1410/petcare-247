-- PetCare 24/7 Database Schema for Supabase

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'vet', 'admin')),
  photo_url TEXT,
  questions_asked INTEGER DEFAULT 0,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vet-specific profile data
CREATE TABLE vet_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  license_number TEXT NOT NULL,
  license_country TEXT NOT NULL,
  license_state TEXT,
  license_file_url TEXT NOT NULL,
  veterinary_school TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  online BOOLEAN DEFAULT false,
  bio TEXT,
  current_earnings_cents INTEGER DEFAULT 0,
  total_payout_cents INTEGER DEFAULT 0,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pets
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat')),
  breed TEXT,
  age_years INTEGER,
  age_months INTEGER,
  weight_kg DECIMAL(5,2),
  allergies TEXT[] DEFAULT '{}',
  medications TEXT[] DEFAULT '{}',
  medical_conditions TEXT[] DEFAULT '{}',
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical records
CREATE TABLE medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL CHECK (type IN ('vaccine', 'exam', 'lab', 'surgery', 'prescription', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  vet_name TEXT,
  record_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions (triage requests)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id),
  pet_id UUID NOT NULL REFERENCES pets(id),
  vet_id UUID REFERENCES profiles(id),
  description TEXT NOT NULL,
  symptoms TEXT[] DEFAULT '{}',
  duration TEXT,
  ai_urgency TEXT CHECK (ai_urgency IN ('critical', 'urgent', 'moderate', 'low')),
  status TEXT NOT NULL DEFAULT 'ai_screening' CHECK (status IN ('waiting', 'ai_screening', 'with_vet', 'answered', 'closed')),
  payment_status TEXT NOT NULL DEFAULT 'free' CHECK (payment_status IN ('free', 'paid', 'refunded', 'pending')),
  amount_cents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  answered_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- Vet responses
CREATE TABLE vet_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  vet_id UUID NOT NULL REFERENCES profiles(id),
  urgency_assessment TEXT NOT NULL,
  guidance TEXT NOT NULL,
  recommendation TEXT NOT NULL CHECK (recommendation IN ('emergency_now', 'vet_today', 'vet_soon', 'monitor', 'resolved')),
  follow_up_questions TEXT[] DEFAULT '{}',
  disclaimer_shown BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages (real-time chat)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  sender_role TEXT NOT NULL CHECK (sender_role IN ('owner', 'vet')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews (vet reputation)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id),
  vet_id UUID NOT NULL REFERENCES profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_id)
);

-- Reminders
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL CHECK (type IN ('medication', 'feeding', 'vaccine', 'grooming', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  cron_expression TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  assignees UUID[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community posts
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL CHECK (type IN ('lost', 'found', 'advice', 'general')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pet_photo_url TEXT,
  location TEXT,
  moderated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community comments
CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature flags
CREATE TABLE feature_flags (
  flag TEXT PRIMARY KEY,
  enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 100,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vet availability tracking
CREATE TABLE vet_availability (
  vet_id UUID PRIMARY KEY REFERENCES vet_profiles(id) ON DELETE CASCADE,
  online BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  timezone TEXT DEFAULT 'UTC'
);

-- Transactions / payouts
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID REFERENCES profiles(id),
  to_vet_id UUID REFERENCES vet_profiles(id),
  question_id UUID REFERENCES questions(id),
  amount_cents INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('question_payment', 'credit_purchase', 'payout', 'refund')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pets_owner ON pets(owner_id);
CREATE INDEX idx_questions_owner ON questions(owner_id);
CREATE INDEX idx_questions_vet ON questions(vet_id);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_questions_created ON questions(created_at DESC);
CREATE INDEX idx_messages_question ON messages(question_id);
CREATE INDEX idx_reviews_vet ON reviews(vet_id);
CREATE INDEX idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX idx_reminders_pet ON reminders(pet_id);

-- Vet online index for matching
CREATE INDEX idx_vet_availability_online ON vet_availability(online) WHERE online = true;

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read own, vets/admins can read relevant
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Vets can read owner profiles for questions" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM questions WHERE (owner_id = profiles.id OR vet_id = auth.uid()) AND auth.uid() = vet_id)
);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Vet profiles: readable by all, writable by vet or admin
CREATE POLICY "Anyone can read vet profiles" ON vet_profiles FOR SELECT USING (true);
CREATE POLICY "Vets can update own profile" ON vet_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can update vet profiles" ON vet_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Pets: owner can CRUD, vet can read assigned
CREATE POLICY "Owner manages own pets" ON pets FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Vet can read assigned pets" ON pets FOR SELECT USING (
  EXISTS (SELECT 1 FROM questions WHERE pet_id = pets.id AND vet_id = auth.uid())
);

-- Questions: owner and assigned vet can read
CREATE POLICY "Owner manages own questions" ON questions FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Vet can read available and assigned" ON questions FOR SELECT USING (
  auth.uid() = vet_id OR (status = 'ai_screening' AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'vet' AND EXISTS (
      SELECT 1 FROM vet_profiles WHERE id = auth.uid() AND verification_status = 'approved'
    )
  ))
);

-- Messages: participant can read/write
CREATE POLICY "Participants can read messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM questions WHERE id = question_id AND (owner_id = auth.uid() OR vet_id = auth.uid()))
);
CREATE POLICY "Participants can send messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM questions WHERE id = question_id AND (owner_id = auth.uid() OR vet_id = auth.uid()))
);

-- Reviews: anyone can read, owner of question can create
CREATE POLICY "Anyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Question owner can review" ON reviews FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM questions WHERE id = question_id AND owner_id = auth.uid())
);

-- Community: readable by all, authenticated can post
CREATE POLICY "Anyone can read community posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Auth user can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Author can update own posts" ON community_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Admin can moderate" ON community_posts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert default feature flags
INSERT INTO feature_flags (flag, enabled) VALUES
  ('symptom_checker', true),
  ('telehealth', true),
  ('community_board', true),
  ('lost_pet_qr', true),
  ('pet_friendly_places', true),
  ('local_services', true),
  ('poison_lookup', true),
  ('reminders', true),
  ('medical_records', true),
  ('owner_dating', false),
  ('kids_education', false),
  ('creator_tools', false),
  ('travel_planner', false),
  ('treat_subscription', false),
  ('grief_support', false),
  ('ar_games', false),
  ('exotic_pets', false)
ON CONFLICT (flag) DO NOTHING;
