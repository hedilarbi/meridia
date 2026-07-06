export const promoOffers = [
  {
    id: 'promo-1',
    title: 'Grandes offres de janvier',
    cta: "Voir l'offre",
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    badge: '25% ou plus',
  },
];

export const hotelCards = Array.from({ length: 8 }).map((_, i) => ({
  id: `hotel-${i + 1}`,
  name: `Hotel Sample ${i + 1}`,
  city: i % 2 === 0 ? 'Antalya' : 'Istanbul',
  price: 120 + i * 30,
  oldPrice: 200 + i * 50,
  rating: (8 + (i % 3) * 0.5).toFixed(1),
  img: `https://picsum.photos/seed/hotel${i + 1}/600/400`,
  vip: i % 3 === 0,
}));

export const flights = [
  { id: 'paris', name: 'Paris', price: 289 },
  { id: 'london', name: 'Londres', price: 289 },
  { id: 'rome', name: 'Rome', price: 289 },
  { id: 'ny', name: 'New York', price: 309 },
];

export const categories = [
  { id: 'apartment', name: "Appart'hotel", img: 'https://picsum.photos/seed/cat1/400/300' },
  { id: 'spa', name: 'Spa', img: 'https://picsum.photos/seed/cat2/400/300' },
  { id: 'sea', name: 'Vue sur la mer', img: 'https://picsum.photos/seed/cat3/400/300' },
  { id: 'pool', name: 'Piscine', img: 'https://picsum.photos/seed/cat4/400/300' },
  { id: 'family', name: 'Famille', img: 'https://picsum.photos/seed/cat5/400/300' },
];

export const uniqueStays = Array.from({ length: 6 }).map((_, i) => ({
  id: `unique-${i + 1}`,
  name: `Séjour unique ${i + 1}`,
  loc: 'Ragusa',
  price: 142 + i * 40,
  img: `https://picsum.photos/seed/unique${i + 1}/700/500`,
}));
