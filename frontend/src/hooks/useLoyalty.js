import { useEffect, useState } from 'react';
import { loyaltyAPI } from '../services/api';

export function useLoyalty(userId) {
  const [data, setData] = useState({
    user: null,
    summary: null,
    programs: [],
    offers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!userId) return;

      setLoading(true);
      setError('');

      try {
        const [user, summary, programs, offers] = await Promise.all([
          loyaltyAPI.getUserById(userId),
          loyaltyAPI.getLoyaltySummary(userId),
          loyaltyAPI.getPrograms(userId),
          loyaltyAPI.getOffers(userId),
        ]);

        if (!isMounted) return;
        setData({ user, summary, programs, offers });
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
  }, [userId]);

  return { ...data, loading, error };
}
