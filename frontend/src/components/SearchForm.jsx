import { useState, useEffect } from 'react';
import { useMarketplace } from '../store/MarketplaceContext.jsx';
import { ALL_COUNTRIES } from '../data/countries.js';

// High-level search form. Keyword is applied on submit; the type/industry/region
// dropdowns apply live and stay in sync with the sidebar (shared filter state).
export default function SearchForm() {
  const { state, setSearch, setType, setIndustry, setRegion, setCountry } = useMarketplace();
  const { filters, options, total } = state;
  const [keyword, setKeyword] = useState(filters.search);

  // Keep the local keyword box in sync if filters are cleared elsewhere.
  useEffect(() => { setKeyword(filters.search); }, [filters.search]);

  const submit = (e) => {
    e.preventDefault();
    setSearch(keyword.trim());
  };

  return (
    <form className="searchform" onSubmit={submit}>
      <div className="searchform__row">
        <div className="searchform__keyword">
          <span className="search__icon">⌕</span>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search suppliers by name, product or keyword…"
          />
        </div>

        <select className="searchform__select" value={filters.types[0] || ''} onChange={(e) => setType(e.target.value)}>
          <option value="">All supplier types</option>
          {options.types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select className="searchform__select" value={filters.industries[0] || ''} onChange={(e) => setIndustry(e.target.value)}>
          <option value="">All industries</option>
          {options.industries.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>

        <select className="searchform__select" value={filters.regions[0] || ''} onChange={(e) => setRegion(e.target.value)}>
          <option value="">All regions</option>
          {options.regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        <select className="searchform__select" value={filters.countries[0] || ''} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All countries</option>
          {ALL_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <button type="submit" className="btn btn--primary searchform__btn">Search</button>
      </div>
      <div className="searchform__hint">{total} suppliers match your criteria</div>
    </form>
  );
}
