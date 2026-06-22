import { useState } from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../lib/trpc.js';

export default function PetsPage() {
  const { data: pets, refetch } = trpc.pets.list.useQuery();
  const createPet = trpc.pets.create.useMutation({
    onSuccess: () => {
      refetch();
      setName('');
      setSpecies('dog');
      setBreed('');
      setAgeYears(0);
      setAgeMonths(0);
      setWeightKg(0);
      setAllergies('');
    },
  });

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat'>('dog');
  const [breed, setBreed] = useState('');
  const [ageYears, setAgeYears] = useState(0);
  const [ageMonths, setAgeMonths] = useState(0);
  const [weightKg, setWeightKg] = useState(0);
  const [allergies, setAllergies] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPet.mutate({
      name,
      species,
      breed: breed || undefined,
      ageYears: ageYears || undefined,
      ageMonths: ageMonths || undefined,
      weightKg: weightKg || undefined,
      allergies: allergies
        ? allergies.split(',').map((a) => a.trim()).filter(Boolean)
        : undefined,
    });
  };

  const emoji = (s: string) => (s === 'cat' ? '🐱' : '🐕');
  const formatAge = (y?: number | null, m?: number | null) => {
    const parts: string[] = [];
    if (y) parts.push(`${y}y`);
    if (m) parts.push(`${m}m`);
    return parts.join(' ') || 'N/A';
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingTop: 32 }}>
      <div className="flex items-center justify-between mb-lg">
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>My Pets</h1>
      </div>

      <div className="grid-2 mb-lg">
        <div>
          {!pets ? (
            <p className="text-muted">Loading...</p>
          ) : pets.length === 0 ? (
            <p className="text-muted">No pets yet. Add your first pet!</p>
          ) : (
            <div className="grid-2">
              {pets.map((pet) => (
                <Link
                  key={pet.id}
                  to={`/pets/${pet.id}`}
                  className="card card-interactive"
                  style={{ textDecoration: 'none', padding: 20 }}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{emoji(pet.species)}</div>
                  <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{pet.name}</h3>
                  <div className="text-muted" style={{ fontSize: 14, marginBottom: 2 }}>{pet.species}</div>
                  {pet.breed && <div className="text-muted" style={{ fontSize: 13 }}>{pet.breed}</div>}
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    {formatAge(pet.ageYears, pet.ageMonths)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Add a Pet</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-md">
              <label className="form-label" htmlFor="name">Name</label>
              <input id="name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group mb-md">
              <label className="form-label" htmlFor="species">Species</label>
              <select id="species" className="form-input" value={species} onChange={(e) => setSpecies(e.target.value as 'dog' | 'cat')}>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
              </select>
            </div>

            <div className="form-group mb-md">
              <label className="form-label" htmlFor="breed">Breed</label>
              <input id="breed" className="form-input" value={breed} onChange={(e) => setBreed(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div className="form-group mb-md" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="ageYears">Age (years)</label>
                <input id="ageYears" type="number" min="0" className="form-input" value={ageYears} onChange={(e) => setAgeYears(Number(e.target.value))} />
              </div>
              <div className="form-group mb-md" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="ageMonths">Age (months)</label>
                <input id="ageMonths" type="number" min="0" max="11" className="form-input" value={ageMonths} onChange={(e) => setAgeMonths(Number(e.target.value))} />
              </div>
            </div>

            <div className="form-group mb-md">
              <label className="form-label" htmlFor="weightKg">Weight (kg)</label>
              <input id="weightKg" type="number" min="0" step="0.1" className="form-input" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
            </div>

            <div className="form-group mb-md">
              <label className="form-label" htmlFor="allergies">Allergies (comma-separated)</label>
              <input id="allergies" className="form-input" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. chicken, pollen" />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={createPet.isPending}>
              {createPet.isPending ? 'Adding...' : 'Add Pet'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
