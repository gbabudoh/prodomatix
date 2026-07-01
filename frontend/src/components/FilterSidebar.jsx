import { useMarketplace } from '../store/MarketplaceContext.jsx';

function CheckRow({ name, count, active, onToggle }) {
  return (
    <div className="check-row" onClick={onToggle}>
      <div className={'checkbox' + (active ? ' is-on' : '')}>{active ? '✓' : ''}</div>
      <span className="check-row__name">{name}</span>
      <span className="check-row__count">{count ?? 0}</span>
    </div>
  );
}

const VERIFIED_OPTS = [
  { v: '', label: 'Any' },
  { v: '80', label: '80%+' },
  { v: '90', label: '90%+' },
  { v: '95', label: '95%+' }
];
const SIZE_OPTS = [
  { v: '', label: 'Any size' },
  { v: 'small', label: '1–200' },
  { v: 'medium', label: '201–1,000' },
  { v: 'large', label: '1,000+' }
];
const REV_OPTS = [
  { v: '', label: 'Any revenue' },
  { v: 'under50', label: '< $50M' },
  { v: '50to250', label: '$50–250M' },
  { v: 'over250', label: '$250M+' }
];

export default function FilterSidebar() {
  const {
    state, toggleType, toggleIndustry, toggleRegion,
    setPrice, setVerified, setSizeBand, setRevenueBand, clearFilters
  } = useMarketplace();
  const { filters, options, facets, priceBounds } = state;

  return (
    <aside className="sidebar">
      <span className="filter-label">Supplier type</span>
      <div className="filter-group">
        {options.types.map((name) => (
          <CheckRow key={name} name={name} count={facets.types[name]}
            active={filters.types.includes(name)} onToggle={() => toggleType(name)} />
        ))}
      </div>

      <span className="filter-label">Industry</span>
      <div className="filter-group">
        {options.industries.map((name) => (
          <CheckRow key={name} name={name} count={facets.industries[name]}
            active={filters.industries.includes(name)} onToggle={() => toggleIndustry(name)} />
        ))}
      </div>

      <span className="filter-label">Region</span>
      <div className="filter-group">
        {options.regions.map((name) => (
          <CheckRow key={name} name={name} count={facets.regions[name]}
            active={filters.regions.includes(name)} onToggle={() => toggleRegion(name)} />
        ))}
      </div>

      <div className="sidebar__advanced">
        <span className="filter-label">Advanced</span>

        <div className="adv-field">
          <label>Price range ({priceBounds.min ? `$${priceBounds.min}` : '$0'}–${priceBounds.max})</label>
          <div className="adv-price">
            <input type="number" className="input input--mono adv-price__in" placeholder="Min"
              value={filters.priceMin} onChange={(e) => setPrice(e.target.value, filters.priceMax)} />
            <span>–</span>
            <input type="number" className="input input--mono adv-price__in" placeholder="Max"
              value={filters.priceMax} onChange={(e) => setPrice(filters.priceMin, e.target.value)} />
          </div>
        </div>

        <div className="adv-field">
          <label>Min verified %</label>
          <select className="input" value={filters.verifiedMin} onChange={(e) => setVerified(e.target.value)}>
            {VERIFIED_OPTS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
          </select>
        </div>

        <div className="adv-field">
          <label>Company size</label>
          <select className="input" value={filters.sizeBand} onChange={(e) => setSizeBand(e.target.value)}>
            {SIZE_OPTS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
          </select>
        </div>

        <div className="adv-field">
          <label>Annual revenue</label>
          <select className="input" value={filters.revenueBand} onChange={(e) => setRevenueBand(e.target.value)}>
            {REV_OPTS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <button className="clear-link" onClick={clearFilters}>Clear all filters</button>
    </aside>
  );
}
