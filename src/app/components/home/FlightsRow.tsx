import { flights } from '../../../data/home/mockOffers';

export default function FlightsRow(){
  return (
    <section className="container mt-4">
      <h4 className="fw-bold mb-3">Découvrez des vols vers des destinations populaires</h4>
      <div className="d-flex gap-3 overflow-x-auto hide-scrollbar scroll-snap-x py-2">
        {flights.map(f => (
          <div key={f.id} className="card flex-none p-3" style={{minWidth: '220px'}}>
            <div className="fw-bold mb-2">{f.name}</div>
            <div className="fs-5 fw-bold text-primary">{f.price} €</div>
            <div className="text-muted small">aller-retour</div>
          </div>
        ))}
      </div>
    </section>
  );
}