
export default function TranscriptionCard({ item, onDelete }) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-700">
      {/* Transcription text */}
      <p className="text-gray-200 mb-2">
        {item.transcription ?? item.text ?? ""}
      </p>

      {/* Duration + Cost */}
      {item.duration > 0 && (
        <p className="text-gray-400 text-sm mb-2">
          Duration:{" "}
          {item.duration < 1
            ? `${Math.round(item.duration * 60)} sec`
            : `${Math.round(item.duration)} min`}
          {" | "}Cost: ₹{item.cost ? item.cost.toFixed(2) : "0.00"}
        </p>
      )}

      {/* Date + Delete button */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</span>
        {onDelete && (
          <button
            onClick={() => onDelete(item._id)}
            className="text-red-400 hover:text-red-600 font-semibold text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
