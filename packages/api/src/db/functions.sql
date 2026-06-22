-- Helper functions for PetCare 24/7

CREATE OR REPLACE FUNCTION increment_questions_asked(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET questions_asked = questions_asked + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_credits_if_needed(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET credits = GREATEST(0, credits - 1)
  WHERE id = user_id AND credits > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_vet_questions_answered(vet_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE vet_profiles
  SET questions_answered = questions_answered + 1
  WHERE id = vet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update vet rating when a new review is added
CREATE OR REPLACE FUNCTION update_vet_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE vet_profiles
  SET
    rating = (SELECT ROUND(AVG(rating)::DECIMAL, 2) FROM reviews WHERE vet_id = NEW.vet_id),
    total_ratings = (SELECT COUNT(*) FROM reviews WHERE vet_id = NEW.vet_id)
  WHERE id = NEW.vet_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_inserted
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_vet_rating();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'owner')
  );

  IF NEW.raw_user_meta_data->>'role' = 'vet' THEN
    INSERT INTO public.vet_profiles (id, license_number, license_country, veterinary_school, graduation_year)
    VALUES (
      NEW.id,
      'pending',
      'US',
      'pending',
      2024
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
