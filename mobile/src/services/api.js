import AsyncStorage from '@react-native-async-storage/async-storage';

// Продакшен-сервер (уже с https)
const API_BASE_URL = 'https://loyalty-api.emrysdev.xyz';

// Тестовые пароли: user_1, user_2, user_3 и т.д. (по ID пользователя)
const getTestPassword = (email) => {
  const match = email.match(/user_(\d+)/);
  if (match) return `user_${match[1]}`;
  // Если email не в формате user_@..., пробуем извлечь ID из начала
  const id = email.split('.')[0]?.split('@')[0]?.match(/\d+$/)?.[0];
  return id ? `user_${id}` : '12345'; // fallback
};

const getToken = async () => await AsyncStorage.getItem('access_token');
const setToken = async (token) => await AsyncStorage.setItem('access_token', token);
const clearToken = async () => await AsyncStorage.removeItem('access_token');

// Универсальный запрос с автоматической подстановкой токена
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

  // Выход
  logout: async () => {
    await clearToken();
  },

  // Публичные эндпоинты (не требуют авторизации)
  getUsers: () => request('/users/'),

  // Эндпоинты, требующие авторизации
  getMe: () => request('/users/me'),
  getLoyaltySummary: () => request('/loyalty/summary'),
  getLoyaltyHistory: () => request('/loyalty/history'),
  getMonthlyHistory: () => request('/loyalty/history/monthly'),
  getForecast: () => request('/loyalty/forecast'),
  getOffers: () => request('/offers/'),
};