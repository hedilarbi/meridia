import { hotelCards } from '../../../data/home/mockOffers';

export default function OffersCarousel(){
  return (
    <section className="container mt-4">
      <h4 className="fw-bold mb-3">Offres sur les formules : -25 % ou plus</h4>
      <div className="d-flex gap-3 overflow-x-auto hide-scrollbar scroll-snap-x py-2">
        {hotelCards.map(h => (
          <div key={h.id} className="card flex-none" style={{minWidth: '300px', width: '300px'}}>
            <img src={h.img} className="card-img-top object-fit-cover" style={{height: '160px'}} alt={h.name} />
            <div className="card-body">
              {h.vip && <div className="badge bg-dark text-white mb-1">VIP Access</div>}
              <h6 className="fw-bold mb-1 small">{h.name}</h6>
              <p className="extra-small text-muted mb-1">{h.city}</p>
              <div className="text-decoration-line-through text-muted extra-small">{h.oldPrice} €</div>
              <div className="fw-bold h5 text-primary">{h.price} €</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}