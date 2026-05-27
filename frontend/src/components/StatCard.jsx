function StatCard({ icon, value, label }) {
  return (
    <div className="flex items-center justify-center gap-4 border-slate-200 px-6 py-5 md:border-r last:border-r-0">
      <div className="text-agriGreen">{icon}</div>

      <div>
        <h3 className="text-2xl font-extrabold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
