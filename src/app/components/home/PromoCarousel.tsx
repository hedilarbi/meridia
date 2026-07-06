import { promoOffers } from '../../../data/home/mockOffers';

export default function PromoCarousel() {
  return (
    <section className="container mt-4">
      <div className="rounded-4 overflow-hidden">
        <div className="d-flex gap-3 overflow-x-auto hide-scrollbar py-3 scroll-snap-x">
          {promoOffers.map((p) => (
            <div key={p.id} className="flex-none w-100 w-md-75 rounded-3 overflow-hidden position-relative" style={{minWidth: '640px'}}>
              <img src={p.image} alt={p.title} className="w-100 object-fit-cover" style={{height:'300px'}} />
              <div className="position-absolute top-3 start-3 bg-yellow-400 p-3 rounded-2 shadow-sm">
                <h5 className="mb-1 fw-bold">{p.title}</h5>
                <button className="btn btn-dark btn-sm">{p.cta}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}