import ManagementPage from '../components/ManagementPage.jsx';
import { createRecord, today, useStayManager } from '../context/StayManagerContext.jsx';

const fields = [
  { name: 'title', label: 'Issue or task', required: true, placeholder: 'e.g. Bathroom tap leakage', fullWidth: true },
  { name: 'room', label: 'Room or area', required: true, placeholder: 'e.g. 102 or Corridor' },
  { name: 'priority', label: 'Priority', type: 'select', required: true, options: ['Low', 'Medium', 'High', 'Urgent'] },
  { name: 'status', label: 'Task status', type: 'select', required: true, options: ['Open', 'In Progress', 'Completed'] },
  { name: 'createdAt', label: 'Reported date', type: 'date', required: true, defaultValue: today() },
  { name: 'notes', label: 'Additional notes', type: 'textarea', fullWidth: true, placeholder: 'Describe the issue, materials needed, or next steps.' },
];
const columns = [
  { key: 'title', label: 'MAINTENANCE REQUEST', render: item => <div className="primary-cell"><span className="table-avatar maintenance-avatar">⚙</span><div><strong>{item.title}</strong><small>Reported {item.createdAt || '—'}</small></div></div> },
  { key: 'room', label: 'ROOM / AREA', render: item => <span className="room-chip">{item.room}</span> },
  { key: 'priority', label: 'PRIORITY', render: item => <span className={'status-badge status-' + item.priority.toLowerCase()}>{item.priority}</span> },
  { key: 'status', label: 'STATUS', render: item => <span className={'status-badge status-' + item.status.toLowerCase().replaceAll(' ', '-')}>{item.status}</span> },
];
export default function Maintenance() {
  const { maintenance, setMaintenance } = useStayManager();
  function save(draft, editing) {
    if (!draft.title?.trim() || !draft.room?.trim()) { window.alert('Enter the issue and room or area.'); return false; }
    const task = { ...draft, title: draft.title.trim(), room: draft.room.trim() };
    setMaintenance(current => editing ? current.map(item => item.id === editing.id ? { ...task, id: editing.id } : item) : [...current, createRecord(task)]);
  }
  return <ManagementPage title="Maintenance" description="Log repair requests and follow each task through to completion." records={maintenance} fields={fields} columns={columns} onSave={save} onDelete={id => setMaintenance(current => current.filter(item => item.id !== id))} addLabel="Add request" searchPlaceholder="Search issue, room, or priority..." filterKey="status" filterOptions={['Open', 'In Progress', 'Completed']} summary={[{ label: 'Total requests', value: maintenance.length }, { label: 'Open', value: maintenance.filter(item => item.status === 'Open').length }, { label: 'In progress', value: maintenance.filter(item => item.status === 'In Progress').length }, { label: 'Completed', value: maintenance.filter(item => item.status === 'Completed').length }]} />;
}