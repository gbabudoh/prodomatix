import { createContext, useContext, useMemo, useReducer, useCallback, useEffect } from 'react';
import { api } from '../api/client.js';
import { summarize } from '../lib/format.js';
import { useAuth } from './AuthContext.jsx';

const MarketplaceContext = createContext(null);

const emptyFilters = {
  search: '', types: [], industries: [], regions: [], countries: [],
  priceMin: '', priceMax: '', verifiedMin: '', sizeBand: '', revenueBand: ''
};

// Seed filters/sort/page from the URL so searches are shareable & survive refresh.
function initFromUrl() {
  const p = new URLSearchParams(window.location.search);
  const list = (k) => (p.get(k) ? p.get(k).split(',') : []);
  return {
    filters: {
      search: p.get('search') || '',
      types: list('types'),
      industries: list('industries'),
      regions: list('regions'),
      countries: list('countries'),
      priceMin: p.get('priceMin') || '',
      priceMax: p.get('priceMax') || '',
      verifiedMin: p.get('verifiedMin') || '',
      sizeBand: p.get('sizeBand') || '',
      revenueBand: p.get('revenueBand') || ''
    },
    sort: p.get('sort') || 'relevance',
    page: Number(p.get('page')) || 1
  };
}

const seed = initFromUrl();

const initialState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  page: seed.page,
  pageSize: 12,
  facets: { types: {}, industries: {}, regions: {}, countries: {} },
  priceBounds: { min: 0, max: 0 },
  options: { types: [], industries: [], regions: [], countries: [] },
  filters: seed.filters,
  sort: seed.sort,
  selected: {},     // { [businessId]: businessObject } — persists across pages
  lastOrder: null
};

function toggleIn(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
const withFilter = (state, patch) => ({ ...state, filters: { ...state.filters, ...patch }, page: 1 });

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_OK': {
      const d = action.data || {};
      const items = Array.isArray(d.items) ? d.items : Array.isArray(d) ? d : [];
      const facets = d.facets || { types: {}, industries: {}, regions: {} };
      return {
        ...state, loading: false,
        items,
        total: typeof d.total === 'number' ? d.total : items.length,
        page: d.page || 1,
        pageSize: d.pageSize || state.pageSize,
        facets: {
          types: facets.types || {},
          industries: facets.industries || {},
          regions: facets.regions || {},
          countries: facets.countries || {}
        },
        priceBounds: d.priceBounds || { min: 0, max: 0 }
      };
    }
    case 'LOAD_ERR':
      return { ...state, loading: false, error: action.error };
    case 'OPTIONS_OK':
      return { ...state, options: action.options };

    case 'SET_SEARCH':
      return withFilter(state, { search: action.value });
    case 'SET_TYPE':
      return withFilter(state, { types: action.value ? [action.value] : [] });
    case 'SET_INDUSTRY':
      return withFilter(state, { industries: action.value ? [action.value] : [] });
    case 'SET_REGION':
      return withFilter(state, { regions: action.value ? [action.value] : [] });
    case 'SET_COUNTRY':
      return withFilter(state, { countries: action.value ? [action.value] : [] });
    case 'TOGGLE_TYPE':
      return withFilter(state, { types: toggleIn(state.filters.types, action.value) });
    case 'TOGGLE_INDUSTRY':
      return withFilter(state, { industries: toggleIn(state.filters.industries, action.value) });
    case 'TOGGLE_REGION':
      return withFilter(state, { regions: toggleIn(state.filters.regions, action.value) });
    case 'TOGGLE_COUNTRY':
      return withFilter(state, { countries: toggleIn(state.filters.countries, action.value) });
    case 'SET_PRICE':
      return withFilter(state, { priceMin: action.min, priceMax: action.max });
    case 'SET_VERIFIED':
      return withFilter(state, { verifiedMin: action.value });
    case 'SET_SIZE_BAND':
      return withFilter(state, { sizeBand: action.value });
    case 'SET_REVENUE_BAND':
      return withFilter(state, { revenueBand: action.value });
    case 'REMOVE_FILTER':
      return withFilter(state, action.patch);
    case 'CLEAR_FILTERS':
      return { ...state, filters: { ...emptyFilters }, page: 1 };

    case 'SET_SORT':
      return { ...state, sort: action.value, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.value };

    case 'TOGGLE_ROW': {
      const selected = { ...state.selected };
      if (selected[action.business.id]) delete selected[action.business.id];
      else selected[action.business.id] = action.business;
      return { ...state, selected };
    }
    case 'SET_MANY': {
      const selected = { ...state.selected };
      if (action.select) action.businesses.forEach((b) => { selected[b.id] = b; });
      else action.businesses.forEach((b) => { delete selected[b.id]; });
      return { ...state, selected };
    }
    case 'CLEAR_SELECTION':
      return { ...state, selected: {} };

    case 'ORDER_DONE':
      return { ...state, selected: {}, lastOrder: action.order };
    case 'RESET':
      return { ...state, selected: {}, lastOrder: null };
    default:
      return state;
  }
}

