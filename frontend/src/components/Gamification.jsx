function Gamification() {
  const progress = 80;

  return (
    <section className="card">
      <h2>Ваш прогресс</h2>
      <p>{progress}% до следующего уровня</p>
      <div className="progress">
        <div className="progress__bar" style={{ width: `${progress}%` }} />
      </div>
      <ul className="achievements">
        <li>Первая покупка</li>
        <li>Потратил 100K за месяц</li>
        <li>Активный клиент</li>
      </ul>
      <p className="muted">Челлендж: совершите 5 покупок у партнеров и получите бонус 500 ₽.</p>
    </section>
  );
}

export default Gamification;
