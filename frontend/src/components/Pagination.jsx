import { useMarketplace } from '../store/MarketplaceContext.jsx';

export default function Pagination() {
  const { state, setPage } = useMarketplace();
  const { total, page, pageSize } = state;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className="pagination">
      <span className="pagination__info">{start}–{end} of {total}</span>
      <div className="pagination__controls">
        <button className="page-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button>
        <span className="pagination__current">Page {page} of {pages}</span>
        <button className="page-btn" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next →</button>
      </div>
    </div>
  );
}
