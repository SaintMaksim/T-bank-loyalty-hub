import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import LoyaltySummary from '../components/LoyaltySummary';
import OfferList from '../components/OfferList';
import { useLoyalty } from '../hooks/useLoyalty';
import { loyaltyAPI } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const { user, summary, offers, loading, error } = useLoyalty();

  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

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
    if (user?.segment === 'starter') return item.category !== 'investments';
    return true;
  });

  const handleGetRecommendation = async () => {
    try {
      setAiLoading(true);
      setAiError('');

      const text = await loyaltyAPI.getAIRecommendation();
      setAiText(text);
    } catch (e) {
      setAiError('Не удалось получить рекомендацию');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="page shell">
      <header className="topbar">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Назад
        </button>

        <h1>{user?.name}</h1>

        <ThemeToggle />
      </header>

      {summary && <LoyaltySummary summary={summary} />}

      <OfferList offers={segmentOffers} />

      <div className="card">
        <button className="btn btn-primary" onClick={handleGetRecommendation}>
          Получить рекомендацию
        </button>

        {aiLoading && <p className="muted">Загрузка...</p>}
        {aiError && <p className="error-text">{aiError}</p>}

        {aiText && (
          <p className="ai-recommendation">
            {aiText}
          </p>
        )}
      </div>

      <Link to="/analytics" className="btn btn-primary">
        Открыть аналитику
      </Link>
    </div>
  );
}

export default Dashboard;