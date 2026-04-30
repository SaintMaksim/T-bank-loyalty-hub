import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import LoyaltySummary from '../components/LoyaltySummary';
import OfferList from '../components/OfferList';
import CrossSellBlock from '../components/CrossSellBlock';
import Gamification from '../components/Gamification';
import { useLoyalty } from '../hooks/useLoyalty';

function Dashboard() {
  const navigate = useNavigate();
  const { user, summary, offers, loading, error } = useLoyalty();

  if (loading) {
    return (
      <div className="page shell center">
        <div className="spinner" />
        <p>Загружаем дашборд...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page shell center">
        <p className="error-text">{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </div>
    );
  }

  const segmentOffers = (offers || []).filter((item) => {
    if (user.segment === 'starter') return item.category !== 'investments';
    return true;
  });

  return (
    <div className="page shell">
      <header className="topbar">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <h1>{user.name}</h1>
        <ThemeToggle />
      </header>

      {summary && <LoyaltySummary summary={summary} />}

      <OfferList offers={segmentOffers} />

      {(user.segment === 'standard' || user.segment === 'premium') && <CrossSellBlock />}

      <Gamification />

      <Link to="/analytics" className="btn btn-primary">
        Открыть аналитику
      </Link>
    </div>
  );
}

export default Dashboard;