import ManagementPage from '../components/ManagementPage.jsx';
import { createRecord, today, useStayManager } from '../context/StayManagerContext.jsx';

const columns = [
  { key: 'staff', label: 'STAFF MEMBER', render: item => <div className="primary-cell"><span className="table-avatar staff-avatar">{item.staff?.charAt(0)?.toUpperCase() || 'S'}</span><div><strong>{item.staff}</strong><small>Daily attendance</small></div></div> },
  { key: 'date', label: 'DATE' },
  { key: 'status', label: 'ATTENDANCE', render: item => <span className={'status-badge status-' + item.status.toLowerCase().replaceAll(' ', '-')}>{item.status}</span> },
];
export default function Attendance() {
  const { attendance, setAttendance, staff } = useStayManager();
  const fields = [
    { name: 'staff', label: 'Staff member', type: 'select', required: true, options: staff.map(person => person.name) },
    { name: 'date', label: 'Attendance date', type: 'date', required: true, defaultValue: today() },
    { name: 'status', label: 'Attendance status', type: 'select', required: true, options: ['Present', 'Absent', 'Half Day', 'Leave'] },
  ];
  function save(draft, editing) {
    if (!draft.staff || !draft.date) { window.alert('Select a staff member and date.'); return; }
    const duplicate = attendance.some(item => item.staff === draft.staff && item.date === draft.date && item.id !== editing?.id);
    if (duplicate) { window.alert('Attendance for this staff member and date already exists. Edit the existing record instead.'); return; }
    const record = { ...draft };
    setAttendance(current => editing ? current.map(item => item.id === editing.id ? { ...record, id: editing.id } : item) : [...current, createRecord(record)]);
  }
  const currentDay = attendance.filter(item => item.date === today());
  return <ManagementPage title="Attendance" description="Record daily staff presence and keep attendance history searchable." records={attendance} fields={fields} columns={columns} onSave={save} onDelete={id => setAttendance(current => current.filter(item => item.id !== id))} addLabel="Record attendance" searchPlaceholder="Search staff member or date..." filterKey="status" filterOptions={['Present', 'Absent', 'Half Day', 'Leave']} summary={[{ label: 'Attendance entries', value: attendance.length }, { label: 'Marked today', value: currentDay.length }, { label: 'Present today', value: currentDay.filter(item => item.status === 'Present').length }, { label: 'Absent today', value: currentDay.filter(item => item.status === 'Absent').length }]} />;
}