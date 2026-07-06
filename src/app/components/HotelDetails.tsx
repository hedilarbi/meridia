'use client';

import { useEffect, useMemo, useState } from 'react';
import type { HotelOffer, HotelOffersApiPayload, HotelSummary } from '@/types/hotels';

interface HotelDetailsProps {
  hotel: HotelSummary;
  checkin?: string;
  checkout?: string;
  currencyCode?: string;
  languageCode?: string;
  onBack?: () => void;
}

export default function HotelDetails({
  hotel,
  checkin,
  checkout,
  currencyCode,
  languageCode,
  onBack,
}: HotelDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [offers, setOffers] = useState<HotelOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const canFetchOffers = Boolean(hotel.kayakKey && checkin && checkout);

  useEffect(() => {
    const kayakKey = hotel.kayakKey;

    if (!kayakKey || !checkin || !checkout) {
      return;
    }

    let isActive = true;

    async function fetchOffers(key: string, checkinDate: string, checkoutDate: string) {
      setOffersLoading(true);

      const params = new URLSearchParams({
        kayakKey: key,
        checkin: checkinDate,
        checkout: checkoutDate,
        currencyCode: currencyCode ?? 'EUR',
        languageCode: languageCode ?? 'fr',
      });

      try {
        const response = await fetch(`/api/hotels/offers?${params.toString()}`);
        const payload = response.ok ? ((await response.json()) as HotelOffersApiPayload) : null;

        if (isActive) {
          setOffers(payload?.offers ?? []);
        }
      } catch {
        if (isActive) {
          setOffers([]);
        }
      } finally {
        if (isActive) {
          setOffersLoading(false);
        }
      }
    }

    void fetchOffers(kayakKey, checkin, checkout);

    return () => {
      isActive = false;
    };
  }, [hotel.kayakKey, checkin, checkout, currencyCode, languageCode]);

  const images = useMemo(() => {
    const realImages = [hotel.image, ...(hotel.images ?? [])].filter(Boolean);
    return [...new Set(realImages)];
  }, [hotel.image, hotel.images]);
  const selectedImageUrl = images[selectedImage] ?? images[0] ?? hotel.image;
  const hasCoordinates = typeof hotel.latitude === 'number' && typeof hotel.longitude === 'number';
  const bestOffer = canFetchOffers ? offers[0] : undefined;
  const otherOffers = canFetchOffers ? offers.slice(1, 4) : [];
  const publicBookingUrl = getPublicBookingUrl(hotel.bookingUrl);
  const amenityGroups = [
    { title: 'Services', values: hotel.services ?? [] },
    { title: 'Dans la chambre', values: hotel.roomEquip ?? [] },
    { title: 'Repas', values: hotel.meals ?? [] },
  ].filter((group) => group.values.length > 0);

  return (
    <div className="bg-light min-vh-100 text-dark">
      <div className="container py-4 py-lg-5">
        <button
          type="button"
          onClick={onBack}
          className="btn btn-outline-secondary btn-sm rounded-pill px-3 mb-4"
        >
          Retour aux résultats
        </button>

        <div className="row g-3 mb-5">
          <div className="col-lg-8">
            <div className="rounded-4 overflow-hidden shadow-lg detail-main-image">
              <img
                src={selectedImageUrl}
                alt={hotel.name}
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="detail-thumbs">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`detail-thumb rounded-3 overflow-hidden border-0 p-0 ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Voir l'image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${hotel.name} ${index + 1}`}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="row g-4 align-items-start">
          <div className="col-lg-8">
            <section className="card border-0 shadow-sm p-4 p-lg-5 rounded-4 mb-4">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-4 mb-4">
                <div>
                  <h1 className="fw-bold display-6 mb-3">{hotel.name}</h1>
                  <p className="text-muted mb-2">
                    <i className="bi bi-geo-alt me-2"></i>
                    {hotel.address || hotel.city}
                  </p>
                  {renderStars(hotel.stars, hotel.isSelfRated)}
                </div>

                {hotel.rate > 0 && (
                  <div className="text-md-center">
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold mb-2"
                      style={{
                        width: '72px',
                        height: '72px',
                        fontSize: '24px',
                        background: getRatingColor(hotel.rate),
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      {hotel.rate}
                    </div>
                    <p className="text-muted small mb-0">
                      {getRatingLabel(hotel.rate)}
                      {hotel.numberOfReviews ? ` · ${hotel.numberOfReviews} avis` : ''}
                    </p>
                  </div>
                )}
              </div>

              <div className="row g-3">
                {hotel.isGreatValue && (
                  <div className="col-md-6">
                    <InfoTile icon="bi-award" label="Bon rapport qualité/prix" value="Signalé par KAYAK" />
                  </div>
                )}
                {hotel.numberOfProviders && (
                  <div className="col-md-6">
                    <InfoTile
                      icon="bi-shop"
                      label="Fournisseurs"
                      value={`${hotel.numberOfProviders} fournisseur${hotel.numberOfProviders > 1 ? 's' : ''}`}
                    />
                  </div>
                )}
                {hotel.numberOfRates && (
                  <div className="col-md-6">
                    <InfoTile
                      icon="bi-tags"
                      label="Offres"
                      value={`${hotel.numberOfRates} offre${hotel.numberOfRates > 1 ? 's' : ''}`}
                    />
                  </div>
                )}
                {hotel.distance && (
                  <div className="col-md-6">
                    <InfoTile icon="bi-signpost" label="Distance" value={`${hotel.distance.toFixed(1)} km`} />
                  </div>
                )}
              </div>
            </section>

            <section className="card border-0 shadow-sm p-4 p-lg-5 rounded-4 mb-4">
              <h2 className="h4 fw-bold mb-4">Informations hôtel</h2>
              <div className="row g-3">
                <DetailRow label="Ville" value={hotel.city} />
                <DetailRow label="Pays" value={hotel.countryCode} />
                <DetailRow label="Adresse" value={hotel.address} />
                <DetailRow
                  label="Coordonnées"
                  value={hasCoordinates ? `${hotel.latitude}, ${hotel.longitude}` : undefined}
                />
              </div>

              {hasCoordinates && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary rounded-pill px-4 mt-4"
                >
                  Voir sur la carte
                </a>
              )}
            </section>

            {amenityGroups.length > 0 && (
              <section className="card border-0 shadow-sm p-4 p-lg-5 rounded-4">
                <h2 className="h4 fw-bold mb-4">Équipements et options</h2>
                <div className="d-flex flex-column gap-4">
                  {amenityGroups.map((group) => (
                    <div key={group.title}>
                      <h3 className="h6 fw-bold mb-3">{group.title}</h3>
                      <div className="row g-2">
                        {group.values.map((value) => (
                          <div key={value} className="col-md-6">
                            <div className="p-3 rounded-3 bg-light d-flex gap-2 align-items-start">
                              <i className="bi bi-check-circle-fill text-success mt-1"></i>
                              <span className="small fw-semibold">{value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="col-lg-4">
            <aside className="card border-0 shadow-lg p-4 p-lg-5 rounded-4 sticky-lg-top offer-card">
              <div className="mb-4 pb-4 border-bottom">
                <p className="text-muted small mb-1">À partir de</p>
                <h2 className="fw-bold text-primary mb-1">{formatPrice(hotel.price)}</h2>
                {hotel.highestRate && hotel.highestRate > hotel.price && (
                  <p className="text-muted small mb-0">Jusqu&apos;à {formatPrice(hotel.highestRate)}</p>
                )}
              </div>

              {offersLoading ? (
                <button
                  type="button"
                  disabled
                  className="btn btn-outline-secondary btn-lg w-100 rounded-pill fw-bold py-3 mb-3"
                >
                  Recherche des offres...
                </button>
              ) : bestOffer ? (
                <a
                  href={bestOffer.bookUri}
                  target="_blank"
                  rel="noreferrer sponsored"
                  className="btn btn-primary btn-lg w-100 rounded-pill fw-bold py-3 mb-3 shadow-sm"
                >
                  Voir l&apos;offre chez {bestOffer.providerName}
                </a>
              ) : publicBookingUrl ? (
                <a
                  href={publicBookingUrl}
                  target="_blank"
                  rel="noreferrer sponsored"
                  className="btn btn-primary btn-lg w-100 rounded-pill fw-bold py-3 mb-3 shadow-sm"
                >
                  Voir l&apos;offre
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="btn btn-outline-secondary btn-lg w-100 rounded-pill fw-bold py-3 mb-3"
                >
                  Lien fournisseur indisponible
                </button>
              )}

              <p className="text-center text-muted extra-small mb-0">
                Meridia est un annuaire. Les offres sont finalisées sur KAYAK ou chez le fournisseur.
              </p>

              {otherOffers.length > 0 && (
                <div className="d-flex flex-column gap-2 mt-3 pt-3 border-top">
                  <p className="text-muted extra-small text-uppercase fw-bold mb-1">
                    Autres fournisseurs
                  </p>
                  {otherOffers.map((offer, index) => (
                    <a
                      key={`${offer.providerName}-${index}`}
                      href={offer.bookUri}
                      target="_blank"
                      rel="noreferrer sponsored"
                      className="d-flex justify-content-between align-items-center small text-decoration-none"
                    >
                      <span>{offer.providerName}</span>
                      <span className="fw-bold">{formatPrice(offer.totalRate)}</span>
                    </a>
                  ))}
                </div>
              )}

              <div className="d-flex flex-column gap-3 mt-4">
                {hotel.numberOfProviders && (
                  <OfferFact icon="bi-shop" text={`${hotel.numberOfProviders} fournisseur${hotel.numberOfProviders > 1 ? 's' : ''}`} />
                )}
                {hotel.numberOfRates && (
                  <OfferFact icon="bi-tags" text={`${hotel.numberOfRates} offre${hotel.numberOfRates > 1 ? 's' : ''} disponible${hotel.numberOfRates > 1 ? 's' : ''}`} />
                )}
                {hotel.kayakKey && (
                  <OfferFact icon="bi-key" text={`Référence KAYAK ${hotel.kayakKey}`} />
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-main-image {
          height: 460px;
        }
        .detail-thumbs {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
          height: 460px;
        }
        .detail-thumb {
          min-height: 0;
          opacity: 0.72;
          transition: opacity 0.2s ease, transform 0.2s ease;
          background: #e5e7eb;
        }
        .detail-thumb.active,
        .detail-thumb:hover {
          opacity: 1;
          transform: translateY(-2px);
        }
        .offer-card {
          top: 6.5rem;
        }
        .extra-small {
          font-size: 0.75rem;
        }
        @media (max-width: 991.98px) {
          .detail-main-image,
          .detail-thumbs {
            height: auto;
          }
          .detail-main-image {
            aspect-ratio: 16 / 10;
          }
          .detail-thumbs {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
          .detail-thumb {
            aspect-ratio: 1 / 1;
          }
        }
      `}</style>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="p-3 rounded-3 bg-light h-100 d-flex gap-3 align-items-start">
      <i className={`bi ${icon} text-primary fs-5`}></i>
      <div>
        <p className="text-muted extra-small text-uppercase fw-bold mb-1">{label}</p>
        <p className="fw-semibold mb-0">{value}</p>
      </div>
      <style jsx>{`
        .extra-small {
          font-size: 0.72rem;
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (value === undefined || value === '') {
    return null;
  }

  return (
    <div className="col-md-6">
      <p className="text-muted small fw-bold mb-1">{label}</p>
      <p className="mb-0">{value}</p>
    </div>
  );
}

function OfferFact({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="d-flex gap-2 align-items-start">
      <i className={`bi ${icon} text-success`}></i>
      <span className="small">{text}</span>
    </div>
  );
}

function renderStars(stars: number | undefined, isSelfRated: boolean | undefined) {
  if (!stars) {
    return null;
  }

  return (
    <div className="mb-2">
      {Array.from({ length: stars }).map((_, index) => (
        <i
          key={index}
          className="bi bi-star-fill text-warning me-1"
          style={{ fontSize: '16px' }}
        ></i>
      ))}
      <span className="text-muted small ms-2">
        {stars} étoiles{isSelfRated ? ' auto-déclarées' : ''}
      </span>
    </div>
  );
}

function getRatingLabel(rate: number): string {
  if (rate >= 9) return 'Excellent';
  if (rate >= 8) return 'Très bien';
  if (rate >= 7) return 'Bien';
  return 'Note voyageurs';
}

function getRatingColor(rate: number): string {
  if (rate >= 9) return '#10b981';
  if (rate >= 8) return '#3b82f6';
  return '#f59e0b';
}

function formatPrice(price: number): string {
  if (!price) {
    return 'Prix à confirmer';
  }

  return `${Math.round(price)} €`;
}

function getPublicBookingUrl(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);

    if (url.pathname.startsWith('/api/')) {
      return undefined;
    }

    return url.toString();
  } catch {
    return undefined;
  }
}
