import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './AdminIcons.jsx';

// Top nav for the public marketing pages (homepage, /how-it-works). Shows
// inline links on desktop; on mobile the links collapse behind a hamburger
// that opens a menu sliding in from the right.
export default function MarketingNav({ showBack = false, showHowItWorks = true }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <nav className="hiw-nav">
        <div className="hiw-nav__brandgroup">
          {showBack && <Link to="/" className="hiw-nav__back">← Home</Link>}
          <Link to="/" className="hiw-nav__brand">
            <img src="/logo.png" alt="Prodomatix" className="hiw-nav__logo" />
          </Link>
        </div>

        <div className="hiw-nav__links">
          {showHowItWorks && <Link to="/how-it-works" className="hiw-nav__link">How it works</Link>}
          <Link to="/login" className="hiw-nav__link">Sign in</Link>
          <Link to="/register" className="hiw-nav__cta">Get started free →</Link>
        </div>

        <button className="hiw-nav__toggle" aria-label="Open menu" onClick={() => setOpen(true)}>
          <Icon name="menu" size={22} />
        </button>
      </nav>

      {open && <div className="hiw-navdrawer__scrim" onClick={close} />}

      <aside className={'hiw-navdrawer' + (open ? ' is-open' : '')}>
        <div className="hiw-navdrawer__head">
          <img src="/logo.png" alt="Prodomatix" className="hiw-nav__logo" />
          <button className="hiw-navdrawer__close" aria-label="Close menu" onClick={close}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <nav className="hiw-navdrawer__links">
          {showHowItWorks && <Link to="/how-it-works" className="hiw-navdrawer__link" onClick={close}>How it works</Link>}
          <Link to="/about" className="hiw-navdrawer__link" onClick={close}>About</Link>
          <Link to="/login" className="hiw-navdrawer__link" onClick={close}>Sign in</Link>
        </nav>
        <Link to="/register" className="hiw-navdrawer__cta" onClick={close}>Get started free →</Link>
      </aside>
    </>
  );
}
