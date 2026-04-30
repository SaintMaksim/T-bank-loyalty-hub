import { useEffect, useState } from 'react';
import { loyaltyAPI } from '../services/api';

export function useLoyalty() {
  const [data, setData] = useState({
    user: null,
    summary: null,
    offers: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const [user, summary, offers] = await Promise.all([
          loyaltyAPI.getCurrentUser(),
          loyaltyAPI.getLoyaltySummary(),
          loyaltyAPI.getOffers(),
        ]);

        if (!isMounted) return;
        setData({ user, summary, offers });
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Ошибка загрузки данных');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { ...data, loading, error };
}