export default function RemindersPage() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
      <div className="text-center" style={{ padding: '64px 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>⏰</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Reminders</h1>
        <p className="text-muted" style={{ marginBottom: 32, maxWidth: 450, margin: '0 auto 32px' }}>
          Set medication, feeding, and vaccine reminders so you never miss a dose.
        </p>
        <div className="card" style={{ display: 'inline-block', padding: '16px 32px', background: 'var(--color-surface-alt)' }}>
          <span className="badge badge-urgent" style={{ fontSize: 14 }}>Coming soon</span>
        </div>
      </div>
    </div>
  );
}
