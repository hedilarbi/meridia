'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  SELECTED_HOTEL_STORAGE_KEY,
  type HotelSearchContext,
  type HotelSummary,
  type StoredSelectedHotel,
} from '@/types/hotels';

interface HotelCardProps {
  hotel: HotelSummary;
  searchContext?: HotelSearchContext;
}

export default function HotelCard({ hotel, searchContext }: HotelCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const detailHref = createHotelDetailHref(hotel, searchContext);

  const saveSelectedHotel = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const payload: StoredSelectedHotel = {
      hotel,
      searchContext,
      storedAt: Date.now(),
    };

    try {
      sessionStorage.setItem(SELECTED_HOTEL_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // The detail page can still refetch from the URL query.
    }
  };

  return (
    <div 
      className="card border-0 overflow-hidden rounded-4 shadow-sm transition"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Image Section */}
      <div className="position-relative overflow-hidden" style={{ height: '280px' }}>
        <img 
          src={hotel.image} 
          alt={hotel.name}
          className="w-100 h-100"
          style={{
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s ease'
          }}
        />
        
        {/* Rating Badge */}
        <div className="position-absolute top-0 end-0 m-3">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
            style={{
              width: '50px',
              height: '50px',
              background: hotel.rate >= 9 ? '#10b981' : hotel.rate >= 8 ? '#3b82f6' : '#f59e0b',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            {hotel.rate}
          </div>
        </div>

        {/* Stars Badge */}
        {hotel.stars && (
          <div className="position-absolute bottom-0 start-0 m-3 d-flex gap-1">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <i key={i} className="bi bi-star-fill text-warning" style={{ fontSize: '14px' }}></i>
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-2">
          <h5 className="fw-bold mb-1" style={{ fontSize: '18px', color: '#1f2937' }}>
            {hotel.name}
          </h5>
          <p className="small text-muted mb-0">
            <i className="bi bi-geo-alt me-1"></i>
            {hotel.city}
          </p>
        </div>

        {/* Services Preview */}
        {hotel.services && hotel.services.length > 0 && (
          <div className="mb-3">
            <div className="d-flex flex-wrap gap-2">
              {hotel.services.slice(0, 2).map((service, idx) => (
                <span 
                  key={idx}
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: '#f0f9ff',
                    color: '#0369a1',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}
                >
                  {service}
                </span>
              ))}
              {hotel.services.length > 2 && (
                <span 
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: '#f0f9ff',
                    color: '#0369a1',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}
                >
                  +{hotel.services.length - 2} services
                </span>
              )}
            </div>
          </div>
        )}

        {/* Meals */}
        {hotel.meals && hotel.meals.length > 0 && (
          <p className="small mb-3 text-success fw-semibold">
            <i className="bi bi-check-circle-fill me-1"></i>
            {hotel.meals[0]}
          </p>
        )}

        {/* Divider */}
        <hr className="my-3" style={{ borderColor: '#e5e7eb' }} />

        {/* Footer - Price and Action */}
        <div className="d-flex justify-content-between align-items-end">
          <div>
            <p className="text-muted small mb-1">À partir de</p>
            <h4 className="fw-bold mb-0" style={{ color: '#1f2937' }}>
              {hotel.price} €
            </h4>
          </div>
          <Link 
            href={detailHref}
            onClick={saveSelectedHotel}
            className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
            style={{
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            Voir détails
          </Link>
        </div>
      </div>

      <style jsx>{`
        .object-fit-cover {
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}

function createHotelDetailHref(
  hotel: HotelSummary,
  searchContext?: HotelSearchContext,
): string {
  const params = new URLSearchParams();

  if (searchContext) {
    params.set('city', searchContext.city);
    params.set('checkin', searchContext.checkin);
    params.set('checkout', searchContext.checkout);
    params.set('adults', String(searchContext.adults));
    params.set('currencyCode', searchContext.currencyCode);
    params.set('languageCode', searchContext.languageCode);

    if (searchContext.children !== undefined) {
      params.set('children', String(searchContext.children));
    }

    if (searchContext.rooms !== undefined) {
      params.set('rooms', String(searchContext.rooms));
    }

    if (searchContext.pageSize !== undefined) {
      params.set('pageSize', String(searchContext.pageSize));
    }
  }

  const pageIndex = hotel.searchPageIndex ?? searchContext?.pageIndex;
  if (pageIndex !== undefined) {
    params.set('pageIndex', String(pageIndex));
  }

  if (hotel.kayakKey) {
    params.set('kayakKey', hotel.kayakKey);
  }

  const query = params.toString();
  return `/hotels/${encodeURIComponent(String(hotel.id))}${query ? `?${query}` : ''}`;
}
