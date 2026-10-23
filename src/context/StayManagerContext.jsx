import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const StayManagerContext = createContext(null);

const initialRooms = [
  { id: 'r1', number: '101', type: 'Double Sharing', capacity: 2, occupied: 1, monthlyRent: 7500, status: 'Available' },
  { id: 'r2', number: '102', type: 'Single Sharing', capacity: 1, occupied: 1, monthlyRent: 11000, status: 'Full' },
  { id: 'r3', number: '201', type: 'Triple Sharing', capacity: 3, occupied: 2, monthlyRent: 6000, status: 'Available' },
  { id: 'r4', number: '202', type: 'Double Sharing', capacity: 2, occupied: 0, monthlyRent: 7500, status: 'Available' },
];
const initialGuests = [
  { id: 'g1', name: 'Rahul Sharma', phone: '9876543210', room: '101', checkIn: '2026-10-01', checkOut: '', monthlyRent: 7500, status: 'Active' },
  { id: 'g2', name: 'Aman Kumar', phone: '9876543211', room: '102', checkIn: '2026-09-18', checkOut: '', monthlyRent: 11000, status: 'Active' },
  { id: 'g3', name: 'Vikas Singh', phone: '9876543212', room: '201', checkIn: '2026-10-12', checkOut: '', monthlyRent: 6000, status: 'Active' },
];
const initialPayments = [
  { id: 'p1', guest: 'Rahul Sharma', room: '101', amount: 7500, dueDate: '2026-10-05', paymentDate: '2026-10-04', status: 'Paid' },
  { id: 'p2', guest: 'Aman Kumar', room: '102', amount: 11000, dueDate: '2026-10-10', paymentDate: '', status: 'Pending' },
  { id: 'p3', guest: 'Vikas Singh', room: '201', amount: 6000, dueDate: '2026-10-12', paymentDate: '', status: 'Overdue' },
];
const initialStaff = [
  { id: 's1', name: 'Deepak Kumar', role: 'Cook', phone: '9876500001', shift: 'Morning', status: 'Active' },
  { id: 's2', name: 'Manisha Devi', role: 'Housekeeping', phone: '9876500002', shift: 'Day', status: 'Active' },
  { id: 's3', name: 'Nagesh Paswan', role: 'Helper', phone: '9876500003', shift: 'Morning', status: 'Active' },
];
const initialAttendance = [
  { id: 'a1', staff: 'Deepak Kumar', date: '2026-10-22', status: 'Present' },
  { id: 'a2', staff: 'Manisha Devi', date: '2026-10-22', status: 'Present' },
  { id: 'a3', staff: 'Nagesh Paswan', date: '2026-10-22', status: 'Absent' },
];
const initialMaintenance = [
  { id: 'm1', title: 'Bathroom tap leakage', room: '102', priority: 'Medium', status: 'In Progress', createdAt: '2026-10-21' },
  { id: 'm2', title: 'Replace corridor light', room: '201', priority: 'Low', status: 'Open', createdAt: '2026-10-22' },
];

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => readStored(key, fallback));
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) {
      console.warn('Unable to save local demo data:', error);
    }
  }, [key, value]);
  return [value, setValue];
}

export function StayManagerProvider({ children }) {
  const [rooms, setRooms] = usePersistentState('staymanager_rooms', initialRooms);
  const [guests, setGuests] = usePersistentState('staymanager_guests', initialGuests);
  const [payments, setPayments] = usePersistentState('staymanager_payments', initialPayments);
  const [staff, setStaff] = usePersistentState('staymanager_staff', initialStaff);
  const [attendance, setAttendance] = usePersistentState('staymanager_attendance', initialAttendance);
  const [maintenance, setMaintenance] = usePersistentState('staymanager_maintenance', initialMaintenance);
  const [authenticated, setAuthenticated] = usePersistentState('staymanager_demo_auth', false);

  const value = useMemo(() => ({
    rooms, setRooms, guests, setGuests, payments, setPayments,
    staff, setStaff, attendance, setAttendance, maintenance, setMaintenance,
    authenticated, login: () => setAuthenticated(true), logout: () => setAuthenticated(false),
  }), [rooms, guests, payments, staff, attendance, maintenance, authenticated]);

  return <StayManagerContext.Provider value={value}>{children}</StayManagerContext.Provider>;
}

export function useStayManager() {
  const context = useContext(StayManagerContext);
  if (!context) throw new Error('useStayManager must be used inside StayManagerProvider');
  return context;
}

export function createRecord(record) {
  return { ...record, id: globalThis.crypto?.randomUUID?.() ?? String(Date.now() + Math.random()) };
}

export function money(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0);
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}