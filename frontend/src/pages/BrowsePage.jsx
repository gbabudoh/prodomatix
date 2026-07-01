import SearchForm from '../components/SearchForm.jsx';
import ResultsBar from '../components/ResultsBar.jsx';
import FilterSidebar from '../components/FilterSidebar.jsx';
import DataTable from '../components/DataTable.jsx';
import SelectionBar from '../components/SelectionBar.jsx';
import { useMarketplace } from '../store/MarketplaceContext.jsx';

export default function BrowsePage() {
  const { state } = useMarketplace();
  return (
    <>
      <SearchForm />
      <ResultsBar />
      <div className="main">
        <FilterSidebar />
        <DataTable />
      </div>
      {state.error && <div className="banner banner--error">{state.error}</div>}
      <SelectionBar />
    </>
  );
}
