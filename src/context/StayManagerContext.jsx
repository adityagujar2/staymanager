import { createContext, useContext, useEffect, useState } from 'react';

const StayManagerContext = createContext(null);
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

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
  { id: 'm1', title: 'Bathroom tap leakage', room: '102', priority: 'Medium', status: 'In Progress', createdAt: '2026-10-21', notes: '' },
  { id: 'm2', title: 'Replace corridor light', room: '201', priority: 'Low', status: 'Open', createdAt: '2026-10-22', notes: '' },
];

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch { return fallback; }
}

function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => API_BASE_URL ? fallback : readStored(key, fallback));
  useEffect(() => {
    if (API_BASE_URL) return;
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (error) { console.warn('Unable to save demo data in this browser:', error); }
  }, [key, value]);
  return [value, setValue];
}

async function apiRequest(path, { token, method = 'GET', body } = {}) {
  if (!API_BASE_URL) throw new Error('Set VITE_API_BASE_URL to enable the API.');
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = 'Bearer ' + token;
  const response = await fetch(API_BASE_URL + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let payload = {};
  try { payload = await response.json(); } catch { /* response may be empty */ }
  if (!response.ok) throw new Error(payload.message || 'Request failed (' + response.status + ').');
  return payload;
}

const resources = ['rooms', 'guests', 'payments', 'staff', 'attendance', 'maintenance'];

export function StayManagerProvider({ children }) {
  const [rooms, setRooms] = usePersistentState('staymanager_rooms', initialRooms);
  const [guests, setGuests] = usePersistentState('staymanager_guests', initialGuests);
  const [payments, setPayments] = usePersistentState('staymanager_payments', initialPayments);
  const [staff, setStaff] = usePersistentState('staymanager_staff', initialStaff);
  const [attendance, setAttendance] = usePersistentState('staymanager_attendance', initialAttendance);
  const [maintenance, setMaintenance] = usePersistentState('staymanager_maintenance', initialMaintenance);
  const [token, setToken] = useState(() => localStorage.getItem('staymanager_token') || '');
  const [authenticated, setAuthenticated] = useState(() => API_BASE_URL
    ? Boolean(localStorage.getItem('staymanager_token'))
    : Boolean(readStored('staymanager_demo_auth', false)));
  const [apiError, setApiError] = useState('');

  const setByResource = { rooms: setRooms, guests: setGuests, payments: setPayments, staff: setStaff, attendance: setAttendance, maintenance: setMaintenance };
  const dataByResource = { rooms, guests, payments, staff, attendance, maintenance };

  useEffect(() => {
    if (!API_BASE_URL || !authenticated || !token) return undefined;
    let active = true;
    (async () => {
      try {
        const results = await Promise.all(resources.map(resource => apiRequest('/' + resource, { token })));
        if (!active) return;
        results.forEach((records, index) => setByResource[resources[index]](records));
        setApiError('');
      } catch (error) {
        if (!active) return;
        setApiError(error.message);
        if (/session|token|unauthorized|expired/i.test(error.message)) {
          setToken('');
          localStorage.removeItem('staymanager_token');
          setAuthenticated(false);
        }
        console.error('StayManager API load failed:', error.message);
      }
    })();
    return () => { active = false; };
  }, [authenticated, token]);

  useEffect(() => {
    if (!API_BASE_URL) localStorage.setItem('staymanager_demo_auth', JSON.stringify(authenticated));
  }, [authenticated]);

  async function login(email, password) {
    if (!API_BASE_URL) {
      if (!email?.trim() || !password) throw new Error('Enter an email and password.');
      setAuthenticated(true);
      return { name: 'Admin', email };
    }
    const result = await apiRequest('/auth/login', { method: 'POST', body: { email, password } });
    localStorage.setItem('staymanager_token', result.token);
    setToken(result.token);
    setAuthenticated(true);
    return result.user;
  }

  async function register(name, email, password) {
    if (!API_BASE_URL) throw new Error('Administrator setup requires a configured backend.');
    const result = await apiRequest('/auth/register', { method: 'POST', body: { name, email, password } });
    localStorage.setItem('staymanager_token', result.token);
    setToken(result.token);
    setAuthenticated(true);
    return result.user;
  }

  function logout() {
    setAuthenticated(false);
    setToken('');
    localStorage.removeItem('staymanager_token');
  }

  async function saveRecord(resource, record, editing = null) {
    const setter = setByResource[resource];
    if (!setter) throw new Error('Unknown record type: ' + resource);
    if (API_BASE_URL) {
      if (!token) throw new Error('Your session is missing. Please sign in again.');
      const saved = await apiRequest('/' + resource + (editing ? '/' + encodeURIComponent(editing.id) : ''), {
        token, method: editing ? 'PUT' : 'POST', body: record,
      });
      setter(current => editing
        ? current.map(item => item.id === editing.id ? saved : item)
        : [...current, saved]);
      setApiError('');
      return saved;
    }
    const saved = editing ? { ...record, id: editing.id } : createRecord(record);
    setter(current => editing
      ? current.map(item => item.id === editing.id ? saved : item)
      : [...current, saved]);
    return saved;
  }

  async function deleteRecord(resource, id) {
    const setter = setByResource[resource];
    if (!setter) throw new Error('Unknown record type: ' + resource);
    if (API_BASE_URL) {
      if (!token) throw new Error('Your session is missing. Please sign in again.');
      await apiRequest('/' + resource + '/' + encodeURIComponent(id), { token, method: 'DELETE' });
    }
    setter(current => current.filter(item => item.id !== id));
  }

  return (
    <StayManagerContext.Provider value={{
      rooms, setRooms, guests, setGuests, payments, setPayments, staff, setStaff,
      attendance, setAttendance, maintenance, setMaintenance,
      authenticated, login, register, logout, apiEnabled: Boolean(API_BASE_URL), apiError,
      saveRecord, deleteRecord,
    }}>
      {children}
    </StayManagerContext.Provider>
  );
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
