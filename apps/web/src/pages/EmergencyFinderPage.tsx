import { useState } from 'react';

const MOCK_CLINICS = [
  {
    id: '1',
    name: 'City Pet Emergency Hospital',
    address: '123 Main St, Anytown, USA',
    phone: '(555) 123-4567',
    hours: 'Open 24/7',
    openNow: true,
    distanceKm: 1.2,
  },
  {
    id: '2',
    name: 'Anytown Animal Urgent Care',
    address: '456 Oak Ave, Anytown, USA',
    phone: '(555) 234-5678',
    hours: 'Mon-Sun 6am–11pm',
    openNow: true,
    distanceKm: 3.5,
  },
  {
    id: '3',
    name: 'VCA Anytown Veterinary Center',
    address: '789 Pine Rd, Anytown, USA',
    phone: '(555) 345-6789',
    hours: 'Open 24/7',
    openNow: false,
    distanceKm: 5.0,
  },
];

export default function EmergencyFinderPage() {
  const [zip, setZip] = useState('');

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Emergency Vet Finder</h1>
      <p className="text-muted mb-md">Find emergency veterinary clinics near you.</p>

      <div className="form-group mb-lg" style={{ maxWidth: 400 }}>
        <label className="form-label" htmlFor="zip">Location / ZIP Code</label>
        <input
          id="zip"
          className="form-input"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="Enter your ZIP code"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {MOCK_CLINICS.map((clinic) => (
          <div key={clinic.id} className="card">
            <div className="flex items-center justify-between mb-sm">
              <h3 style={{ fontWeight: 700 }}>{clinic.name}</h3>
              <span className={`badge ${clinic.openNow ? 'badge-low' : 'badge-critical'}`}>
                {clinic.openNow ? 'Open' : 'Closed'}
              </span>
            </div>
            <p className="text-muted" style={{ marginBottom: 4 }}>{clinic.address}</p>
            <p className="text-muted" style={{ marginBottom: 4 }}>{clinic.phone}</p>
            <p className="text-muted" style={{ marginBottom: 12 }}>{clinic.hours} &middot; {clinic.distanceKm} km away</p>
            <div className="flex" style={{ gap: 8 }}>
              <a href={`tel:${clinic.phone}`} className="btn btn-primary btn-small">
                Call Now
              </a>
              <button className="btn btn-outline btn-small">
                Get Directions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
