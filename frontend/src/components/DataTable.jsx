import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../store/MarketplaceContext.jsx';
import { moneyRound, priceOf } from '../lib/format.js';
import IndustryDot from './IndustryDot.jsx';
import TypeBadge from './TypeBadge.jsx';
import CountryFlag from './CountryFlag.jsx';
import Pagination from './Pagination.jsx';

export default function DataTable() {
  const navigate = useNavigate();
  const { state, toggleRow, setMany } = useMarketplace();
  const { selected, items, total, loading } = state;

  const selectable = items.filter((b) => !b.owned);
  const allSelected = selectable.length > 0 && selectable.every((b) => selected[b.id]);

  const onSelectAll = () => setMany(selectable, !allSelected);

  return (
    <div className="content">
      <div className="toolbar">
        <div className="toolbar__info">
          <b>{total}</b> suppliers found
        </div>
        <button
          className={'btn-select-all' + (allSelected ? ' is-on' : '')}
          onClick={onSelectAll}
          disabled={selectable.length === 0}
        >
          {allSelected ? 'Deselect page' : `Select page (${selectable.length})`}
        </button>
      </div>

      <div className="table__head table__head--niche">
        <div />
        <div>Supplier</div>
        <div>Type</div>
        <div>Industry</div>
        <div>Country</div>
        <div>Match</div>
        <div className="right">Price</div>
      </div>

      <div className="table__body">
        {loading && Array.from({ length: 8 }).map((_, i) => (
          <div className="skel-row skel-row--niche" key={i}>
            <div className="skel skel-check" />
            <div className="company-cell">
              <div className="skel skel-circle" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="skel skel-cell skel-cell--lg" style={{ marginBottom: 6 }} />
                <div className="skel skel-cell skel-cell--sm" style={{ height: 10 }} />
              </div>
            </div>
            <div className="skel skel-cell skel-cell--sm" />
            <div className="skel skel-cell skel-cell--md" />
            <div className="skel skel-cell skel-cell--sm" />
            <div className="skel skel-cell skel-cell--sm" />
            <div className="skel skel-cell skel-cell--sm" />
          </div>
        ))}

        {!loading && items.length === 0 && (
          <div className="table__empty-state">
            <div className="table__empty-icon">⌕</div>
            <div className="table__empty-title">No suppliers match your search</div>
            <div className="table__empty-hint">Try widening your filters or clearing your search terms.</div>
          </div>
        )}

        {!loading && items.map((b) => {
          const isSel = !!selected[b.id];
          const owned = b.owned;
          return (
            <div
              key={b.id}
              className={'row row--niche' + (isSel ? ' is-selected' : '') + (owned ? ' is-owned' : '')}
              onClick={() => navigate(`/business/${b.id}`)}
            >
              <div
                className={'checkbox lg' + (isSel ? ' is-on' : '') + (owned ? ' is-disabled' : '')}
                onClick={(e) => { e.stopPropagation(); if (!owned) toggleRow(b); }}
                title={owned ? 'Already owned' : 'Select'}
              >
                {owned ? '•' : isSel ? '✓' : ''}
              </div>
              <div className="company-cell">
                <IndustryDot industry={b.industry} />
                <div style={{ minWidth: 0 }}>
                  <div className="company-name">{b.businessName}</div>
                  <div className="company-domain">{owned ? 'Unlocked · view details' : 'Locked · click to preview'}</div>
                </div>
              </div>
              <div className="cell"><TypeBadge type={b.businessType} /></div>
              <div className="cell">{b.industry}</div>
              <div className="cell"><CountryFlag country={b.country} /></div>
              <div className="cell--match">{b.verified}% verified</div>
              <div className="cell--price">
                {owned ? <span className="owned-tag">Owned</span> : moneyRound(priceOf(b))}
              </div>
            </div>
          );
        })}
        <div style={{ height: 8 }} />
      </div>

      <Pagination />
    </div>
  );
}
