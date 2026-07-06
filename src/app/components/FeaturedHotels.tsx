'use client';

import { useRouter } from 'next/navigation';

interface Hotel {
  id: string;
  name: string;
  location: string;
  country: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  tags: string[];
  petsAllowed?: boolean;
  reviewCount: number;
  region: string;
}

const FEATURED_HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'Villa Roches Rouges',
    location: 'Saint-Raphaël',
    country: 'France',
    price: 320,
    rating: 9.5,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000',
    description: "Une icône du design face à la mer, nichée entre les pins et la roche rouge de l'Esterel.",
    tags: ['Bord de mer', 'Design', 'Adapté famille'],
    petsAllowed: true,
    reviewCount: 1240,
    region: 'france',
  },
  {
    id: '2',
    name: 'Amanzoe Resplendent',
    location: 'Porto Heli',
    country: 'Grèce',
    price: 1200,
    rating: 9.8,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000',
    description: 'Sanctuaire grec offrant des vues à 360° sur le Péloponnèse, parfait pour une déconnexion totale.',
    tags: ['Ultra-Luxe', 'Piscine privée', 'Couple'],
    reviewCount: 850,
    region: 'med',
  },
  {
    id: '3',
    name: 'Castello di Reschio',
    location: 'Ombrie',
    country: 'Italie',
    price: 890,
    rating: 9.7,
    image: 'https://images.unsplash.com/photo-1551882547-ff43c61f3c33?auto=format&fit=crop&q=80&w=1000',
    description: 'Un château millénaire restauré avec une élégance brute, niché dans les collines sauvages.',
    tags: ['Historique', 'Nature', 'Animaux acceptés'],
    petsAllowed: true,
    reviewCount: 540,
    region: 'europe',
  },
  {
    id: '4',
    name: 'Ritz-Carlton Reserve',
    location: 'Ubud',
    country: 'Bali',
    price: 750,
    rating: 9.9,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1000',
    description: 'Une immersion spirituelle au cœur des rizières sacrées de Bali. Service majordome dédié.',
    tags: ['Spirituel', 'Majordome', 'Jungle'],
    reviewCount: 2100,
    region: 'intl',
  },
  {
    id: '5',
    name: 'Les Roches Blanches',
    location: 'Cassis',
    country: 'France',
    price: 580,
    rating: 9.4,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000',
    description: "Un havre de paix art déco surplombant les calanques, avec spa et restaurant étoilé.",
    tags: ['Art Déco', 'Vue mer', 'Spa'],
    reviewCount: 920,
    region: 'france',
  },
  {
    id: '6',
    name: 'Aman Tokyo',
    location: 'Tokyo',
    country: 'Japon',
    price: 950,
    rating: 9.6,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000',
    description: 'Minimalisme japonais au sommet de la ville, fusion parfaite entre tradition et modernité.',
    tags: ['Minimaliste', 'Vue panoramique', 'Gastronomie'],
    reviewCount: 1100,
    region: 'intl',
  },
];

interface FeaturedHotelsProps {
  filterRegion?: string;
}

export default function FeaturedHotels({ filterRegion = 'all' }: FeaturedHotelsProps) {
  const router = useRouter();

  const filteredHotels = filterRegion === 'all' 
    ? FEATURED_HOTELS 
    : FEATURED_HOTELS.filter(hotel => hotel.region === filterRegion);

  const handleBookClick = (hotelId: string) => {
    router.push(`/hotels/${hotelId}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Notre Sélection &quot;Elite&quot;
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Basé sur les données partenaires et les avis vérifiés.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Trié par : Notes clients
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="hotel-card bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-slate-100 flex flex-col group h-full"
          >
            {/* Image Container */}
            <div className="relative img-zoom h-56 sm:h-72">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              {/* Rating Badge */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex flex-col gap-2">
                <span className="rating-badge text-white px-3 py-1.5 rounded-xl text-sm font-extrabold flex items-center gap-1.5 shadow-lg">
                  <i className="fas fa-star text-xs"></i> {hotel.rating}
                </span>
              </div>
              {/* Price & Favorite */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex justify-between items-end">
                <div className="bg-white/90 backdrop-blur px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl">
                  <span className="text-xs text-slate-500 block font-bold uppercase tracking-tighter">
                    À partir de
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-slate-900">
                    {hotel.price}€<span className="text-xs font-normal">/nuit</span>
                  </span>
                </div>
                <button className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-sky-600 hover:text-white transition shadow-lg">
                  <i className="far fa-heart"></i>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 flex flex-col flex-1">
              {/* Location */}
              <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-widest mb-3">
                <i className="fas fa-location-dot"></i>
                <span>{hotel.location}, {hotel.country}</span>
              </div>

              {/* Hotel Name */}
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3 sm:mb-4 group-hover:text-sky-600 transition">
                {hotel.name}
              </h3>

              {/* Description */}
              <p className="text-slate-500 text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-2">
                {hotel.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                {hotel.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
                {hotel.petsAllowed && (
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <i className="fas fa-paw mr-1"></i> Animaux OK
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="mt-auto pt-4 sm:pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-slate-200"></div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-slate-300"></div>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400">
                    +{hotel.reviewCount} avis
                  </span>
                </div>
                <button
                  onClick={() => handleBookClick(hotel.id)}
                  className="text-sky-600 font-bold text-sm flex items-center gap-2 group/btn hover:gap-3 transition-all"
                >
                  Voir l&apos;offre{' '}
                  <i className="fas fa-arrow-right transition-transform group-hover/btn:translate-x-1"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <button
          onClick={() => router.push('/hotels')}
          className="btn-secondary-modern inline-flex items-center gap-2"
        >
          Voir tous les hôtels
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </section>
  );
}
