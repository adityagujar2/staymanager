import ManagementPage from '../components/ManagementPage.jsx';
import { createRecord, money, today, useStayManager } from '../context/StayManagerContext.jsx';

const columns = [
  { key: 'guest', label: 'GUEST', render: payment => <div className="primary-cell"><span className="table-avatar payment-avatar">₹</span><div><strong>{payment.guest}</strong><small>Room {payment.room}</small></div></div> },
  { key: 'amount', label: 'AMOUNT', render: payment => <strong>{money(payment.amount)}</strong> },
  { key: 'dueDate', label: 'DUE DATE' },
  { key: 'paymentDate', label: 'PAID ON', render: payment => payment.paymentDate || '—' },
  { key: 'status', label: 'STATUS', render: payment => <span className={'status-badge status-' + payment.status.toLowerCase()}>{payment.status}</span> },
];
const fields = [
  { name: 'guest', label: 'Guest name', required: true, placeholder: 'Resident name' },
  { name: 'room', label: 'Room number', required: true, placeholder: 'e.g. 101' },
  { name: 'amount', label: 'Amount (₹)', type: 'number', min: 1, required: true },
  { name: 'dueDate', label: 'Due date', type: 'date', required: true, defaultValue: today() },
  { name: 'paymentDate', label: 'Payment date', type: 'date' },
  { name: 'status', label: 'Payment status', type: 'select', required: true, options: ['Paid', 'Pending', 'Overdue'] },
];

export default function Payments() {
  const { payments, setPayments } = useStayManager();
  const collected = payments.filter(payment => payment.status === 'Paid').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const pending = payments.filter(payment => payment.status === 'Pending').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const overdue = payments.filter(payment => payment.status === 'Overdue').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  function save(draft, editing) {
    if (!draft.guest?.trim() || Number(draft.amount) <= 0 || !draft.dueDate) {
      window.alert('Enter a guest name, positive amount, and due date.');
      return;
    }
    const record = { ...draft, guest: draft.guest.trim(), amount: Number(draft.amount), paymentDate: draft.status === 'Paid' ? (draft.paymentDate || today()) : '' };
    setPayments(current => editing ? current.map(item => item.id === editing.id ? { ...record, id: editing.id } : item) : [...current, createRecord(record)]);
  }
  function markPaid(record) {
    setPayments(current => current.map(item => item.id === record.id ? { ...item, status: 'Paid', paymentDate: today() } : item));
  }
  return <ManagementPage title="Payments" description="Track rent collection, due dates, and outstanding balances." records={payments} fields={fields} columns={columns} onSave={save} onDelete={id => setPayments(current => current.filter(payment => payment.id !== id))} addLabel="Add payment" searchPlaceholder="Search guest name, room, or amount..." filterKey="status" filterOptions={['Paid', 'Pending', 'Overdue']} rowActions={record => record.status === 'Paid' ? [] : [{ label: 'Mark paid', className: 'row-action paid-action', onClick: markPaid }]} summary={[{ label: 'Total collected', value: money(collected) }, { label: 'Pending payments', value: money(pending) }, { label: 'Overdue payments', value: money(overdue) }, { label: 'Payment records', value: payments.length }]} />;
}