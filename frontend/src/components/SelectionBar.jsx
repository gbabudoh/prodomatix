import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../store/MarketplaceContext.jsx';
import { moneyRound } from '../lib/format.js';

export default function SelectionBar() {
  const navigate = useNavigate();
  const { totals, clearSelection } = useMarketplace();
  const hasSelection = totals.count > 0;

  return (
    <div className={'selbar' + (hasSelection ? ' selbar--active' : '')}>
      <div className="selbar__group">
        <div>
          <div className="stat__num">{totals.count}</div>
          <div className="stat__label">suppliers selected</div>
        </div>
        {hasSelection && (
          <>
            <div className="divider" />
            <button className="link-muted" onClick={clearSelection}>Clear</button>
          </>
        )}
      </div>

      <div className="selbar__right">
        <div className="total">
          <div className="total__label">Estimated total</div>
          <div className="total__num">{moneyRound(totals.subtotal)}</div>
        </div>
        <button
          className="btn btn--primary"
          disabled={!hasSelection}
          onClick={() => hasSelection && navigate('/checkout')}
        >
          Continue to checkout →
        </button>
      </div>
    </div>
  );
}
