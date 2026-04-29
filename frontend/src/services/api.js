import axios from 'axios';
import { mockLoyaltySummary, mockOffers, mockPrograms, mockUsers } from './mockData';

const DATA_MODE_KEY = 'loyalty-data-mode';
const CSV_USERS_KEY = 'loyalty-csv-users';

export const DATA_MODES = {
  MOCK: 'mock',
  BACKEND: 'backend',
  CSV: 'csv',
};

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000,
});

const getDataMode = () => localStorage.getItem(DATA_MODE_KEY) || DATA_MODES.MOCK;

export const setDataMode = (mode) => {
  localStorage.setItem(DATA_MODE_KEY, mode);
};

export const getCurrentDataMode = () => getDataMode();

const parseCsv = (csvText) => {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((item) => item.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((item) => item.trim());
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index] || '';
      return acc;
    }, {});
  });
};

const segmentToApp = {
  LOW: 'starter',
  MEDIUM: 'standard',
  HIGH: 'premium',
};

const csvCache = {
  loaded: false,
  users: [],
  accounts: [],
  programs: [],
  offers: [],
  history: [],
};

const loadCsvBundle = async () => {
  if (csvCache.loaded) return csvCache;

  try {
    const [usersRes, accountsRes, programsRes, offersRes, historyRes] = await Promise.all([
      fetch('/CSVs/Users.csv'),
      fetch('/CSVs/Accounts.csv'),
      fetch('/CSVs/LoyaltyPrograms.csv'),
      fetch('/CSVs/Offers.csv'),
      fetch('/CSVs/LoyaltyHistory.csv'),
    ]);

    if (!usersRes.ok || !accountsRes.ok || !programsRes.ok || !offersRes.ok || !historyRes.ok) {
      throw new Error('CSV-файлы не найдены в папке /frontend/CSVs');
    }

    csvCache.users = parseCsv(await usersRes.text());
    csvCache.accounts = parseCsv(await accountsRes.text());
    csvCache.programs = parseCsv(await programsRes.text());
    csvCache.offers = parseCsv(await offersRes.text());
    csvCache.history = parseCsv(await historyRes.text());
    csvCache.loaded = true;

    return csvCache;
  } catch (error) {
    const manualUsersRaw = localStorage.getItem(CSV_USERS_KEY);
    if (manualUsersRaw) {
      const users = JSON.parse(manualUsersRaw);
      return {
        ...csvCache,
        loaded: true,
        users: users.map((item) => ({
          id: String(item.id),
          full_name: item.name,
          financial_segment: (item.segment || 'starter').toUpperCase(),
        })),
      };
    }

    throw error;
  }
};

const parseUsersCsv = (csvText) => {
  const rows = parseCsv(csvText);
  if (!rows.length) {
    throw new Error('CSV пустой или содержит только заголовок');
  }

  return rows.map((row, index) => ({
    id: row.id || `csv_user_${index + 1}`,
    name: row.name || `Пользователь ${index + 1}`,
    segment: row.segment || 'starter',
    total_balance: Number(row.total_balance || 0),
    avatar: row.avatar || '👤',
  }));
};

export const uploadUsersCsv = async (file) => {
  const text = await file.text();
  const users = parseUsersCsv(text);
  localStorage.setItem(CSV_USERS_KEY, JSON.stringify(users));
  return users;
};

const mapErrorMessage = (error) => {
  if (error.code === 'ECONNABORTED') {
    return 'Превышено время ожидания';
  }

  const status = error?.response?.status;
  if (status === 404) return 'Пользователь не найден';
  if (status >= 500) return 'Сервер недоступен';
  return error?.message || 'Не удалось выполнить запрос';
};

const withFallback = async (request, fallback) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    const message = mapErrorMessage(error);
    if (typeof window !== 'undefined') {
      window.alert(message);
    }
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(message);
  }
};

const normalizeCsvUsers = async () => {
  const bundle = await loadCsvBundle();

  const accountsByUser = bundle.accounts.reduce((acc, row) => {
    const userId = String(row.user_id);
    const balance = Number(row.current_balance || 0);
    acc[userId] = (acc[userId] || 0) + balance;
    return acc;
  }, {});

  return bundle.users.map((row) => {
    const id = String(row.id);
    return {
      id: `user_${id}`,
      source_user_id: id,
      name: row.full_name,
      segment: segmentToApp[row.financial_segment] || 'starter',
      total_balance: Math.round(accountsByUser[id] || 0),
      avatar: row.financial_segment === 'HIGH' ? '👑' : '👤',
    };
  });
};

const getCsvUserById = async (id) => {
  const users = await normalizeCsvUsers();
  const user = users.find((item) => item.id === id);
  if (!user) throw new Error('Пользователь не найден');
  return user;
};

