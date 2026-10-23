import { useMemo, useState } from 'react';
import { useStayManager } from '../context/StayManagerContext.jsx';

function emptyDraft(fields) {
  return fields.reduce((draft, field) => {
    const firstOption = field.options?.[0];
    const firstValue = typeof firstOption === 'string' ? firstOption : (firstOption?.value ?? '');
    draft[field.name] = field.defaultValue ?? (field.type === 'select' ? firstValue : '');
    return draft;
  }, {});
}

export default function ManagementPage({
  title, description, records, fields, columns, onSave, onDelete,
  addLabel = 'Add record', searchPlaceholder = 'Search records...',
  filterKey = 'status', filterOptions = [], summary = [], rowActions = () => [],
}) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(() => emptyDraft(fields));
  const [saveError, setSaveError] = useState('');
  const { apiEnabled } = useStayManager();

  const visibleRecords = useMemo(() => records.filter(record => {
    const text = Object.values(record).join(' ').toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesFilter = statusFilter === 'All' || String(record[filterKey]) === statusFilter;
    return matchesQuery && matchesFilter;
  }), [records, query, statusFilter, filterKey]);

  function openCreate() {
    setEditing(null);
    setSaveError('');
    setDraft(emptyDraft(fields));
    setModalOpen(true);
  }
  function openEdit(record) {
    setEditing(record);
    setSaveError('');
    setDraft({ ...emptyDraft(fields), ...record });
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }
  async function submit(event) {
    event.preventDefault();
    setSaveError('');
    try {
      const result = await onSave(draft, editing);
      if (result === false) return;
      closeModal();
    } catch (error) { setSaveError(error.message || 'Could not save this record.'); }
  }
  async function remove(record) {
    if (!window.confirm('Delete this record? This action cannot be undone.')) return;
    try { await onDelete(record.id); }
    catch (error) { window.alert(error.message || 'Could not delete this record.'); }
  }
  async function runAction(action, record) {
    try { await action.onClick(record); }
    catch (error) { window.alert(error.message || 'That action could not be completed.'); }
  }

  return (
    <section className="management-page">
      <div className="page-intro"><div><span className="eyebrow">PROPERTY OPERATIONS</span><h2>{title}</h2><p>{description}</p></div><button className="primary-button" onClick={openCreate}><span>＋</span> {addLabel}</button></div>
      {summary.length > 0 && <div className="summary-grid">{summary.map(item => <div className="summary-card" key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.note || 'Current overview'}</small></div>)}</div>}
      <div className="table-card">
        <div className="table-toolbar"><div className="search-box"><span>⌕</span><input aria-label={searchPlaceholder} placeholder={searchPlaceholder} value={query} onChange={event => setQuery(event.target.value)} /></div>
          {filterOptions.length > 0 && <select className="filter-select" aria-label="Filter records" value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option value="All">All statuses</option>{filterOptions.map(option => <option key={option} value={option}>{option}</option>)}</select>}
          <span className="record-count">{visibleRecords.length} records</span>
        </div>
        <div className="table-scroll"><table className="data-table"><thead><tr>{columns.map(column => <th key={column.key}>{column.label}</th>)}<th className="action-heading">ACTIONS</th></tr></thead>
          <tbody>{visibleRecords.length === 0 ? <tr><td colSpan={columns.length + 1} className="empty-state"><span>⌕</span><strong>No matching records</strong><small>Try a different search or add a new record.</small></td></tr> : visibleRecords.map(record => <tr key={record.id}>{columns.map(column => <td key={column.key}>{column.render ? column.render(record) : (record[column.key] || '—')}</td>)}<td><div className="row-actions">{rowActions(record).map((action, index) => <button key={index} type="button" className={action.className || 'row-action'} onClick={() => runAction(action, record)}>{action.label}</button>)}<button className="row-action edit-action" onClick={() => openEdit(record)}>Edit</button><button className="row-action delete-action" onClick={() => remove(record)}>Delete</button></div></td></tr>)}</tbody>
        </table></div>
        <div className="table-footnote">Showing {visibleRecords.length} of {records.length} records <span>{apiEnabled ? 'Changes are saved through the connected API.' : 'Changes are saved in this browser for the demo.'}</span></div>
      </div>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeModal(); }}><section className="record-modal" role="dialog" aria-modal="true" aria-labelledby="record-modal-title">
        <div className="modal-heading"><div><span className="eyebrow">{editing ? 'UPDATE RECORD' : 'NEW RECORD'}</span><h3 id="record-modal-title">{editing ? 'Edit ' + title.toLowerCase().replace(/s$/, '') : addLabel}</h3><p>Enter the details below to keep your records up to date.</p></div><button className="modal-close" onClick={closeModal} aria-label="Close dialog">×</button></div>
        <form onSubmit={submit}><div className="form-grid">{fields.map(field => <div key={field.name} className={'form-field ' + (field.fullWidth ? 'form-field-full' : '')}><label htmlFor={'field-' + field.name}>{field.label}{field.required && <span> *</span>}</label>
          {field.type === 'select' ? <select id={'field-' + field.name} required={field.required} value={draft[field.name] ?? ''} onChange={event => setDraft(current => ({ ...current, [field.name]: event.target.value }))}><option value="">Choose {field.label.toLowerCase()}</option>{(field.options || []).map(option => { const item = typeof option === 'string' ? { label: option, value: option } : option; return <option value={item.value} key={item.value}>{item.label}</option>; })}</select> :
          field.type === 'textarea' ? <textarea id={'field-' + field.name} rows="3" required={field.required} placeholder={field.placeholder || ''} value={draft[field.name] ?? ''} onChange={event => setDraft(current => ({ ...current, [field.name]: event.target.value }))} /> :
          <input id={'field-' + field.name} type={field.type || 'text'} min={field.min} max={field.max} step={field.step} required={field.required} placeholder={field.placeholder || ''} value={draft[field.name] ?? ''} onChange={event => setDraft(current => ({ ...current, [field.name]: event.target.value }))} />}
          {field.help && <small className="field-help">{field.help}</small>}</div>)}</div>
          {saveError && <p className="form-error" role="alert">{saveError}</p>}
          <div className="modal-actions"><button type="button" className="secondary-button" onClick={closeModal}>Cancel</button><button type="submit" className="primary-button">{editing ? 'Save changes' : 'Create record'}</button></div>
        </form>
      </section></div>}
    </section>
  );
}