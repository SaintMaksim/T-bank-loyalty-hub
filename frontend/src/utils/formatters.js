export const formatCurrency = (value, showSymbol = true) => {
  const formatted = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value || 0);

  return showSymbol ? formatted : formatted.replace('₽', '').trim();
};

export const formatNumber = (value) => new Intl.NumberFormat('ru-RU').format(value || 0);

export const capitalize = (value = '') => value.charAt(0).toUpperCase() + value.slice(1);
