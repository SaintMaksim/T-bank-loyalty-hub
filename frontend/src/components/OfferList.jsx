import { useRef } from 'react';
import loyaltyPrograms from '../resources/loyaltyPrograms.svg';

function OfferList({ offers }) {
  const safeOffers = Array.isArray(offers) ? offers : [];
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction === 'left' ? -250 : 250,
      behavior: 'smooth',
    });
  };

  return (
    <section className="card">
      <div className="offers-header">
        <h2>
          <img src={loyaltyPrograms} className="program-card__icon" alt="" />
          Акции партнеров
        </h2>

        <div className="offers-controls">
          <button className="btn btn-secondary" onClick={() => scroll('left')}>
            ←
          </button>
          <button className="btn btn-secondary" onClick={() => scroll('right')}>
            →
          </button>
        </div>
      </div>

      <div className="offers-row" ref={scrollRef}>
        {safeOffers.map((offer) => {
          const color = '#FFDD2D';
          const description = offer.category?.replace('#', '').replace(/_/g, ' ');

          return (
            <div key={offer.id} className="offer-card"
              style={{
                background: '#FFDD2D',
                border: `2px solid ${color}`,
              }}
            >
              <div className="offer-card__top">
                <div className="offer-percent">
                  {offer.cashback_percent ? `Кэшбэк ${offer.cashback_percent}%` : 'Выгода'}
                </div>

                <div className="offer-desc">
                  {description}
                </div>
              </div>

              <div className="offer-card__bottom">
                <div className="offer-card__bottom-left">
                  <img src={offer.logo_url} alt="" />
                  <strong>{offer.partner}</strong>
                </div>

                <div
                  className="offer-card__bottom-accent"
                  style={{ background: offer.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default OfferList;