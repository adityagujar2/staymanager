import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard.jsx';
import { money, useStayManager } from '../context/StayManagerContext.jsx';

function Badge({ value }) {
  const cls = String(value || '').toLowerCase().replaceAll(' ', '-');
  return <span className={'status-badge status-' + cls}>{value || '—'}</span>;
}

export default function Dashboard() {
  const { rooms, guests, payments, staff, maintenance, apiError, apiEnabled } = useStayManager();
  const activeGuests = guests.filter(guest => guest.status === 'Active').length;
  const bedCapacity = rooms.reduce((sum, room) => sum + Number(room.capacity || 0), 0);
  const occupiedBeds = rooms.reduce((sum, room) => sum + Number(room.occupied || 0), 0);
  const occupancy = bedCapacity ? Math.round(occupiedBeds / bedCapacity * 100) : 0;
  const collected = payments.filter(payment => payment.status === 'Paid').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const pending = payments.filter(payment => payment.status !== 'Paid').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const openTasks = maintenance.filter(task => task.status !== 'Completed').length;
  const latestPayments = [...payments].slice(-5).reverse();

  return <div className="dashboard-page">
    {apiEnabled && apiError && <div className="api-warning" role="alert"><strong>API connection issue</strong><span>{apiError}</span></div>}
    <div className="welcome-banner"><div><span className="banner-label">YOUR OPERATIONS, AT A GLANCE</span><h2>Good day, Admin <span>✦</span></h2><p>Here’s the latest snapshot of your property workspace.</p></div><div className="banner-art"><div className="art-ring ring-one" /><div className="art-ring ring-two" /><div className="art-building">⌂</div><span className="art-spark spark-a">✦</span><span className="art-spark spark-b">✧</span></div></div>
    <div className="section-heading"><div><h2>Overview</h2><p>{apiEnabled ? 'Live summary from your connected property database.' : 'A live summary of the data in this browser.'}</p></div><span className="updated-pill"><span /> DEMO DATA</span></div>
    <div className="stats-grid">
      <StatCard label="Active guests" value={activeGuests} note="Residents currently staying" icon="♙" tone="blue" />
      <StatCard label="Room occupancy" value={occupancy + '%'} note={occupiedBeds + ' of ' + bedCapacity + ' beds occupied'} icon="⌂" tone="violet" />
      <StatCard label="Rent collected" value={money(collected)} note="Marked as paid" icon="₹" tone="green" />
      <StatCard label="Pending rent" value={money(pending)} note="Pending and overdue payments" icon="◷" tone="amber" />
    </div>
    <div className="dashboard-columns">
      <section className="content-card payments-card"><div className="card-heading"><div><h3>Recent payments</h3><p>Latest payment records</p></div><Link to="/payments" className="text-link">View all <span>→</span></Link></div>
        {latestPayments.length ? <div className="mini-table-wrap"><table className="data-table"><thead><tr><th>GUEST</th><th>ROOM</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>{latestPayments.map(payment => <tr key={payment.id}><td><strong>{payment.guest}</strong></td><td>{payment.room}</td><td className="amount-cell">{money(payment.amount)}</td><td><Badge value={payment.status} /></td></tr>)}</tbody></table></div> : <div className="empty-inline">No payment records yet.</div>}
      </section>
      <section className="content-card quick-card"><div className="card-heading"><div><h3>Quick actions</h3><p>Jump into the everyday tasks</p></div><span className="quick-mark">✦</span></div>
        <Link className="quick-action" to="/guests"><span className="quick-icon quick-blue">＋</span><span><strong>Add a guest</strong><small>Register a new resident</small></span><b>→</b></Link>
        <Link className="quick-action" to="/payments"><span className="quick-icon quick-green">₹</span><span><strong>Record a payment</strong><small>Track rent collection</small></span><b>→</b></Link>
        <Link className="quick-action" to="/rooms"><span className="quick-icon quick-violet">⌂</span><span><strong>Check rooms</strong><small>Review availability</small></span><b>→</b></Link>
        <Link className="quick-action" to="/maintenance"><span className="quick-icon quick-amber">⚙</span><span><strong>Review maintenance</strong><small>{openTasks} open or active tasks</small></span><b>→</b></Link>
      </section>
    </div>
    <div className="lower-stats"><div className="lower-stat"><span className="lower-icon">⌂</span><div><small>Total rooms</small><strong>{rooms.length}</strong></div><Link to="/rooms">Explore →</Link></div><div className="lower-stat"><span className="lower-icon purple">♧</span><div><small>Active staff</small><strong>{staff.filter(person => person.status === 'Active').length}</strong></div><Link to="/staff">Team →</Link></div><div className="lower-stat"><span className="lower-icon orange">⚙</span><div><small>Maintenance</small><strong>{openTasks}</strong></div><Link to="/maintenance">Requests →</Link></div></div>
  </div>;
}