const getCsvSummaryByUserId = async (userId) => {
  const user = await getCsvUserById(userId);
  const bundle = await loadCsvBundle();

  const userAccounts = bundle.accounts.filter((row) => String(row.user_id) === user.source_user_id);

  const balances = {
    rubles_cashback: 0,
    bravo_points: 0,
    airline_miles: 0,
  };

  userAccounts.forEach((account) => {
    const program = bundle.programs.find((p) => String(p.loyalty_program_id) === String(account.loyalty_program_id));
    const value = Number(account.current_balance || 0);
    const currency = program?.cashback_currency;

    if (currency === 'rub') balances.rubles_cashback += value;
    if (currency === 'bravo-points') balances.bravo_points += value;
    if (currency === 'miles') balances.airline_miles += value;
  });

  const totalEquivalent =
    balances.rubles_cashback + balances.bravo_points * 0.5 + balances.airline_miles * 2;

  return {
    user_id: userId,
    rubles_cashback: Math.round(balances.rubles_cashback),
    bravo_points: Math.round(balances.bravo_points),
    airline_miles: Math.round(balances.airline_miles),
    total_equivalent: Math.round(totalEquivalent),
  };
};

const getCsvPrograms = async () => {
  const bundle = await loadCsvBundle();
  const cashbackByCurrency = {
    rub: '1-5%',
    'bravo-points': '1.5-10%',
    miles: '2-7%',
  };

  return bundle.programs.map((row) => {
    const type =
      row.loyalty_program_name === 'All Airlines'
        ? 'all_airlines'
        : row.loyalty_program_name === 'Black'
          ? 'black'
          : 'platinum';

    const name = row.loyalty_program_name === 'Bravo' ? 'Платинум' : row.loyalty_program_name;

    return {
      id: `prog_${row.loyalty_program_id}`,
      name,
      type,
      currency: row.cashback_currency.toUpperCase(),
      cashback: cashbackByCurrency[row.cashback_currency] || '1-5%',
    };
  });
};

const getCsvOffersByUserId = async (userId) => {
  const user = await getCsvUserById(userId);
  const bundle = await loadCsvBundle();

  const financialSegment = user.segment === 'premium' ? 'HIGH' : user.segment === 'standard' ? 'MEDIUM' : 'LOW';
  return bundle.offers
    .filter((row) => row.financial_segment === financialSegment)
    .slice(0, 12)
    .map((row) => ({
      id: `offer_${row.partner_id}`,
      partner: row.partner_name,
      cashback_percent: Number(row.cashback_percent || 0),
      category: (row.short_description || 'partner').toLowerCase().replace(/\s+/g, '_'),
      is_cross_sell: false,
      description: row.short_description,
      logo_url: row.logo_url,
      color: row.brand_color_hex,
    }));
};

export const loyaltyAPI = {
  getUsers: async () => {
    const mode = getDataMode();
    if (mode === DATA_MODES.MOCK) {
      return mockUsers;
    }
    if (mode === DATA_MODES.CSV) {
      return normalizeCsvUsers();
    }
    return withFallback(() => api.get('/users'), mockUsers);
  },
  getUserById: async (id) => {
    const mode = getDataMode();
    if (mode === DATA_MODES.MOCK) {
      const user = mockUsers.find((item) => item.id === id);
      if (!user) throw new Error('Пользователь не найден');
      return user;
    }
    if (mode === DATA_MODES.CSV) {
      return getCsvUserById(id);
    }

    const user = await withFallback(() => api.get(`/users/${id}`), null);
    if (user) return user;

    const fallbackUser = mockUsers.find((item) => item.id === id);
    if (!fallbackUser) {
      throw new Error('Пользователь не найден');
    }
    return fallbackUser;
  },
  getLoyaltySummary: async (userId) => {
    const mode = getDataMode();
    if (mode === DATA_MODES.MOCK) {
      return { ...mockLoyaltySummary, user_id: userId };
    }
    if (mode === DATA_MODES.CSV) {
      return getCsvSummaryByUserId(userId);
    }
    return withFallback(() => api.get(`/users/${userId}/loyalty`), mockLoyaltySummary);
  },
  getPrograms: async (userId) => {
    const mode = getDataMode();
    if (mode === DATA_MODES.MOCK) {
      return mockPrograms;
    }
    if (mode === DATA_MODES.CSV) {
      return getCsvPrograms(userId);
    }
    return withFallback(() => api.get(`/users/${userId}/programs`), mockPrograms);
  },
  getOffers: async (userId) => {
    const mode = getDataMode();
    if (mode === DATA_MODES.MOCK) {
      return mockOffers;
    }
    if (mode === DATA_MODES.CSV) {
      return getCsvOffersByUserId(userId);
    }
    return withFallback(() => api.get(`/users/${userId}/offers`), mockOffers);
  },
};
