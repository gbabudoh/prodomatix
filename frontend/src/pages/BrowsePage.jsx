import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/SearchForm.jsx';
import ResultsBar from '../components/ResultsBar.jsx';
import FilterSidebar from '../components/FilterSidebar.jsx';
import DataTable from '../components/DataTable.jsx';
import SelectionBar from '../components/SelectionBar.jsx';
import CountryFlag from '../components/CountryFlag.jsx';
import IndustryDot from '../components/IndustryDot.jsx';
import { useMarketplace } from '../store/MarketplaceContext.jsx';
import { api } from '../api/client.js';
import { moneyRound } from '../lib/format.js';

function RecommendedStrip() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/businesses/recommended').then(setItems).catch(() => {});
  }, []);

  if (!items.length) return null;

  return (
    <div className="rec-strip">
      <div className="rec-strip__head">
        <span className="rec-strip__title">Recommended for you</span>
        <span className="rec-strip__sub">Based on your purchase history</span>
      </div>
      <div className="rec-strip__scroll">
        {items.map(b => (
          <Link key={b.id} to={`/business/${b.id}`} className="rec-card">
            <div className="rec-card__top">
              <IndustryDot industry={b.industry} />
              <span className="rec-card__name">{b.businessName}</span>
            </div>
            <div className="rec-card__meta">
              <CountryFlag country={b.country} />
              <span className="rec-card__industry">{b.industry}</span>
            </div>
            <div className="rec-card__price">{moneyRound(b.price)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  const { state } = useMarketplace();
  const hasFilters = state.filters.search ||
    state.filters.types.length || state.filters.industries.length ||
    state.filters.countries.length || state.filters.regions.length;

  return (
    <>
      <SearchForm />
      <ResultsBar />
      {!hasFilters && <RecommendedStrip />}
      <div className="main">
        <FilterSidebar />
        <DataTable />
      </div>
      {state.error && <div className="banner banner--error">{state.error}</div>}
      <SelectionBar />
    </>
  );
}
