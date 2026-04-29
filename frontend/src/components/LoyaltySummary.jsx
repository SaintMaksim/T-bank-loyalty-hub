import { formatCurrency, formatNumber } from '../utils/formatters';

function LoyaltySummary({ summary }) {
  return (
    <section className="card fade-in">
      <h2>💰 Совокупная лояльность</h2>
      <div className="summary-grid">
        <div className="summary-item">
          <span className="summary-item__label">Рубли кэшбэка</span>
          <strong>{formatCurrency(summary.rubles_cashback)}</strong>
        </div>
        <div className="summary-item">
          <span className="summary-item__label">Баллы Браво</span>
          <strong>{formatNumber(summary.bravo_points)}</strong>
        </div>
        <div className="summary-item">
          <span className="summary-item__label">Мили</span>
          <strong>{formatNumber(summary.airline_miles)}</strong>
        </div>
      </div>
      <p className="summary-total">Итого: {formatCurrency(summary.total_equivalent)} эквивалент</p>
    </section>
  );
}

export default LoyaltySummary;
