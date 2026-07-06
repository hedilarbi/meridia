'use client';

import { useRouter } from 'next/navigation';

interface Destination {
  id: string;
  name: string;
  country: string;
  price: number;
  image: string;
}

const DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Santorin',
    country: 'Grèce',
    price: 690,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    name: 'Venise',
    country: 'Italie',
    price: 520,
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '3',
    name: 'Kyoto',
    country: 'Japon',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
  },
];

export default function DestinationsSection() {
  const router = useRouter();

  const handleDiscoverClick = (destination: Destination) => {
    router.push(`/hotels?city=${encodeURIComponent(destination.name)}`);
  };

  return (
    <section id="destinations" className="py-20 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 text-center mb-12 sm:mb-16">
        <h2 className="text-4xl sm:text-5xl font-black mb-4 sm:mb-6 text-slate-900">
          Destinations Populaires
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
          Nos experts ont sélectionné pour vous les lieux les plus prisés du moment.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {DESTINATIONS.map((destination) => (
          <div key={destination.id} className="destination-card group cursor-pointer">
            <div className="h-[350px] sm:h-[450px] rounded-[32px] sm:rounded-[48px] overflow-hidden mb-6 relative">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover transition duration-1000"
              />
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-white/40">
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                  {destination.name}, {destination.country}
                </h4>
                <p className="text-slate-600 font-semibold mb-3 sm:mb-4 italic">
                  À partir de {destination.price}€ / pers
                </p>
                <button
                  onClick={() => handleDiscoverClick(destination)}
                  className="w-full py-2.5 sm:py-3 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold hover:bg-sky-600 transition-colors"
                >
                  Découvrir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
