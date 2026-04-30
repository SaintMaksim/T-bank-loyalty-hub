import { Link, useNavigate, useParams } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import LoyaltySummary from '../components/LoyaltySummary';
import OfferList from '../components/OfferList';
import CrossSellBlock from '../components/CrossSellBlock';
import Gamification from '../components/Gamification';
import { useLoyalty } from '../hooks/useLoyalty';
import loyaltyPrograms from '../resources/loyaltyPrograms.svg';

function Dashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, summary, programs, offers, loading, error } = useLoyalty(userId);

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
        <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </div>
    );
  }

  const segmentOffers = offers.filter((item) => {
    if (user.segment === 'starter') return item.category !== 'investments';
    return true;
  });

  return (
    <div className="page shell">
      <header className="topbar">
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>← Назад</button>
        <h1>{user.name}</h1>
        <ThemeToggle />
      </header>

      {summary && <LoyaltySummary summary={summary} />}

      <OfferList offers={segmentOffers} />

      {(user.segment === 'standard' || user.segment === 'premium') && <CrossSellBlock />}

      <Gamification />

      <Link to={`/analytics/${userId}`} className="btn btn-primary">
        Открыть аналитику
      </Link>
    </div>
  );
}

export default Dashboard;
