# API Contract для бэкенда

Все эндпоинты возвращают JSON. Ошибки – стандартные HTTP коды.

## GET /api/users
Список пользователей для тестового переключения.

Ответ:
[
  { "id": 1, "full_name": "Иванов Дмитрий Иванович", "segment": "LOW" },
  { "id": 30, "full_name": "Морозов Кирилл Михайлович", "segment": "MEDIUM" }
]

## GET /api/users/{user_id}/loyalty
Совокупная лояльность + прогноз.

Ответ:
{
  "user_id": 1,
  "total_equivalent_rub": 12500.50,
  "breakdown": {
    "rub": 5000,
    "miles": 2000,
    "bravo_points": 3000
  },
  "forecast_next_month": {
    "value": 2080,
    "message": "Если продолжите, получите ~2080 ₽ кэшбэка"
  }
}

## GET /api/users/{user_id}/history
Помесячная история начислений.

Ответ:
{
  "user_id": 1,
  "history": [
    { "month": "2026-01", "rub": 120, "miles": 0, "bravo_points": 50 },
    { "month": "2026-02", "rub": 140, "miles": 10, "bravo_points": 70 }
  ]
}

## GET /api/users/{user_id}/offers
Акции партнёров с учётом сегмента.

Ответ:
[
  {
    "partner_name": "МастерМинутка",
    "description": "Бытовой ремонт",
    "cashback_percent": 10,
    "logo_url": "https://...",
    "brand_color": "#E74C3C"
  }
]

## GET /api/users/{user_id}/cross-sell
Кросс-селл продукты экосистемы.

Ответ:
[
  { "name": "Т-Мобайл", "icon": "📱", "description": "Мобильная связь с кэшбэком" },
  { "name": "Т-Инвестиции", "icon": "📈", "description": "Инвестируйте с умом" }
]

## GET /api/users/{user_id}/gamification
Уровень и прогресс.

Ответ:
{
  "level": "Бронза",
  "next_level": "Серебро",
  "progress": 0.42,
  "total_rub_cashback": 2100,
  "needed_for_next": 2900
}

## GET /api/users/{user_id}/ai-recommend
ИИ-совет.

Ответ:
{
  "recommendation": "Начните с программы Black – простой рублёвый кэшбэк."
}

## Примечания для бэкенда
- Расчёты total_equivalent_rub и forecast по формулам из loyalty-metrics.md
- Фильтрация офферов по financial_segment – обязательна
- Для history группировать по месяцам (YYYY-MM)