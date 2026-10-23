import ManagementPage from '../components/ManagementPage.jsx';
import { money, today, useStayManager } from '../context/StayManagerContext.jsx';

const baseFields = [
  { name: 'name', label: 'Full name', required: true, placeholder: 'Resident full name' },
  { name: 'phone', label: 'Phone number', required: true, placeholder: '10-digit phone number' },
  { name: 'room', label: 'Room', type: 'select', required: true, options: [] },
  { name: 'checkIn', label: 'Check-in date', type: 'date', required: true, defaultValue: today() },
  { name: 'checkOut', label: 'Expected check-out', type: 'date' },
  { name: 'monthlyRent', label: 'Monthly rent (₹)', type: 'number', min: 0, required: true, defaultValue: '7500' },
  { name: 'status', label: 'Resident status', type: 'select', required: true, options: ['Active', 'Checked Out'] },
];
const columns = [
  { key: 'name', label: 'GUEST', render: guest => <div className="primary-cell"><span className="table-avatar guest-avatar">{guest.name?.trim()?.charAt(0)?.toUpperCase() || 'G'}</span><div><strong>{guest.name}</strong><small>{guest.phone}</small></div></div> },
  { key: 'room', label: 'ROOM', render: guest => <span className="room-chip">{guest.room ? 'Room ' + guest.room : 'Unassigned'}</span> },
  { key: 'checkIn', label: 'CHECK-IN', render: guest => guest.checkIn || '—' },
  { key: 'monthlyRent', label: 'MONTHLY RENT', render: guest => <strong>{money(guest.monthlyRent)}</strong> },
  { key: 'status', label: 'STATUS', render: guest => <span className={'status-badge status-' + guest.status.toLowerCase().replaceAll(' ', '-')}>{guest.status}</span> },
];

export default function Guests() {
  const { guests, rooms, saveRecord, deleteRecord } = useStayManager();
  const fields = baseFields.map(field => field.name === 'room' ? { ...field, options: rooms.map(room => ({ value: room.number, label: 'Room ' + room.number + ' · ' + room.type })) } : field);
  function save(draft, editing) {
    if (!draft.name?.trim() || !/^\+?[0-9\s-]{8,15}$/.test(draft.phone || '')) {
      window.alert('Enter the guest name and a valid phone number.');
      return false;
    }
    const guest = { ...draft, name: draft.name.trim(), phone: draft.phone.trim(), monthlyRent: Number(draft.monthlyRent) };
    return saveRecord('guests', guest, editing);
  }
  return <ManagementPage title="Guests" description="Keep resident information, room assignments, and stay dates organized." records={guests} fields={fields} columns={columns} onSave={save} onDelete={id => deleteRecord('guests', id)} addLabel="Add guest" searchPlaceholder="Search by guest name, phone, or room..." filterKey="status" filterOptions={['Active', 'Checked Out']} summary={[{ label: 'Total residents', value: guests.length }, { label: 'Currently staying', value: guests.filter(guest => guest.status === 'Active').length }, { label: 'Monthly rent value', value: money(guests.filter(guest => guest.status === 'Active').reduce((sum, guest) => sum + Number(guest.monthlyRent || 0), 0)) }, { label: 'Checked out', value: guests.filter(guest => guest.status !== 'Active').length }]} />;
}