#  RadioHack 3.0: Единый раздел лояльности Т-Банка

> **Команда:** Monkey Business
> **Треки:** Лояльность, AI, UX

## 🔗 Ссылки на компоненты системы
Так как мы используем моно-репозиторий для ускорения разработки:
- 📦 **Бэкенд (API):** Папка `/backend` (Python/FastAPI)
- 🖥 **Фронтенд (Web):** Папка `/frontend` (React)
- 🎨 **Дизайн:** Пока нету
- 🚀 **Демо:** Пока нету

## 📖 О проекте
Мы разработали единый раздел лояльности, который агрегирует кэшбэк (рубли), баллы "Браво" и мили All Airlines в одном месте. Решение сегментирует пользователей по финансовому статусу и предлагает персональные офферы.

## 🛠 Стек технологий
- **Backend:** Python 3.10+, FastAPI, Pandas (анализ CSV), Pydantic.
- **Frontend:** React 18, Vite, React Router, Recharts (графики), Tailwind/MUI.
- **DevOps:** GitHub Actions (CI/CD).

## 🚀 Как запустить локально
1. **Backend:** `cd backend && pip install -r requirements.txt && uvicorn main:app --reload`
2. **Frontend:** `cd frontend && npm install && npm run dev`