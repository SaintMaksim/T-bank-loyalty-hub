import { formatCurrency, formatNumber } from '../utils/formatters';
import loyaltyCredits from '../resources/loyaltyCredits.svg';
import blackProgram from '../resources/blackProgram.svg';
import airlinesProgram from '../resources/airplane.svg';
import platinumProgram from '../resources/platinumProgram.svg';

function LoyaltySummary({ summary }) {
  if (!summary) return null;

  return (
    <section className="card fade-in">
      <h2 className="h2-with-icon">
        <img src={loyaltyCredits} alt="Валюты кэшбека" className="h2-icon" />
        Совокупная лояльность
      </h2>

      <div className="summary-grid">
        <div className="summary-item">
          <span className="summary-item__label">
            <img src={blackProgram} className="program-card__icon" alt="" />
            Кэшбек
          </span>
          <strong className="summary-item-text">
            {formatCurrency(summary.rubles_cashback || 0)}
          </strong>
        </div>

        <div className="summary-item">
          <span className="summary-item__label">
            <img src={platinumProgram} className="program-card__icon" alt="" />
            Браво
          </span>
          <strong className="summary-item-text">
            {formatNumber(summary.bravo_points || 0)}
          </strong>
        </div>

        <div className="summary-item">
          <span className="summary-item__label">
            <img src={airlinesProgram} className="program-card__icon" alt="" />
            Мили
          </span>
          <strong className="summary-item-text">
            {formatNumber(summary.airline_miles || 0)}
          </strong>
        </div>
      </div>
    </section>
  );
}

export default LoyaltySummary;