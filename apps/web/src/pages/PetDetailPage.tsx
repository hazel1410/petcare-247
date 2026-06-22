import { Link, useParams } from 'react-router-dom';
import { trpc } from '../lib/trpc.js';

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pet, isLoading } = trpc.pets.get.useQuery(id!);

  if (isLoading) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
        <p className="text-muted">Pet not found.</p>
        <Link to="/pets" className="btn btn-ghost mt-md">&larr; Back to Pets</Link>
      </div>
    );
  }

  const emoji = pet.species === 'cat' ? '🐱' : '🐕';
  const formatAge = () => {
    const parts: string[] = [];
    if (pet.ageYears) parts.push(`${pet.ageYears} years`);
    if (pet.ageMonths) parts.push(`${pet.ageMonths} months`);
    return parts.join(', ') || 'N/A';
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
      <Link to="/pets" className="text-muted" style={{ display: 'inline-block', marginBottom: 16, textDecoration: 'none' }}>
        &larr; Back to Pets
      </Link>

      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 56 }}>{emoji}</div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{pet.name}</h1>
            <span className="badge">{pet.species}</span>
          </div>
        </div>

        <div className="grid-2" style={{ gap: 16, marginBottom: 24 }}>
          <div>
            <div className="text-muted" style={{ fontSize: 13, marginBottom: 2 }}>Breed</div>
            <div style={{ fontWeight: 600 }}>{pet.breed || 'N/A'}</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 13, marginBottom: 2 }}>Age</div>
            <div style={{ fontWeight: 600 }}>{formatAge()}</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 13, marginBottom: 2 }}>Weight</div>
            <div style={{ fontWeight: 600 }}>{pet.weightKg ? `${pet.weightKg} kg` : 'N/A'}</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 13, marginBottom: 2 }}>Allergies</div>
            <div style={{ fontWeight: 600 }}>
              {pet.allergies?.length ? pet.allergies.join(', ') : 'None'}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div className="text-muted" style={{ fontSize: 13, marginBottom: 4 }}>Medications</div>
          <div style={{ fontWeight: 600 }}>
            {pet.meds?.length ? (
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {pet.meds.map((m: string, i: number) => <li key={i}>{m}</li>)}
              </ul>
            ) : (
              'No medications'
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Link to={`/ask?petId=${pet.id}`} className="btn btn-primary">
            Ask a Vet about {pet.name}
          </Link>
          <Link to="/records" className="btn btn-outline">
            View Records
          </Link>
        </div>
      </div>
    </div>
  );
}
