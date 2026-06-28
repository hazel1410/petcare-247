import { useState } from 'react';
import { useApp } from '../app';
import { BackHeader, Stars, Icon } from '../ui';
import { ER_CLINICS, TOXIC_FOODS, SERVICE_CATEGORIES, serviceCategory } from '../mock';

export function ServicesScreen() {
  const a = useApp();
  const [foodQuery, setFoodQuery] = useState('');

  const filteredFoods =
    foodQuery.trim().length === 0
      ? TOXIC_FOODS
      : TOXIC_FOODS.filter((f) => f.name.toLowerCase().includes(foodQuery.trim().toLowerCase()));

  function severityStyle(severity: string): React.CSSProperties {
    if (severity === 'Toxic') return { background: 'var(--coral)', color: '#fff' };
    if (severity === 'Caution') return { background: 'var(--amber)', color: '#fff' };
    return { background: 'var(--leaf)', color: '#fff' };
  }

  return (
    <div className="screen fade">
      <div className="pad stack">
        <h1 className="h1">Services</h1>

        {/* Book a scheduled (non-urgent) vet visit */}
        <button
          className="card card-tap"
          style={{ textAlign: 'left', cursor: 'pointer', background: 'var(--primary-soft)', border: '1px solid var(--primary)', width: '100%' }}
          onClick={() => a.go('telehealth')}
        >
          <div className="row" style={{ gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 26 }}>📅</span>
            <div className="grow">
              <span className="h3">Book a vet visit</span>
              <p className="small muted" style={{ marginTop: 2 }}>Schedule a non-urgent video or text consult</p>
            </div>
            <Icon name="chevron" size={18} color="var(--primary)" />
          </div>
        </button>

        {/* Everything for your pet — the marketplace breadth */}
        <section className="stack-sm">
          <h2 className="h2">For your pet</h2>
          <p className="small muted">Groomers, walkers, boarding, supplies & more — all in one place.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {SERVICE_CATEGORIES.map((c) => (
              <button
                key={c.id}
                className="card card-tap"
                style={{ textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)' }}
                onClick={() => a.go('serviceCategory', { categoryId: c.id })}
              >
                <div style={{ fontSize: 26, marginBottom: 6 }}>{c.emoji}</div>
                <div className="h3" style={{ fontSize: 15 }}>{c.label}</div>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <span className="tiny muted">{c.items.length} nearby</span>
                  <Icon name="chevron" size={15} color="var(--text-faint)" />
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* Emergency vets near you */}
        <section className="stack-sm">
          <h2 className="h2">Emergency vets near you</h2>
          <p className="small muted">Open right now and ready to help — no appointment needed.</p>
          <div className="stack-sm">
            {ER_CLINICS.map((clinic) => (
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
                      window.open(`https://maps.google.com/?q=${encodeURIComponent(clinic.address)}`, '_blank')
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

        {/* Can my pet eat this? */}
        <section className="stack-sm">
          <h2 className="h2">Can my pet eat this?</h2>
          <p className="small muted">Quick safety check for foods — not sure about that grape at 3am? We've got you.</p>
          <input
            className="input"
            type="search"
            placeholder="Search a food, e.g. grapes, chocolate…"
            value={foodQuery}
            onChange={(e) => setFoodQuery(e.target.value)}
          />
          {foodQuery.trim().length > 0 && filteredFoods.length === 0 && (
            <p className="small muted center">No matches found. When in doubt, ask a vet.</p>
          )}
          <div className="stack-sm">
            {filteredFoods.map((food) => (
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
            General reference only, not veterinary advice. If your pet has ingested something harmful, contact a vet
            or emergency clinic immediately.
          </p>
        </section>

        <div style={{ height: 96 }} />
      </div>
    </div>
  );
}

export function ServiceCategoryScreen() {
  const a = useApp();
  const cat = serviceCategory(a.params?.categoryId ?? 'groomers');
  const [done, setDone] = useState<Record<number, boolean>>({});

  return (
    <div className="screen fade">
      <BackHeader title={cat.label} />
      <div className="pad stack">
        <div className="row" style={{ gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 30 }}>{cat.emoji}</span>
          <div>
            <div className="h2">{cat.label}</div>
            <div className="small muted">{cat.blurb}</div>
          </div>
        </div>

        <p className="disclaimer">
          Preview — {cat.kind === 'products' ? 'checkout' : 'booking'} opens soon. We connect you to trusted local
          partners, we don't replace them.
        </p>

        <div className="stack-sm">
          {cat.items.map((it, i) => (
            <div key={it.name} className="card stack-sm">
              <div className="row-between">
                <span className="h3" style={{ fontSize: 15.5 }}>{it.name}</span>
                <span className="strong small">{it.price}</span>
              </div>
              <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                <Stars value={it.rating} size={14} />
                <span className="small muted">{it.rating.toFixed(1)}</span>
                <span className="faint">·</span>
                <span className="small muted">{it.meta}</span>
              </div>
              <button
                className={'btn btn-sm ' + (done[i] ? 'btn-ghost' : 'btn-primary')}
                style={{ width: '100%' }}
                onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
              >
                {done[i] ? '✓ We’ll be in touch' : cat.cta}
              </button>
            </div>
          ))}
        </div>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
