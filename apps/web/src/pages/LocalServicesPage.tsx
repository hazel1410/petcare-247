export default function LocalServicesPage() {
  const categories = [
    { emoji: '🚶', label: 'Walkers' },
    { emoji: '✂️', label: 'Groomers' },
    { emoji: '🛌', label: 'Sitters' },
    { emoji: '🎾', label: 'Trainers' },
  ];

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
      <div className="text-center" style={{ padding: '32px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Local Services</h1>
        <p className="text-muted mb-lg">
          Find trusted walkers, groomers, sitters, and trainers near you.
        </p>
        <div className="grid-2 mb-lg">
          {categories.map((cat) => (
            <div key={cat.label} className="card" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{cat.emoji}</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{cat.label}</h3>
              <button className="btn btn-ghost btn-small" disabled style={{ opacity: 0.5 }}>
                Coming soon
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
