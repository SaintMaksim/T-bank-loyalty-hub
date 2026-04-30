import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import userAvatar from '../resources/user.svg';

const segmentMap = {
  starter: { label: 'низкий', className: 'segment-starter' },
  standard: { label: 'средний', className: 'segment-standard' },
  premium: { label: 'высокий', className: 'segment-premium' },
};

function UserCard({ user }) {
  const navigate = useNavigate();
  const segment = segmentMap[user.segment] || { label: 'не определен', className: '' };

  return (
    <article className={`card user-card ${segment.className}`}>
      <div className="user-card__header">
        <img className="user-card__avatar" src={user.avatar || userAvatar} alt="Аватар пользователя" />
        <div>
          <h3 className="user-card__name">{user.name}</h3>
        </div>
      </div>
      <p className="user-card__balance">Общий баланс: {formatCurrency(user.total_balance, false)}</p>
      <button type="button" className="btn btn-primary" onClick={() => navigate(`/dashboard/${user.id}`)}>
        Выбрать
      </button>
    </article>
  );
}

export default UserCard;
