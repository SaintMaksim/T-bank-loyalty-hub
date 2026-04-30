function ProgramCard({ program }) {
  const iconByType = {
    black: '🖤',
    platinum: '💠',
    all_airlines: '✈️',
  };

  return (
    <article className="card program-card">
      <h3>{iconByType[program.type] || '⭐'} {program.name}</h3>
      <p className="muted">Валюта: {program.currency}</p>
      <p className="program-card__cashback">Кэшбэк: {program.cashback}</p>
    </article>
  );
}

export default ProgramCard;