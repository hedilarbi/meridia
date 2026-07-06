export async function fetchHomeData(){
  // For now use local mock data via direct import (so it can be replaced by an API call when backend is ready)
  const data = await import('../data/home/mockOffers');
  return data;
}

export async function fetchHotels(query = ''){
  // Placeholder: call /api/hotels?city=... when backend provides TripAdvisor proxy
  const res = await fetch(`/api/hotels?${query}`);
  if (!res.ok) return [];
  const json = await res.json();
  return json;
}