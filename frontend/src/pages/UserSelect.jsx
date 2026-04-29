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

  return (
    <div className="page shell">
      <header className="topbar">
        <h1 className="title-with-logo">
          <img src={logo} alt="Логотип" className="h1-icon" />
          Т-Банк Лояльность
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
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserSelect;
