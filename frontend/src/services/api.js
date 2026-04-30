import axios from 'axios';

const DATA_MODE_KEY = 'loyalty-data-mode';
const TOKEN_KEY = 'access_token';

export const DATA_MODES = {
  BACKEND: 'backend',
  CSV: 'csv',
};

const api = axios.create({
  baseURL: 'http://localhost:8001',
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const getDataMode = () => localStorage.getItem(DATA_MODE_KEY);

export const setDataMode = (mode) => {
  localStorage.setItem(DATA_MODE_KEY, mode);
};

export const getCurrentDataMode = () => getDataMode();

export const loyaltyAPI = {
  login: async (email, password) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', email);
    params.append('password', password);

    const res = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const token = res.data.access_token;
    localStorage.setItem(TOKEN_KEY, token);

    return token;
  },

  getUsers: async () => {
    const res = await api.get('/users/');

    return res.data.map((user) => ({
      id: `user_${user.id}`,
      source_user_id: user.id,
      name: user.full_name,
      email: user.email,
      segment:
        user.financial_segment === 'HIGH'
          ? 'premium'
          : user.financial_segment === 'MEDIUM'
          ? 'standard'
          : 'starter',
    }));
  },

  getCurrentUser: async () => {
    const res = await api.get('/users/me');

    return {
      id: `user_${res.data.id}`,
      name: res.data.full_name,
      email: res.data.email,
      segment:
        res.data.financial_segment === 'HIGH'
          ? 'premium'
          : res.data.financial_segment === 'MEDIUM'
          ? 'standard'
          : 'starter',
    };
  },

  getLoyaltySummary: async () => {
    const res = await api.get('/loyalty/summary');

    return {
      rubles_cashback: res.data.total_rub,
      bravo_points: res.data.total_bravo,
      airline_miles: res.data.total_miles,
      total_equivalent: res.data.total_equivalent_rub,
      accounts: res.data.accounts,
    };
  },

  getMonthlyHistory: async () => {
    const res = await api.get('/loyalty/history/monthly');

    return res.data.map((item) => ({
      month: item.month,
      total_equivalent: item.total_equivalent_rub,
    }));
  },

  getForecast: async () => {
    const res = await api.get('/loyalty/forecast');

    return {
      total: res.data.total_predicted_equivalent_rub,
      forecasts: res.data.forecasts.map((f) => ({
        program: f.loyalty_program_name,
        currency: f.cashback_currency,
        amount: f.predicted_amount,
        equivalent: f.predicted_equivalent_rub,
      })),
    };
  },

  getOffers: async () => {
    const res = await api.get('/offers/');

    return res.data.map((item) => ({
      id: `offer_${item.id}`,
      partner: item.partner_name,
      cashback_percent: item.cashback_percent,
      category: (item.short_description || 'partner')
        .toLowerCase()
        .replace(/\s+/g, '_'),
      description: item.short_description,
    }));
  },
};