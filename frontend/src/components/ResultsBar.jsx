import { useMarketplace } from '../store/MarketplaceContext.jsx';
import { moneyRound } from '../lib/format.js';

const SORTS = [
  { id: 'relevance', label: 'Best match' },
  { id: 'price_asc', label: 'Price: low to high' },
  { id: 'price_desc', label: 'Price: high to low' },
  { id: 'verified', label: 'Verified %' },
  { id: 'newest', label: 'Newest' }
];

const SIZE_LABELS = { small: '1–200 staff', medium: '201–1,000 staff', large: '1,000+ staff' };
const REV_LABELS = { under50: 'Revenue < $50M', '50to250': 'Revenue $50–250M', over250: 'Revenue $250M+' };

// Builds the list of active-filter chips from current filter state.
function chipsFrom(filters, removeFilter) {
  const chips = [];
  if (filters.search) chips.push({ key: 'search', label: `“${filters.search}”`, clear: { search: '' } });
  filters.types.forEach((t) => chips.push({ key: `t-${t}`, label: t, clear: { types: filters.types.filter((x) => x !== t) } }));
  filters.industries.forEach((i) => chips.push({ key: `i-${i}`, label: i, clear: { industries: filters.industries.filter((x) => x !== i) } }));
  filters.regions.forEach((r) => chips.push({ key: `r-${r}`, label: r, clear: { regions: filters.regions.filter((x) => x !== r) } }));
  if (filters.priceMin !== '' || filters.priceMax !== '') {
    const lo = filters.priceMin !== '' ? moneyRound(filters.priceMin) : 'Any';
    const hi = filters.priceMax !== '' ? moneyRound(filters.priceMax) : 'Any';
    chips.push({ key: 'price', label: `${lo} – ${hi}`, clear: { priceMin: '', priceMax: '' } });
  }
  if (filters.verifiedMin) chips.push({ key: 'verified', label: `${filters.verifiedMin}%+ verified`, clear: { verifiedMin: '' } });
  if (filters.sizeBand) chips.push({ key: 'size', label: SIZE_LABELS[filters.sizeBand], clear: { sizeBand: '' } });
  if (filters.revenueBand) chips.push({ key: 'rev', label: REV_LABELS[filters.revenueBand], clear: { revenueBand: '' } });
  return chips;
}

export default function ResultsBar() {
  const { state, removeFilter, clearFilters, setSort } = useMarketplace();
  const chips = chipsFrom(state.filters, removeFilter);

  return (
    <div className="resultsbar">
      <div className="resultsbar__chips">
        {chips.length === 0 ? (
          <span className="resultsbar__none">No filters applied</span>
        ) : (
          <>
            {chips.map((c) => (
              <button key={c.key} className="chip-active" onClick={() => removeFilter(c.clear)}>
                {c.label} <span className="chip-active__x">✕</span>
              </button>
            ))}
            <button className="clear-link" onClick={clearFilters}>Clear all</button>
          </>
        )}
      </div>

      <label className="resultsbar__sort">
        <span>Sort</span>
        <select value={state.sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </label>
    </div>
  );
}
