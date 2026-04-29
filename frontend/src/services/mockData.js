export const mockUsers = [
  {
    id: 'user_1',
    name: 'Александр Петров',
    segment: 'starter',
    total_balance: 75000,
    avatar: '👤',
  },
  {
    id: 'user_2',
    name: 'Мария Иванова',
    segment: 'standard',
    total_balance: 450000,
    avatar: '👤',
  },
  {
    id: 'user_3',
    name: 'Дмитрий Сидоров',
    segment: 'premium',
    total_balance: 2500000,
    avatar: '👑',
  },
];

export const mockLoyaltySummary = {
  user_id: 'user_2',
  rubles_cashback: 12500,
  bravo_points: 3400,
  airline_miles: 850,
  total_equivalent: 16750,
};

export const mockPrograms = [
  { id: 'prog_1', name: 'Black', type: 'black', currency: 'RUB', cashback: '1-5%' },
  { id: 'prog_2', name: 'Платинум', type: 'platinum', currency: 'BRAVO', cashback: '1.5-10%' },
  { id: 'prog_3', name: 'All Airlines', type: 'all_airlines', currency: 'MILES', cashback: '2-7%' },
];

export const mockOffers = [
  { id: 'offer_1', partner: '4 Лапы', cashback_percent: 10, category: 'pets', is_cross_sell: false },
  { id: 'offer_2', partner: 'Яндекс.Еда', cashback_percent: 5, category: 'food', is_cross_sell: false },
  {
    id: 'offer_3',
    partner: 'Т-Инвестиции',
    cashback_percent: 0,
    category: 'investments',
    is_cross_sell: true,
    description: 'Открой брокерский счет',
  },
];

export const mockAnalytics = {
  cashbackByMonth: [
    { month: 'Янв', cashback: 800 },
    { month: 'Фев', cashback: 1000 },
    { month: 'Мар', cashback: 1200 },
    { month: 'Апр', cashback: 1500 },
    { month: 'Май', cashback: 1750 },
    { month: 'Июн', cashback: 2000 },
  ],
  categoryDistribution: [
    { name: 'Еда', value: 35 },
    { name: 'Путешествия', value: 25 },
    { name: 'Питомцы', value: 15 },
    { name: 'Остальное', value: 25 },
  ],
};
