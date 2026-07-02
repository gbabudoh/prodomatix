import { useState, useMemo } from 'react';
import { api } from '../../../api/client.js';
import { useFetch } from '../useFetch.js';
import { AdminHeader } from '../AdminLayout.jsx';
import { Icon } from '../../../components/AdminIcons.jsx';
import { fmtNum, moneyRound } from '../../../lib/format.js';
import { COUNTRIES } from '../../../data/options.js';
import BusinessForm from '../BusinessForm.jsx';
import CountryFlag from '../../../components/CountryFlag.jsx';

export default function Businesses() {
  const { data, error, reload } = useFetch('/businesses?pageSize=200');
  const [editing, setEditing] = useState(null); // business | 'new' | null
  const [actionError, setActionError] = useState(null);
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('');
  const [industry, setIndustry] = useState('');
  const [category, setCategory] = useState(''); // businessType

  const items = data?.items || [];

  // Distinct, sorted option lists derived from the loaded catalogue.
  const opts = useMemo(() => {
    const uniq = (key) => [...new Set(items.map((b) => b[key]).filter(Boolean))].sort();
    return {
      countries: uniq('country'),
      industries: uniq('industry'),
      categories: uniq('businessType')
    };
  }, [items]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((b) => {
      if (country && b.country !== country) return false;
      if (industry && b.industry !== industry) return false;
      if (category && b.businessType !== category) return false;
      if (s && ![b.businessName, b.businessType, b.industry, b.country].some((v) => (v || '').toLowerCase().includes(s)))
        return false;
      return true;
    });
  }, [items, q, country, industry, category]);

  const hasFilters = country || industry || category || q;
  const clearFilters = () => { setQ(''); setCountry(''); setIndustry(''); setCategory(''); };

  const save = async (form) => {
    if (editing && editing !== 'new') await api.put(`/businesses/${editing.id}`, form);
    else await api.post('/businesses', form);
    setEditing(null);
    reload();
  };

  const remove = async (b) => {
    if (!window.confirm(`Delete "${b.businessName}"? This cannot be undone.`)) return;
    setActionError(null);
    try {
      await api.del(`/businesses/${b.id}`);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <>
      <AdminHeader title="Suppliers" subtitle={`${items.length} records in the catalogue`}>
        <button className="btn btn--primary btn--sm" onClick={() => setEditing('new')}>
          <Icon name="plus" size={16} /> Add supplier
        </button>
      </AdminHeader>

      <div className="xtoolbar">
        <div className="xsearch">
          <Icon name="search" size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, type, industry, country…" />
        </div>
        <select className="xselect" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {opts.categories.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select className="xselect" value={industry} onChange={(e) => setIndustry(e.target.value)}>
          <option value="">All industries</option>
          {opts.industries.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select className="xselect" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All countries</option>
          {COUNTRIES.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        {hasFilters && <button className="xclear" onClick={clearFilters}>Clear</button>}
        <span className="xtoolbar__count">{filtered.length} shown</span>
      </div>

      {(error || actionError) && <div className="auth__error">{error || actionError}</div>}

      <div className="xtable">
        <div className="xtable__head xtable__row--biz">
          <div>Supplier</div><div>Type</div><div>Industry</div><div>Country</div><div>Staff</div><div className="right">Price</div><div></div>
        </div>
        {filtered.map((b) => (
          <div className="xtable__row xtable__row--biz" key={b.id}>
            <div className="xcell-strong">{b.businessName}</div>
            <div className="cell" data-label="Type">{b.businessType}</div>
            <div className="cell" data-label="Industry">{b.industry}</div>
            <div className="cell" data-label="Country"><CountryFlag country={b.country} /></div>
            <div className="cell cell--mono" data-label="Staff">{fmtNum(b.staffCapacity)}</div>
            <div className="cell--price" data-label="Price">{moneyRound(b.price)}</div>
            <div className="xactions">
              <button className="iconbtn" title="Edit" onClick={() => setEditing(b)}><Icon name="edit" size={15} /></button>
              <button className="iconbtn iconbtn--danger" title="Delete" onClick={() => remove(b)}><Icon name="trash" size={15} /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="xempty">No suppliers match.</div>}
      </div>

      {editing && (
        <BusinessForm
          initial={editing === 'new' ? null : editing}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      )}
    </>
  );
}
