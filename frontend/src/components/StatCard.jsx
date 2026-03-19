export default function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="card flex items-center gap-4 px-5 py-4">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: accent ? `${accent}15` : '#5B8DEF15' }}
      >
        <Icon
          size={20}
          style={{ color: accent || '#5B8DEF' }}
        />
      </div>
      <div>
        <p className="text-2xl font-display font-semibold text-gray-900">
          {value}
        </p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  )
}
