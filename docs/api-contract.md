# API Contract

Все эндпоинты возвращают JSON. Авторизация через Bearer токен (кроме отмеченных).
Ошибки — стандартные HTTP коды.

## Авторизация

### POST /auth/login

Авторизация по email и паролю. Возвращает JWT токен.

Тестовые пользователи: пароль `user_{id}`, например `user_1` для первого пользователя.

Request (form-data):

```
username: dmitriy.ivanov29@yandex.ru
password: user_1
```

Response:

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

---

## Пользователи

### GET /users

Список всех тестовых пользователей. Авторизация не требуется.
Используется как стартовая точка — выбор пользователя перед входом.

Response:

```json
[
  {
    "id": 1,
    "full_name": "Иванов Дмитрий Иванович",
    "email": "dmitriy.ivanov29@yandex.ru",
    "financial_segment": "LOW"
  }
]
```

### GET /users/me

Данные текущего авторизованного пользователя. Требует токен.

Response:

```json
{
  "id": 1,
  "email": "dmitriy.ivanov29@yandex.ru",
  "phone_number": "+7 994 204-96-79",
  "full_name": "Иванов Дмитрий Иванович",
  "financial_segment": "LOW"
}
```

---

## Лояльность

Все эндпоинты требуют авторизацию. Данные возвращаются для текущего пользователя из токена.

### GET /loyalty/summary

Совокупная лояльность пользователя по всем счетам и программам.
Все валюты приводятся к рублёвому эквиваленту по формуле:
`total_equivalent_rub = rub + miles × 2.0 + bravo × 0.5`

Response:

```json
{
  "total_rub": 5000.0,
  "total_miles": 2000.0,
  "total_bravo": 3000.0,
  "total_equivalent_rub": 11500.0,
  "accounts": [
    {
      "account_id": 1,
      "loyalty_program_name": "Black",
      "cashback_currency": "rub",
      "current_balance": 5000.0
    }
  ]
}
```

### GET /loyalty/history

Полная история начислений кэшбэка. Отсортирована по дате — сначала новые.

Response:

```json
[
  {
    "transaction_id": 1,
    "account_id": 1,
    "loyalty_program_name": "Black",
    "cashback_currency": "rub",
    "cashback_amount": 163.0,
    "payout_date": "2025-02-23"
  }
]
```

### GET /loyalty/history/monthly

История начислений сгруппированная по месяцам. Используется для графика динамики.

Response:

```json
[
  {
    "month": "2025-02",
    "total_rub": 500.0,
    "total_miles": 0.0,
    "total_bravo": 200.0,
    "total_equivalent_rub": 600.0
  }
]
```

### GET /loyalty/forecast

Прогноз выгоды на следующий месяц.
Формула: среднее за последние 3 месяца × 1.2 (коэффициент роста активности).

Response:

```json
{
  "forecasts": [
    {
      "loyalty_program_name": "Black",
      "cashback_currency": "rub",
      "predicted_amount": 600.0,
      "predicted_equivalent_rub": 600.0
    }
  ],
  "total_predicted_equivalent_rub": 1400.0
}
```

---

## Офферы

### GET /offers/

Персональные предложения партнёров и продукты экосистемы Т-Банка.
Фильтруются по финансовому сегменту текущего пользователя.
Сортировка: сначала продукты экосистемы (ECOSYSTEM), затем партнёры по убыванию % кэшбэка.
Продукты экосистемы исключаются если пользователь уже имеет этот продукт.

Response:

```json
[
  {
    "id": 1,
    "partner_name": "МастерМинутка",
    "short_description": "Бытовой ремонт",
    "logo_url": "https://...",
    "brand_color_hex": "#E74C3C",
    "cashback_percent": 10.0,
    "financial_segment": "HIGH"
  }
]
```

---

## Геймификация (в разработке)

### GET /gamification/level

Уровень лояльности и прогресс до следующего.

Уровни на основе `total_equivalent_rub`:

- Бронза: 0 – 5 000 ₽
- Серебро: 5 000 – 15 000 ₽
- Золото: 15 000 – 30 000 ₽
- Платина: > 30 000 ₽

Response:

```json
{
  "level": "Бронза",
  "next_level": "Серебро",
  "progress": 0.42,
  "total_equivalent_rub": 2100.0,
  "needed_for_next": 2900.0
}
```

### GET /gamification/achievements

Список ачивок пользователя (полученные и нет).

Response:

```json
[
  {
    "id": "cashback_start",
    "name": "Кэшбэк-старт",
    "description": "Накоплено 500 ₽ эквивалента",
    "unlocked": true,
    "bonus": 50.0
  }
]
```

---

## ИИ-рекомендации (в разработке)

### GET /ai/recommend

Персонализированная рекомендация от ИИ на основе данных пользователя.
Использует Gemini API — анализирует историю начислений, текущие балансы и сегмент.

Response:

```json
{
  "recommendation": "У вас накоплено 2000 миль — этого хватит на перелёт внутри России. Рекомендуем активировать акцию All Airlines у партнёра X для ускоренного накопления."
}
```
