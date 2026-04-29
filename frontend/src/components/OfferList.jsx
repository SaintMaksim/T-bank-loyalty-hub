function OfferList({ offers }) {
  return (
    <section className="card">
      <h2>🎁 Акции от партнеров</h2>
      <ul className="list">
        {offers.map((offer) => (
          <li key={offer.id} className="list-item">
            <div>
              <strong>{offer.partner}</strong>
              <p className="muted">#{offer.category}</p>
            </div>
            <div className="offer-badge">{offer.cashback_percent}%</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default OfferList;
