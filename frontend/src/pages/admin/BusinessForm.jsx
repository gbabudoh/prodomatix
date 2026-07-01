import { useState } from 'react';
import { BUSINESS_TYPES } from '../../data/options.js';

const EMPTY = {
  businessName: '', businessType: 'Manufacturer', industry: '', country: '', location: '', region: '',
  website: '', email: '', phone: '', staffCapacity: 0, revenue: 0, price: 49,
  productOrService: '', description: '', contacts: 1, verified: 90,
  contactPersons: []
};

// Add/edit form for a business record. `initial` may be a full business
// (with contactPersons) when editing, or null when creating.
export default function BusinessForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(initial || {}), contactPersons: initial?.contactPersons || [] }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const num = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value === '' ? '' : Number(e.target.value) }));

  const setContact = (i, k) => (e) =>
    setForm((f) => ({
      ...f,
      contactPersons: f.contactPersons.map((c, idx) => (idx === i ? { ...c, [k]: e.target.value } : c))
    }));
  const addContact = () =>
    setForm((f) => ({ ...f, contactPersons: [...f.contactPersons, { name: '', title: '', email: '', phone: '' }] }));
  const removeContact = (i) =>
    setForm((f) => ({ ...f, contactPersons: f.contactPersons.filter((_, idx) => idx !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.businessName.trim()) {
      setError('Business name is required.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h2>{initial ? 'Edit business' : 'Add business'}</h2>
          <button className="remove-btn" onClick={onCancel}>✕</button>
        </div>

        <form className="modal__body" onSubmit={submit}>
          {error && <div className="auth__error">{error}</div>}

          <div className="form-grid">
            <label className="field span-2">
              <span>Business name *</span>
              <input className="input" value={form.businessName} onChange={set('businessName')} />
            </label>
            <label className="field">
              <span>Supplier type</span>
              <select className="input" value={form.businessType} onChange={set('businessType')}>
                {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Industry</span>
              <input className="input" value={form.industry} onChange={set('industry')} />
            </label>
            <label className="field">
              <span>Product / service</span>
              <input className="input" value={form.productOrService} onChange={set('productOrService')} />
            </label>
            <label className="field">
              <span>Price ($)</span>
              <input className="input input--mono" type="number" value={form.price} onChange={num('price')} />
            </label>
            <label className="field">
              <span>Country (public)</span>
              <input className="input" value={form.country} onChange={set('country')} />
            </label>
            <label className="field">
              <span>Region</span>
              <input className="input" value={form.region} onChange={set('region')} />
            </label>
            <label className="field span-2">
              <span>Location / address (locked)</span>
              <input className="input" value={form.location} onChange={set('location')} />
            </label>
            <label className="field">
              <span>Website</span>
              <input className="input" value={form.website} onChange={set('website')} />
            </label>
            <label className="field">
              <span>Email</span>
              <input className="input" value={form.email} onChange={set('email')} />
            </label>
            <label className="field">
              <span>Phone</span>
              <input className="input" value={form.phone} onChange={set('phone')} />
            </label>
            <label className="field">
              <span>Staff capacity</span>
              <input className="input input--mono" type="number" value={form.staffCapacity} onChange={num('staffCapacity')} />
            </label>
            <label className="field">
              <span>Revenue ($M)</span>
              <input className="input input--mono" type="number" value={form.revenue} onChange={num('revenue')} />
            </label>
            <label className="field">
              <span>Verified contacts</span>
              <input className="input input--mono" type="number" value={form.contacts} onChange={num('contacts')} />
            </label>
            <label className="field">
              <span>Verified %</span>
              <input className="input input--mono" type="number" value={form.verified} onChange={num('verified')} />
            </label>
            <label className="field span-2">
              <span>Description</span>
              <textarea className="input input--textarea" value={form.description} onChange={set('description')} />
            </label>
          </div>

          <div className="contacts-editor">
            <div className="contacts-editor__head">
              <span className="filter-label" style={{ margin: 0 }}>Contact persons</span>
              <button type="button" className="btn-soft btn-soft--sm" onClick={addContact}>+ Add contact</button>
            </div>
            {form.contactPersons.map((c, i) => (
              <div className="contact-row" key={i}>
                <input className="input" placeholder="Name" value={c.name} onChange={setContact(i, 'name')} />
                <input className="input" placeholder="Title" value={c.title} onChange={setContact(i, 'title')} />
                <input className="input" placeholder="Email" value={c.email} onChange={setContact(i, 'email')} />
                <input className="input" placeholder="Phone" value={c.phone} onChange={setContact(i, 'phone')} />
                <button type="button" className="remove-btn" onClick={() => removeContact(i)}>✕</button>
              </div>
            ))}
          </div>

          <div className="modal__actions">
            <button type="button" className="btn-soft" onClick={onCancel}>Cancel</button>
            <button className="btn btn--primary" disabled={busy}>
              {busy ? 'Saving…' : initial ? 'Save changes' : 'Create business'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
