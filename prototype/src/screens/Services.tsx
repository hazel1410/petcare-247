import { useState } from 'react';
import { ER_CLINICS, TOXIC_FOODS, SERVICES_COMING } from '../mock';

export function ServicesScreen() {
  const [foodQuery, setFoodQuery] = useState('');

  const filteredFoods = foodQuery.trim().length === 0
    ? TOXIC_FOODS
    : TOXIC_FOODS.filter(f =>
        f.name.toLowerCase().includes(foodQuery.trim().toLowerCase())
      );

  function severityStyle(severity: string): React.CSSProperties {
    if (severity === 'Toxic') return { background: 'var(--coral)', color: '#fff' };
    if (severity === 'Caution') return { background: 'var(--amber)', color: '#fff' };
    return { background: 'var(--leaf)', color: '#fff' };
  }

  return (
    <div className="screen fade">
      <div className="pad stack">

        <h1 className="h1">Services</h1>

        {/* Section 1 — Emergency vets near you */}
        <section className="stack-sm">
          <h2 className="h2">Emergency vets near you</h2>
          <p className="small muted">Open right now and ready to help — no appointment needed.</p>
          <div className="stack-sm">
            {ER_CLINICS.map(clinic => (
              <div key={clinic.id} className="card stack-sm">
                <div className="row-between wrap">
                  <span className="h3">{clinic.name}</span>
                  <span
                    className={clinic.open ? 'pill pill-online' : 'pill'}
                    style={clinic.open ? {} : { background: '#f1f1f1', color: '#999' }}
                  >
                    {clinic.open ? 'Open now' : 'Closed'}
                  </span>
                </div>
                <div className="row" style={{ gap: 6 }}>
                  <span className="small muted">{clinic.distanceMi} mi away</span>
                  <span className="faint">·</span>
                  <span className="small muted">{clinic.address}</span>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <a
                    href={`tel:${clinic.phone}`}
                    className="btn btn-sm btn-primary"
                    style={{ textDecoration: 'none', flex: 1, textAlign: 'center' }}
                  >
                    📞 Call
                  </a>
                  <button
                    className="btn btn-sm btn-ghost"
                    style={{ flex: 1 }}
                    onClick={() =>
                      window.open(
                        `https://maps.google.com/?q=${encodeURIComponent(clinic.address)}`,
                        '_blank'
                      )
                    }
                  >
                    📍 Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* Section 2 — Can my pet eat this? */}
        <section className="stack-sm">
          <h2 className="h2">Can my pet eat this?</h2>
          <p className="small muted">
            Quick safety check for foods — it's 3am and you're not sure about that grape? We've got you.
          </p>
          <input
            className="input"
            type="search"
            placeholder="Search a food, e.g. grapes, chocolate…"
            value={foodQuery}
            onChange={e => setFoodQuery(e.target.value)}
          />
          {foodQuery.trim().length > 0 && filteredFoods.length === 0 && (
            <p className="small muted center">No matches found. When in doubt, ask a vet.</p>
          )}
          <div className="stack-sm">
            {filteredFoods.map(food => (
              <div key={food.name} className="lrow card-flat">
                <div className="grow stack-sm" style={{ gap: 2 }}>
                  <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                    <span className="strong">{food.name}</span>
                    <span
                      className="badge"
                      style={{ ...severityStyle(food.severity), fontSize: 11, padding: '2px 8px', borderRadius: 99 }}
                    >
                      {food.severity}
                    </span>
                  </div>
                  {food.note && <span className="small muted">{food.note}</span>}
                </div>
              </div>
            ))}
          </div>
          <p className="disclaimer">
            This list is for general reference only and is not veterinary advice. If your pet has
            ingested something potentially harmful, contact a vet or emergency clinic immediately.
          </p>
        </section>

        <div className="divider" />

        {/* Section 3 — More services coming soon */}
        <section className="stack-sm coming">
          <h2 className="h2">More services</h2>
          <p className="small muted">We're building more ways to care for your pet.</p>
          <div className="stack-sm">
            {SERVICES_COMING.map(svc => (
              <div key={svc.kind} className="card lrow" style={{ alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>{svc.emoji}</span>
                <div className="grow stack-sm" style={{ gap: 2 }}>
                  <span className="h3">{svc.kind}</span>
                  <span className="small muted">{svc.desc}</span>
                </div>
                <span className="pill pill-amber" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Coming soon
                </span>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: 96 }} />
      </div>
    </div>
  );
}
