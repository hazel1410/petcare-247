import { useApp } from '../app';
import { BackHeader, Icon, Stars } from '../ui';
import { speciesEmoji } from '../mock';

export function PetsScreen() {
  const a = useApp();

  return (
    <div className="screen fade">
      <div className="pad stack">
        <h1 className="h1">My Pets</h1>

        {a.pets.length === 0 ? (
          <div className="card center stack" style={{ padding: '40px 24px' }}>
            <span style={{ fontSize: 56 }}>🐾</span>
            <p className="h3" style={{ marginTop: 8 }}>No pets yet</p>
            <p className="body muted" style={{ textAlign: 'center' }}>
              Add your first pet so a vet can see their profile instantly — even at 3am.
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: 8 }}
              onClick={() => a.go('addPet')}
            >
              ＋ Add your first pet
            </button>
          </div>
        ) : (
          <div className="stack-sm">
            {a.pets.map((p) => (
              <div
                key={p.id}
                className="card card-tap"
                onClick={() => a.go('petDetail', { petId: p.id })}
              >
                <div className="row" style={{ gap: 16, alignItems: 'center' }}>
                  <span style={{ fontSize: 44, lineHeight: 1 }}>{speciesEmoji(p.species)}</span>
                  <div className="grow stack-sm">
                    <span className="h3">{p.name}</span>
                    <span className="small muted">
                      {p.breed}
                      {p.age != null ? ` · ${p.age} yr${p.age === 1 ? '' : 's'}` : ''}
                    </span>
                  </div>
                  <Icon name="chevron" size={18} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        )}

        {a.pets.length > 0 && (
          <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => a.go('addPet')}>
            ＋ Add a pet
          </button>
        )}

        <div style={{ height: 96 }} />
      </div>
    </div>
  );
}

export function PetDetailScreen() {
  const a = useApp();
  const pet = a.pets.find((p) => p.id === a.params?.petId) ?? a.pets[0];

  if (!pet) {
    return (
      <div className="screen fade">
        <BackHeader title="Pet Detail" />
        <div className="pad stack center" style={{ paddingTop: 64 }}>
          <span style={{ fontSize: 48 }}>🐾</span>
          <p className="body muted" style={{ marginTop: 12 }}>
            No pet found. Try adding one first.
          </p>
          <button className="btn btn-primary" onClick={() => a.go('addPet')}>
            Add a pet
          </button>
        </div>
      </div>
    );
  }

  const infoTiles: { label: string; value: string }[] = [
    { label: 'Age', value: pet.age != null ? `${pet.age} yr${pet.age === 1 ? '' : 's'}` : '—' },
    { label: 'Weight', value: pet.weightKg != null ? `${pet.weightKg} kg` : '—' },
    { label: 'Color', value: pet.color || '—' },
    { label: 'Allergies', value: pet.allergies || 'None known' },
  ];

  return (
    <div className="screen fade">
      <BackHeader title={pet.name} />
      <div className="pad stack">

        {/* Hero card */}
        <div className="card center stack" style={{ padding: '28px 20px 24px' }}>
          <span style={{ fontSize: 72, lineHeight: 1 }}>{speciesEmoji(pet.species)}</span>
          <h1 className="h1" style={{ marginTop: 12, marginBottom: 2 }}>{pet.name}</h1>
          <span className="body muted">
            {pet.species}
            {pet.breed ? ` · ${pet.breed}` : ''}
          </span>
        </div>

        {/* Info grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          {infoTiles.map((tile) => (
            <div
              key={tile.label}
              className="card-flat"
              style={{ padding: '14px 16px', borderRadius: 14 }}
            >
              <span className="tiny muted" style={{ display: 'block', marginBottom: 4 }}>
                {tile.label}
              </span>
              <span className="strong small">{tile.value}</span>
            </div>
          ))}
        </div>

        {/* Likes */}
        {pet.likes && (
          <div className="card stack-sm">
            <span className="h3">😍 Likes</span>
            <p className="body muted">{pet.likes}</p>
          </div>
        )}

        {/* Dislikes */}
        {pet.dislikes && (
          <div className="card stack-sm">
            <span className="h3">😬 Dislikes</span>
            <p className="body muted">{pet.dislikes}</p>
          </div>
        )}

        {/* Records placeholder */}
        <div className="card card-tap lrow" onClick={() => {}}>
          <div className="row" style={{ gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 22 }}>💉</span>
            <div className="grow">
              <span className="h3">Records &amp; vaccines</span>
              <p className="small muted" style={{ marginTop: 2 }}>
                Upload or view health documents
              </p>
            </div>
            <Icon name="chevron" size={18} color="var(--text-muted)" />
          </div>
        </div>

        {/* CTA */}
        <button
          className="btn btn-amber"
          style={{ width: '100%', marginTop: 4 }}
          onClick={() => {
            a.patchConsult({ petId: pet.id });
            a.go('askVet');
          }}
        >
          Ask a vet about {pet.name}
        </button>

        <p className="disclaimer" style={{ textAlign: 'center' }}>
          Our vets provide guidance, not a diagnosis. In emergencies, go to your nearest ER clinic.
        </p>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
