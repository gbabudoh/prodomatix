import { Link } from 'react-router-dom';

const YEAR = new Date().getFullYear();

export function AuthTopLink() {
  return (
    <div className="auth-top-link">
      <Link to="/how-it-works" className="auth-top-link__btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        How it works
      </Link>
    </div>
  );
}

export default function AuthFooter() {
  return (
    <footer className="auth-footer">
      <div className="auth-footer__links">
        <a href="#" className="auth-footer__link">Privacy Policy</a>
        <span className="auth-footer__dot" />
        <a href="#" className="auth-footer__link">Data Policy</a>
      </div>
      <p className="auth-footer__copy">
        © {YEAR} Prodomatix &nbsp;·&nbsp; A subsidiary of <strong>Egobas Limited</strong>
      </p>
    </footer>
  );
}
