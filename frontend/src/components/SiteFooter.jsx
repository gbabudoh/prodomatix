const YEAR = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <a href="#" className="site-footer__link">Privacy Policy</a>
      <span className="site-footer__sep">·</span>
      <a href="#" className="site-footer__link">Data Policy</a>
      <span className="site-footer__sep">·</span>
      <span className="site-footer__copy">© {YEAR} Prodomatix · A subsidiary of Egobas Limited</span>
    </footer>
  );
}
