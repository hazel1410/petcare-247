export default function CommunityPage() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Community Board</h1>

      <div className="grid-2 mb-lg">
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Lost & Found</h2>
          <p className="text-muted" style={{ marginBottom: 16 }}>
            Report lost or found pets in your area.
          </p>
          <span className="badge badge-urgent">Coming soon</span>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>General Advice</h2>
          <p className="text-muted" style={{ marginBottom: 16 }}>
            Tips, stories, and advice from fellow pet parents.
          </p>
          <span className="badge badge-urgent">Coming soon</span>
        </div>
      </div>
    </div>
  );
}
