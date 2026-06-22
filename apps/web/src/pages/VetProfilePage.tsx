import { useParams } from 'react-router-dom';

const MOCK_VET = {
  id: '1',
  name: 'Dr. Sarah Mitchell',
  rating: 4.8,
  reviewCount: 127,
  specialties: ['Internal Medicine', 'Dermatology', 'Nutrition'],
  questionsAnswered: 342,
  reviews: [
    { id: '1', author: 'Alex P.', rating: 5, text: 'Dr. Mitchell was incredibly helpful and thorough. Highly recommend!', date: '2026-05-15' },
    { id: '2', author: 'Jordan K.', rating: 4, text: 'Very knowledgeable and compassionate. Gave clear instructions for my cat.', date: '2026-04-28' },
    { id: '3', author: 'Morgan T.', rating: 5, text: 'Fast response and great advice. My dog is doing much better now.', date: '2026-04-10' },
  ],
};

export default function VetProfilePage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
        <p className="text-muted">No vet specified.</p>
      </div>
    );
  }

  const vet = MOCK_VET;

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', paddingTop: 32 }}>
      <div className="card" style={{ padding: 32, textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>👩‍⚕️</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{vet.name}</h1>

        <div style={{ fontSize: 20, color: '#FFB300', marginBottom: 8 }}>
          {renderStars(vet.rating)}
          <span className="text-muted" style={{ fontSize: 14, marginLeft: 8 }}>
            {vet.rating} ({vet.reviewCount} reviews)
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          {vet.specialties.map((s) => (
            <span key={s} className="badge" style={{ background: 'var(--color-primary-light, #E3F2FD)', textTransform: 'none' }}>
              {s}
            </span>
          ))}
        </div>

        <div className="text-muted">
          {vet.questionsAnswered} questions answered
        </div>
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Reviews</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {vet.reviews.map((review) => (
          <div key={review.id} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 600 }}>{review.author}</div>
              <div style={{ color: '#FFB300' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
            </div>
            <p style={{ lineHeight: 1.5, marginBottom: 8 }}>{review.text}</p>
            <div className="text-muted" style={{ fontSize: 12 }}>{review.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
