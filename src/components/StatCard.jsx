export default function StatCard({ label, value, note, icon, tone = 'blue' }) {
  return (
    <article className="stat-card">
      <div className="stat-card-top"><span>{label}</span><span className={'stat-icon ' + tone}>{icon}</span></div>
      <strong className="stat-value">{value}</strong>
      <p>{note}</p>
    </article>
  );
}