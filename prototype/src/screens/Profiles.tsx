import { useState } from 'react';
import { useApp, type Species, type Gender } from '../app';
import { BackHeader } from '../ui';
import { SPECIES } from '../mock';

/* ================================================================
   Internal shared pet form — used by PetProfileScreen & AddPetScreen
   ================================================================ */

interface PetFormProps {
  headerTitle: string;
  stepLabel?: string;
  onSave: (pet: {
    name: string;
    species: Species;
    gender: Gender;
    breed: string;
    color: string;
    weightKg: string;
    age: string;
    allergies: string;
    likes: string;
    dislikes: string;
  }) => void;
}

function PetForm({ headerTitle, stepLabel, onSave }: PetFormProps) {
  const a = useApp();
  const [species, setSpecies] = useState<Species | ''>('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [age, setAge] = useState('');
  const [allergies, setAllergies] = useState('');
  const [likes, setLikes] = useState('');
  const [dislikes, setDislikes] = useState('');

  const selectedSpecies = SPECIES.find(s => s.name === species);
  const canSave = name.trim().length > 0 && species !== '';

  function handleSave() {
    if (!canSave) return;
    onSave({
      name: name.trim(),
      species: species as Species,
      gender: (gender || 'unknown') as Gender,
      breed: breed.trim(),
      color: color.trim(),
      weightKg: weightKg.trim(),
      age: age.trim(),
      allergies: allergies.trim(),
      likes: likes.trim(),
      dislikes: dislikes.trim(),
    });
  }

  return (
    <div className="screen fade">
      <BackHeader title={headerTitle} />
      <div className="pad stack">

        {stepLabel && (
          <div className="row row-between" style={{ marginBottom: -4 }}>
            <span className="small muted">{stepLabel}</span>
          </div>
        )}

        <div className="stack-sm">
          <h1 className="h2">About your pet</h1>
          <p className="body muted">
            A little context helps your vet give the right care right away.
          </p>
        </div>

        {/* ── Species selector ── */}
        <div className="field">
          <span className="field-label">Species</span>
          <div className="chips" style={{ marginTop: 8 }}>
            {SPECIES.map(s => (
              <button
                key={s.name}
                type="button"
                className={`chip${species === s.name ? ' on' : ''}`}
                onClick={() => setSpecies(s.name)}
              >
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
          {selectedSpecies && selectedSpecies.triage === false && (
            <p className="small muted" style={{ marginTop: 8 }}>
              Emergency triage launches for dogs &amp; cats first — you can still
              keep {selectedSpecies.name} records.
            </p>
          )}
        </div>

        {/* ── Gender (themes the app) ── */}
        <div className="field">
          <span className="field-label">Gender</span>
          <div className="chips" style={{ marginTop: 8 }}>
            {([['female', '♀ Female'], ['male', '♂ Male'], ['unknown', 'Prefer not to say']] as const).map(
              ([g, label]) => (
                <button
                  key={g}
                  type="button"
                  className={`chip${gender === g ? ' on' : ''}`}
                  onClick={() => {
                    setGender(g);
                    a.setThemeGender(g === 'unknown' ? null : g);
                  }}
                >
                  {label}
                </button>
              ),
            )}
          </div>
          <p className="field-hint">
            {gender === 'female'
              ? "We'll tint the app in a warm rose 🌹"
              : gender === 'male'
                ? "We'll tint the app in a calm blue 🔵"
                : "Pick one and the app takes on your pet's color ✨"}
          </p>
        </div>

        {/* ── Name ── */}
        <div className="field">
          <label className="field-label">Pet name</label>
          <input
            className="input"
            placeholder="e.g. Luna"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* ── Breed ── */}
        <div className="field">
          <label className="field-label">Breed</label>
          <input
            className="input"
            placeholder="e.g. Golden Retriever"
            value={breed}
            onChange={e => setBreed(e.target.value)}
          />
        </div>

        {/* ── Color ── */}
        <div className="field">
          <label className="field-label">Color / markings</label>
          <input
            className="input"
            placeholder="e.g. Golden with a white chest"
            value={color}
            onChange={e => setColor(e.target.value)}
          />
        </div>

        {/* ── Weight + Age side-by-side ── */}
        <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
          <div className="field grow">
            <label className="field-label">Weight (kg)</label>
            <input
              className="input"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 12"
              value={weightKg}
              onChange={e => setWeightKg(e.target.value)}
            />
          </div>
          <div className="field grow">
            <label className="field-label">Age</label>
            <input
              className="input"
              placeholder="e.g. 3 yrs"
              value={age}
              onChange={e => setAge(e.target.value)}
            />
          </div>
        </div>

        {/* ── Allergies ── */}
        <div className="field">
          <label className="field-label">Known allergies</label>
          <input
            className="input"
            placeholder="e.g. pollen, chicken — or none"
            value={allergies}
            onChange={e => setAllergies(e.target.value)}
          />
        </div>

        {/* ── Likes ── */}
        <div className="field">
          <label className="field-label">Likes</label>
          <textarea
            className="textarea"
            rows={2}
            placeholder="e.g. tuna treats, belly rubs, morning walks…"
            value={likes}
            onChange={e => setLikes(e.target.value)}
          />
          <p className="field-hint">
            Helps us recommend the right food &amp; products for your pet.
          </p>
        </div>

        {/* ── Dislikes ── */}
        <div className="field">
          <label className="field-label">Dislikes</label>
          <textarea
            className="textarea"
            rows={2}
            placeholder="e.g. loud noises, car rides, strangers…"
            value={dislikes}
            onChange={e => setDislikes(e.target.value)}
          />
          <p className="field-hint">
            Helps us recommend the right food &amp; products for your pet.
          </p>
        </div>

        <button
          className="btn btn-primary"
          disabled={!canSave}
          onClick={handleSave}
        >
          Save pet
        </button>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}

/* ================================================================
   OwnerProfileScreen — Step 1 of 2
   ================================================================ */

export function OwnerProfileScreen() {
  const a = useApp();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(
    a.authMethod === 'phone' ? a.authValue : '',
  );
  const [email, setEmail] = useState(
    a.authMethod === 'email' ? a.authValue : '',
  );

  function handleContinue() {
    a.setOwner({ name: name.trim(), address: address.trim(), phone: phone.trim(), email: email.trim() });
    a.go('petProfile');
  }

  return (
    <div className="screen fade">
      <BackHeader title="Your profile" />
      <div className="pad stack">

        <div className="row row-between" style={{ marginBottom: -4 }}>
          <span className="small muted">Step 1 of 2</span>
        </div>

        <div className="stack-sm">
          <h1 className="h2">A little about you</h1>
          <p className="body muted">So your vet knows who they're helping.</p>
        </div>

        <div className="field">
          <label className="field-label">Full name</label>
          <input
            className="input"
            placeholder="Your full name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label">Address</label>
          <input
            className="input"
            placeholder="City, state — or full address"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label">Phone number</label>
          <input
            className="input"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label">Email address</label>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          disabled={!name.trim()}
          onClick={handleContinue}
        >
          Continue
        </button>

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

/* ================================================================
   PetProfileScreen — Step 2 of 2 (onboarding flow)
   ================================================================ */

export function PetProfileScreen() {
  const a = useApp();
  return (
    <PetForm
      headerTitle="Add your pet"
      stepLabel="Step 2 of 2"
      onSave={pet => {
        a.addPet(pet);
        a.setTab('home');
      }}
    />
  );
}

/* ================================================================
   AddPetScreen — standalone "add another pet" flow
   ================================================================ */

export function AddPetScreen() {
  const a = useApp();
  return (
    <PetForm
      headerTitle="Add a pet"
      onSave={pet => {
        a.addPet(pet);
        a.go('pets');
      }}
    />
  );
}
