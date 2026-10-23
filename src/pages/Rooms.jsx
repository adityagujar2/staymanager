import ManagementPage from '../components/ManagementPage.jsx';
import { createRecord, money, useStayManager } from '../context/StayManagerContext.jsx';

const fields = [
  { name: 'number', label: 'Room number', required: true, placeholder: 'e.g. 103' },
  { name: 'type', label: 'Sharing type', type: 'select', required: true, options: ['Single Sharing', 'Double Sharing', 'Triple Sharing', 'Dormitory'] },
  { name: 'capacity', label: 'Total beds', type: 'number', min: 1, required: true, defaultValue: '2' },
  { name: 'occupied', label: 'Occupied beds', type: 'number', min: 0, required: true, defaultValue: '0' },
  { name: 'monthlyRent', label: 'Monthly rent (₹)', type: 'number', min: 0, required: true, defaultValue: '7500' },
];
const columns = [
  { key: 'number', label: 'ROOM', render: room => <div className="primary-cell"><span className="table-avatar room-avatar">⌂</span><div><strong>Room {room.number}</strong><small>{room.type}</small></div></div> },
  { key: 'beds', label: 'BED OCCUPANCY', render: room => <div className="bed-occupancy"><div className="bed-text"><strong>{room.occupied}/{room.capacity}</strong><small>beds used</small></div><div className="progress-track"><span style={{ width: Math.min(100, Number(room.capacity) ? Number(room.occupied) / Number(room.capacity) * 100 : 0) + '%' }} /></div></div> },
  { key: 'monthlyRent', label: 'MONTHLY RENT', render: room => <strong>{money(room.monthlyRent)}</strong> },
  { key: 'status', label: 'STATUS', render: room => <span className={'status-badge status-' + room.status.toLowerCase()}>{room.status}</span> },
];

export default function Rooms() {
  const { rooms, setRooms } = useStayManager();
  const normalized = rooms.map(room => ({ ...room, status: Number(room.occupied) >= Number(room.capacity) ? 'Full' : Number(room.occupied) === 0 ? 'Vacant' : 'Available' }));
  function save(draft, editing) {
    const capacity = Number(draft.capacity);
    const occupied = Number(draft.occupied);
    if (!draft.number?.trim() || capacity < 1 || occupied < 0 || occupied > capacity) {
      window.alert('Please enter a room number and make sure occupied beds are between zero and total beds.');
      return false;
    }
    const room = { ...draft, capacity, occupied, monthlyRent: Number(draft.monthlyRent), status: occupied >= capacity ? 'Full' : occupied === 0 ? 'Vacant' : 'Available' };
    setRooms(current => editing ? current.map(item => item.id === editing.id ? { ...room, id: editing.id } : item) : [...current, createRecord(room)]);
  }
  return <ManagementPage title="Rooms" description="Manage room inventory, occupancy, and monthly rent." records={normalized} fields={fields} columns={columns} onSave={save} onDelete={id => setRooms(current => current.filter(room => room.id !== id))} addLabel="Add room" searchPlaceholder="Search by room number or sharing type..." filterKey="status" filterOptions={['Vacant', 'Available', 'Full']} summary={[{ label: 'Total rooms', value: rooms.length }, { label: 'Beds available', value: rooms.reduce((sum, room) => sum + Math.max(0, Number(room.capacity) - Number(room.occupied)), 0) }, { label: 'Fully occupied', value: normalized.filter(room => room.status === 'Full').length }, { label: 'Monthly rent potential', value: money(rooms.reduce((sum, room) => sum + Number(room.monthlyRent) * Number(room.capacity), 0)) }]} />;
}