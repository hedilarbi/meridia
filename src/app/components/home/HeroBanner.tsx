import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="container mt-4">
      <div className="rounded-4 overflow-hidden shadow-sm bg-white">
        <div className="row g-0 align-items-center">
          <div className="col-md-8">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Hero" className="w-100 object-fit-cover" style={{height: '360px'}} />
          </div>
          <div className="col-md-4 p-4">
            <div className="bg-yellow-200 rounded-3 p-4 shadow-sm">
              <h3 className="fw-bold">Grandes offres de janvier</h3>
              <p className="mb-3">Economisez plus de 25% sur certaines formules.</p>
              <Link href="#" className="btn btn-dark rounded-pill px-4 py-2">Voir les offres</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
