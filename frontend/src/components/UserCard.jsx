import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loyaltyAPI } from '../services/api';
import userAvatar from '../resources/user.svg';

const segmentMap = {
  starter: { label: 'низкий', className: 'segment-starter' },
  standard: { label: 'средний', className: 'segment-standard' },
  premium: { label: 'высокий', className: 'segment-premium' },
};

function UserCard({ user }) {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const segment =
    segmentMap[user.segment] || { label: 'не определен', className: '' };

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);

      await loyaltyAPI.login(email, password);

      setShowLogin(false);

      navigate('/dashboard');
    } catch (e) {
      setError('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <article className={`card user-card ${segment.className}`}>
        <div className="user-card__header">
          <img
            className="user-card__avatar"
            src={user.avatar || userAvatar}
            alt="Аватар пользователя"
          />
          <div>
            <h3 className="user-card__name">{user.name}</h3>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowLogin(true)}
        >
          Выбрать
        </button>
      </article>

      {showLogin && (
        <div className="modal-overlay">
          <div className="card modal">
            <h3>Вход</h3>

            <input
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="input"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error-text">{error}</p>}

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setShowLogin(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserCard;