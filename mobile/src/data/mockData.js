export const USERS = [
  { id: "1", name: "Иванов Дмитрий", segment: "LOW", balance: 82155 },
  { id: "2", name: "Смирнов Артём", segment: "MEDIUM", balance: 328733 },
  { id: "4", name: "Смирнова Екатерина", segment: "HIGH", balance: 6026604 }
];

export const LOYALTY_DATA = {
  "1": { rub: 12500, bravo: 0, miles: 0, total: 12500 },
  "2": { rub: 0, bravo: 8500, miles: 3200, total: 10650 },
  "4": { rub: 45200, bravo: 0, miles: 15800, total: 76800 }
};

export const OFFERS = {
  LOW: [{ id: 1, partner: "МастерМинутка", percent: 10 }],
  MEDIUM: [{ id: 2, partner: "Доктор Окон", percent: 9 }],
  HIGH: [{ id: 3, partner: "ЧистоБыстро", percent: 7 }]
};

export const getSegmentColor = (segment) => {
  switch(segment) {
    case 'LOW': return '#22C55E';
    case 'MEDIUM': return '#3B82F6';
    case 'HIGH': return '#F59E0B';
    default: return '#666';
  }
};

export const getSegmentName = (segment) => {
  switch(segment) {
    case 'LOW': return 'Starter';
    case 'MEDIUM': return 'Standard';
    case 'HIGH': return 'Premium';
    default: return segment;
  }
};