import ManagementPage from '../components/ManagementPage.jsx';
import { createRecord, useStayManager } from '../context/StayManagerContext.jsx';

const fields = [
  { name: 'name', label: 'Full name', required: true },
  { name: 'role', label: 'Role', type: 'select', required: true, options: ['Manager', 'Cook', 'Helper', 'Housekeeping', 'Security', 'Maintenance', 'Reception'] },
  { name: 'phone', label: 'Phone number', required: true, placeholder: 'Contact number' },
  { name: 'shift', label: 'Shift', type: 'select', required: true, options: ['Morning', 'Day', 'Evening', 'Night', 'Flexible'] },
  { name: 'status', label: 'Employment status', type: 'select', required: true, options: ['Active', 'On Leave', 'Inactive'] },
];
const columns = [
  { key: 'name', label: 'TEAM MEMBER', render: person => <div className="primary-cell"><span className="table-avatar staff-avatar">{person.name?.charAt(0)?.toUpperCase() || 'S'}</span><div><strong>{person.name}</strong><small>{person.phone}</small></div></div> },
  { key: 'role', label: 'ROLE', render: person => <span className="role-chip">{person.role}</span> },
  { key: 'shift', label: 'SHIFT' },
  { key: 'status', label: 'STATUS', render: person => <span className={'status-badge status-' + person.status.toLowerCase().replaceAll(' ', '-')}>{person.status}</span> },
];

export default function Staff() {
  const { staff, setStaff } = useStayManager();
  function save(draft, editing) {
    if (!draft.name?.trim() || !draft.phone?.trim()) { window.alert('Enter the staff member name and phone number.'); return false; }
    const person = { ...draft, name: draft.name.trim(), phone: draft.phone.trim() };
    setStaff(current => editing ? current.map(item => item.id === editing.id ? { ...person, id: editing.id } : item) : [...current, createRecord(person)]);
  }
  return <ManagementPage title="Staff" description="Maintain a clear record of your property team, roles, and shifts." records={staff} fields={fields} columns={columns} onSave={save} onDelete={id => setStaff(current => current.filter(person => person.id !== id))} addLabel="Add staff" searchPlaceholder="Search name, role, or phone..." filterKey="status" filterOptions={['Active', 'On Leave', 'Inactive']} summary={[{ label: 'Team members', value: staff.length }, { label: 'Active staff', value: staff.filter(person => person.status === 'Active').length }, { label: 'On leave', value: staff.filter(person => person.status === 'On Leave').length }, { label: 'Different roles', value: new Set(staff.map(person => person.role)).size }]} />;
}