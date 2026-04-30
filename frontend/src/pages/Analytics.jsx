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
import { mockAnalytics } from '../services/mockData';

const COLORS = ['#ffdd2d', '#60a5fa', '#34d399', '#a78bfa'];

function Analytics() {
  const navigate = useNavigate();

  return (
    <div className="page shell">
      <header className="topbar">
        <h1>Аналитика лояльности</h1>
        <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>
          Назад к дашборду
        </button>
      </header>

      <section className="card chart-card">
        <h2>Накопление кэшбэка по месяцам</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={mockAnalytics.cashbackByMonth}>
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
        <h2>Распределение по категориям</h2>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={mockAnalytics.categoryDistribution} dataKey="value" nameKey="name" outerRadius={100}>
              {mockAnalytics.categoryDistribution.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <p className="card">
        Прогноз выгоды: если тратить 50 000 ₽/мес, можно получить до 15 000 ₽ кэшбэка за год.
      </p>
    </div>
  );
}

export default Analytics;
