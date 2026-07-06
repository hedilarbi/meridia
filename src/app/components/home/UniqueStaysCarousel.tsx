import { uniqueStays } from '../../../data/home/mockOffers';

export default function UniqueStaysCarousel(){
  return (
    <section className="container mt-4">
      <h4 className="fw-bold mb-3">Explorez ces séjours uniques</h4>
      <div className="d-flex gap-3 overflow-x-auto hide-scrollbar scroll-snap-x py-2">
        {uniqueStays.map(u => (
          <div key={u.id} className="card flex-none" style={{minWidth:'320px'}}>
            <img src={u.img} className="w-100 object-fit-cover" style={{height: '180px'}} alt={u.name} />
            <div className="p-3">
              <h6 className="fw-bold mb-1">{u.name}</h6>
              <p className="text-muted small mb-1">{u.loc}</p>
              <div className="fw-bold text-primary">{u.price} €</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}