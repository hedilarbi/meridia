import { categories } from '../../../data/home/mockOffers';

export default function CategoriesGrid(){
  return (
    <section className="container mt-4">
      <h4 className="fw-bold mb-3">Découvrez votre nouvel hébergement préféré</h4>
      <div className="row g-3">
        {categories.map(c => (
          <div key={c.id} className="col-md-2 col-6">
            <div className="card rounded-3 overflow-hidden shadow-sm text-dark">
              <img src={c.img} className="w-100 object-fit-cover" style={{height: '120px'}} alt={c.name} />
              <div className="p-2 small fw-bold">{c.name}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}