import { useNavigate } from 'react-router-dom';
import { capitalize, formatCurrency } from '../utils/formatters';

const segmentMap = {
  starter: { label: 'Starter', icon: '🟢', className: 'segment-starter' },
  standard: { label: 'Standard', icon: '🔵', className: 'segment-standard' },
  premium: { label: 'Premium', icon: '👑', className: 'segment-premium' },
};

function UserCard({ user }) {
  const navigate = useNavigate();
  const segment = segmentMap[user.segment] || { label: capitalize(user.segment), icon: '⚪', className: '' };

  return (
    <article className={`card user-card ${segment.className}`}>
      <div className="user-card__header">
        <span className="user-card__avatar" aria-hidden="true">{user.avatar}</span>
        <div>
          <h3>{user.name}</h3>
          <p className="muted">{segment.icon} {segment.label}</p>
        </div>
      </div>
      <p className="user-card__balance">{formatCurrency(user.total_balance)}</p>
      <button type="button" className="btn btn-primary" onClick={() => navigate(`/dashboard/${user.id}`)}>
        Выбрать
      </button>
    </article>
  );
}

export default UserCard;
