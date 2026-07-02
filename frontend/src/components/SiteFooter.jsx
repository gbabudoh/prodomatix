import { Link } from 'react-router-dom';

const YEAR = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link to="/about" className="site-footer__link">About</Link>
      <span className="site-footer__sep">·</span>
      <Link to="/privacy-policy" className="site-footer__link">Privacy Policy</Link>
      <span className="site-footer__sep">·</span>
      <Link to="/data-policy" className="site-footer__link">Data Policy</Link>
      <span className="site-footer__sep">·</span>
      <span className="site-footer__copy">© {YEAR} Prodomatix · A subsidiary of Egobas Limited</span>
    </footer>
  );
}
