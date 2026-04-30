import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <div className={`layout ${theme}`}>
      <header className="layout__header">
        <Link to="/" className="layout__logo" onClick={() => navigate('/')}>
          <span className="layout__logo-icon">🏦</span>
          <span className="layout__logo-text">Т-Банк Лояльность</span>
        </Link>
        <button 
          className="layout__theme-toggle" 
          onClick={toggleTheme} 
          aria-label={`Переключить на ${theme === 'light' ? 'тёмную' : 'светлую'} тему`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <main className="layout__main">
        {children}
      </main>

      <footer className="layout__footer">
        <p>© 2026 Т-Банк. РадиоХак. Команда Monkey Business</p>
      </footer>
    </div>
  );
};

export default Layout;