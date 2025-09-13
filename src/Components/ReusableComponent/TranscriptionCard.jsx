
export default function TranscriptionCard({ item, onDelete }) {
  return (
    <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
      {/* Transcription text */}
      <p className="text-gray-200 mb-3 leading-relaxed">
        {item.transcription ?? item.text ?? ""}
      </p>

      {/* Duration + Cost */}
      {item.duration > 0 && (
        <div className="flex gap-4 mb-3 text-sm">
          <span className="text-cyan-400 font-medium">
            ⏱️ {item.duration < 1
              ? `${Math.round(item.duration * 60)} sec`
              : `${Math.round(item.duration)} min`}
          </span>
          <span className="text-emerald-400 font-medium">
            💰 ₹{item.cost ? item.cost.toFixed(2) : "0.00"}
          </span>
        </div>
      )}

      {/* Date + Delete button */}
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-xs">
          📅 {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
        </span>
        {onDelete && (
          <button
            onClick={() => onDelete(item._id)}
            className="btn-danger btn-sm"
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
}
