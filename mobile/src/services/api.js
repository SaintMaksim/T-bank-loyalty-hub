import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://loyalty-api.emrysdev.xyz';

const getToken = async () => await AsyncStorage.getItem('access_token');
const setToken = async (token) => await AsyncStorage.setItem('access_token', token);
const clearToken = async () => await AsyncStorage.removeItem('access_token');

const request = async (endpoint, options = {}) => {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Ошибка ${response.status}`);
  }

  return response.json();
};

export const api = {
  // 🔐 Авторизация
  login: async (email, password) => {
    const params = new URLSearchParams({ username: email, password });
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Неверный логин или пароль');
    }
    
    const data = await response.json();
    await setToken(data.access_token);
    return data;
  },

  logout: async () => {
    await clearToken();
  },

  // 👥 Публичные эндпоинты
  getUsers: () => request('/users/'),

  // 🔐 Эндпоинты с авторизацией
  getMe: () => request('/users/me'),
  getLoyaltySummary: () => request('/loyalty/summary'),
  getLoyaltyHistory: () => request('/loyalty/history'),
  getMonthlyHistory: () => request('/loyalty/history/monthly'),
  getForecast: () => request('/loyalty/forecast'),
  getOffers: () => request('/offers/'),

  // 🤖 ИИ-рекомендации (с моком, если бэкенд не готов)
  getAiRecommend: async () => {
    try {
      return await request('/ai/recommend');
    } catch (e) {
      // Возвращаем моковые данные для демо
      console.debug('🤖 AI recommend using mock');
      return { 
        recommendation: "Подключите программу «Браво» — при ваших тратах это даст +300 ₽ в месяц" 
      };
    }
  },

  // 🔥 Стрик посещений (с моком, если бэкенд не готов)
  getStreak: async () => {
    try {
      return await request('/gamification/streak');
    } catch (e) {
      // Возвращаем моковые данные для демо
      console.debug('🔥 Streak using mock');
      return { 
        streak_count: 3,
        max_streak: 5,
        last_visit_date: "2026-04-29",
        next_milestone: {
          days: 4,
          bonus_rub: 500,
          achievement: "Недельная серия"
        },
        days_until_next: 4,
        visited_today: false
      };
    }
  },

  // Трек визита (тихо игнорируем ошибки — не критично)
  trackVisit: async () => {
    try {
      const token = await getToken();
      await fetch(`${API_BASE_URL}/gamification/streak/visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (e) {
      // Игнорируем — это не блокирует работу приложения
    }
  },
};