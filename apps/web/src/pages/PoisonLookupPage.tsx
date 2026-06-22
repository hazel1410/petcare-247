import { useState } from 'react';
import { lookupFoodToxic, TOXIC_FOODS } from '@petcare/shared';

const severityBadge = (severity: string) => {
  switch (severity) {
    case 'toxic': return 'badge-critical';
    case 'mild': return 'badge-urgent';
    default: return 'badge-low';
  }
};

export default function PoisonLookupPage() {
  const [query, setQuery] = useState('');
  const results = query ? lookupFoodToxic(query) : [];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingTop: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Poison Lookup</h1>
      <p className="text-muted mb-md">Search foods to see if they're toxic to your pet.</p>

      <div className="form-group mb-lg" style={{ maxWidth: 400 }}>
        <label className="form-label" htmlFor="food-search">Search food</label>
        <input
          id="food-search"
          className="form-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. chocolate, grapes..."
        />
      </div>

      {results.length > 0 && (
        <div className="grid-2 mb-lg">
          {results.map((item) => (
            <div key={item.food} className="card">
              <div className="flex items-center justify-between mb-sm">
                <h3 style={{ fontWeight: 700 }}>{item.food}</h3>
                <span className={`badge ${severityBadge(item.severity)}`}>{item.severity}</span>
              </div>
              <p className="mb-sm"><strong>Symptoms:</strong> {item.symptoms.join(', ')}</p>
              <p className="text-muted"><strong>Action:</strong> {item.actionRequired}</p>
              <p style={{ fontSize: 13, marginTop: 8 }}>Affects: {item.species.join(', ')}</p>
            </div>
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <p className="text-muted mb-lg">No matches found for "{query}".</p>
      )}

      <div className="card">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>All Toxic Foods</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TOXIC_FOODS.map((item) => (
            <div
              key={item.food}
              className="card"
              style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div>
                <span style={{ fontWeight: 600 }}>{item.food}</span>
                <span className="text-muted" style={{ fontSize: 13, marginLeft: 8 }}>
                  {item.symptoms.slice(0, 2).join(', ')}
                  {item.symptoms.length > 2 ? '...' : ''}
                </span>
              </div>
              <span className={`badge ${severityBadge(item.severity)}`}>{item.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