function buildQuery({ filters, sort, page, pageSize }) {
  const p = new URLSearchParams();
  if (filters.search) p.set('search', filters.search);
  if (filters.types.length) p.set('types', filters.types.join(','));
  if (filters.industries.length) p.set('industries', filters.industries.join(','));
  if (filters.regions.length) p.set('regions', filters.regions.join(','));
  if (filters.countries.length) p.set('countries', filters.countries.join(','));
  if (filters.priceMin !== '') p.set('priceMin', filters.priceMin);
  if (filters.priceMax !== '') p.set('priceMax', filters.priceMax);
  if (filters.verifiedMin) p.set('verifiedMin', filters.verifiedMin);
  if (filters.sizeBand) p.set('sizeBand', filters.sizeBand);
  if (filters.revenueBand) p.set('revenueBand', filters.revenueBand);
  if (sort && sort !== 'relevance') p.set('sort', sort);
  p.set('page', String(page));
  p.set('pageSize', String(pageSize));
  return p.toString();
}

export function MarketplaceProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  const query = useMemo(
    () => buildQuery({ filters: state.filters, sort: state.sort, page: state.page, pageSize: state.pageSize }),
    [state.filters, state.sort, state.page, state.pageSize]
  );

  // Load options once after auth.
  useEffect(() => {
    if (!user) return;
    api.get('/businesses/options').then((options) => dispatch({ type: 'OPTIONS_OK', options })).catch(() => {});
  }, [user]);

  // Load results whenever the query changes.
  // When a search term is present, use TF-IDF ranked endpoint for relevance ordering.
  const reload = useCallback(async (qs) => {
    dispatch({ type: 'LOAD_START' });
    try {
      const params = new URLSearchParams(qs);
      const search = params.get('search');
      const data = search
        ? await api.get(`/businesses/search?q=${encodeURIComponent(search)}`)
        : await api.get(`/businesses?${qs}`);
      dispatch({ type: 'LOAD_OK', data });
    } catch (err) {
      dispatch({ type: 'LOAD_ERR', error: err.message });
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    reload(query);
    // Keep the browse URL shareable without disturbing other routes.
    const p = window.location.pathname;
    if (p === '/browse' || p === '/') {
      window.history.replaceState(null, '', query ? `/browse?${query}` : '/browse');
    }
  }, [user, query, reload]);

  const selectedBusinesses = useMemo(() => Object.values(state.selected), [state.selected]);
  const totals = useMemo(() => summarize(selectedBusinesses), [selectedBusinesses]);

  const checkout = useCallback(async (useFree) => {
    const businessIds = selectedBusinesses.map((b) => b.id);
    const order = await api.post('/purchases/checkout', { businessIds, free: !!useFree });
    dispatch({ type: 'ORDER_DONE', order });
    reload(query); // refresh owned flags
    return order;
  }, [selectedBusinesses, reload, query]);

  const actions = useMemo(() => ({
    reload: () => reload(query),
    setSearch: (value) => dispatch({ type: 'SET_SEARCH', value }),
    setType: (value) => dispatch({ type: 'SET_TYPE', value }),
    setIndustry: (value) => dispatch({ type: 'SET_INDUSTRY', value }),
    setRegion: (value) => dispatch({ type: 'SET_REGION', value }),
    setCountry: (value) => dispatch({ type: 'SET_COUNTRY', value }),
    toggleType: (value) => dispatch({ type: 'TOGGLE_TYPE', value }),
    toggleIndustry: (value) => dispatch({ type: 'TOGGLE_INDUSTRY', value }),
    toggleRegion: (value) => dispatch({ type: 'TOGGLE_REGION', value }),
    toggleCountry: (value) => dispatch({ type: 'TOGGLE_COUNTRY', value }),
    setPrice: (min, max) => dispatch({ type: 'SET_PRICE', min, max }),
    setVerified: (value) => dispatch({ type: 'SET_VERIFIED', value }),
    setSizeBand: (value) => dispatch({ type: 'SET_SIZE_BAND', value }),
    setRevenueBand: (value) => dispatch({ type: 'SET_REVENUE_BAND', value }),
    removeFilter: (patch) => dispatch({ type: 'REMOVE_FILTER', patch }),
    clearFilters: () => dispatch({ type: 'CLEAR_FILTERS' }),
    setSort: (value) => dispatch({ type: 'SET_SORT', value }),
    setPage: (value) => dispatch({ type: 'SET_PAGE', value }),
    toggleRow: (business) => dispatch({ type: 'TOGGLE_ROW', business }),
    setMany: (businesses, select) => dispatch({ type: 'SET_MANY', businesses, select }),
    clearSelection: () => dispatch({ type: 'CLEAR_SELECTION' }),
    checkout,
    reset: () => dispatch({ type: 'RESET' })
  }), [reload, query, checkout]);

  const value = { state, selectedBusinesses, totals, ...actions };
  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error('useMarketplace must be used within <MarketplaceProvider>');
  return ctx;
}
