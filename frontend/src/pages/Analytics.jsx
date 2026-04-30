import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { loyaltyAPI } from '../services/api';

const COLORS = ['#ffdd2d', '#34d399', '#a78bfa'];

function Analytics() {
  const navigate = useNavigate();

  const [monthlyData, setMonthlyData] = useState([]);
  const [forecast, setForecast] = useState({ forecasts: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [history, forecastData] = await Promise.all([
          loyaltyAPI.getMonthlyHistory(),
          loyaltyAPI.getForecast(),
        ]);

        const safeHistory = Array.isArray(history) ? history : [];

        setMonthlyData(
          safeHistory.map((item) => ({
            month: item.month || '',
            cashback: item.total_equivalent || 0,
          }))
        );

        setForecast({
          forecasts: forecastData?.forecasts || [],
          total: forecastData?.total || 0,
        });
      } catch (e) {
        console.error(e);
        setMonthlyData([]);
        setForecast({ forecasts: [], total: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const pieData = forecast.forecasts.map((item) => ({
    name: item.program || '—',
    value: item.equivalent || 0,
  }));

  return (
    <div className="page shell">
      <header className="topbar">
        <h1>Аналитика лояльности</h1>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Назад
        </button>
      </header>

      {loading ? (
        <div className="center">
          <div className="spinner" />
        </div>
      ) : (
        <>
          <section className="card chart-card">
            <h2>Накопление кэшбэка по месяцам</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cashback" stroke="#ffdd2d" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="card chart-card">
            <h2>Распределение по программам</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name + index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </section>

          <p className="card forecast-card">
            Прогноз на месяц:{' '}
            <strong>{forecast.total.toLocaleString('ru-RU')} ₽</strong>
          </p>
        </>
      )}
    </div>
  );
}

export default Analytics;