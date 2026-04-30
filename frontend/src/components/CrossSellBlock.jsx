const crossSellProducts = [
  {
    id: 'inv',
    title: 'Т-Инвестиции',
    text: 'Открой брокерский счет и получи 500 ₽',
  },
  {
    id: 'biz',
    title: 'Т-Бизнес',
    text: 'Подключи эквайринг для бизнеса',
  },
  {
    id: 'mob',
    title: 'Т-Мобайл',
    text: 'Перейди на мобильную связь и сэкономь',
  },
];

function CrossSellBlock() {
  return (
    <section className="card">
      <h2>Рекомендуем</h2>
      <div className="cross-sell-grid">
        {crossSellProducts.map((item) => (
          <article key={item.id} className="cross-sell-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <a className="btn btn-secondary" href="https://www.tbank.ru" target="_blank" rel="noreferrer">
              Подробнее
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CrossSellBlock;
