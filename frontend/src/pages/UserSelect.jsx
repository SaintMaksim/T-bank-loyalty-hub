import { useEffect, useState } from 'react';
import {
  DATA_MODES,
  getCurrentDataMode,
  loyaltyAPI,
  setDataMode,
} from '../services/api';
import UserCard from '../components/UserCard';
import ThemeToggle from '../components/ThemeToggle';
import logo from '../resources/logo.svg';

function UserSelect() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState(() => getCurrentDataMode());
  const [segmentFilter, setSegmentFilter] = useState('all');

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await loyaltyAPI.getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message || 'Не удалось загрузить пользователей');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [mode]);

  const handleModeChange = (event) => {
    const nextMode = event.target.value;
    setDataMode(nextMode);
    setMode(nextMode);
  };

  const filteredUsers = users.filter((user) => {
    if (segmentFilter === 'all') return true;
    return user.segment === segmentFilter;
  });

  return (
    <div className="page shell">
      <header className="topbar">
        <h1 className="title-with-logo">
          <img src={logo} alt="Логотип" className="h1-icon" />
          Т-Лояльность
        </h1>
        <div className="topbar-controls">
          <label className="mode-switch">
            Источник данных
            <select value={mode} onChange={handleModeChange}>
              <option value={DATA_MODES.MOCK}>Mock</option>
              <option value={DATA_MODES.BACKEND}>Backend</option>
              <option value={DATA_MODES.CSV}>CSV</option>
            </select>
          </label>
          <ThemeToggle />
        </div>
      </header>

      <h2>Выберите пользователя</h2>
      <div className="segment-filters">
        <div className="segment-filters__title">
          Финансовый сегмент клиента
        </div>
        <button
          type="button"
          className={`btn btn-secondary ${segmentFilter === 'all' ? 'is-active' : ''}`}
          onClick={() => setSegmentFilter('all')}
        >
          Все
        </button>
        <button
          type="button"
          className={`btn btn-secondary ${segmentFilter === 'starter' ? 'is-active' : ''}`}
          onClick={() => setSegmentFilter('starter')}
        >
          Низкий
        </button>
        <button
          type="button"
          className={`btn btn-secondary ${segmentFilter === 'standard' ? 'is-active' : ''}`}
          onClick={() => setSegmentFilter('standard')}
        >
          Средний
        </button>
        <button
          type="button"
          className={`btn btn-secondary ${segmentFilter === 'premium' ? 'is-active' : ''}`}
          onClick={() => setSegmentFilter('premium')}
        >
          Высокий
        </button>
      </div>

      {loading && (
        <div className="grid users-grid">
          <div className="card skeleton" />
          <div className="card skeleton" />
          <div className="card skeleton" />
        </div>
      )}

      {!loading && error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="grid users-grid">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserSelect;
