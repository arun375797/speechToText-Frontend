
import { motion } from "framer-motion";

export default function TranscriptionCard({ item, onDelete }) {
  return (
    <motion.div 
      className="card card-hover p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Transcription text */}
      <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-600/30 mb-4">
        <p className="text-slate-200 leading-relaxed">
          {item.transcription ?? item.text ?? ""}
        </p>
      </div>

      {/* Duration + Cost */}
      {item.duration > 0 && (
        <div className="flex gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 font-semibold">
              ⏱️ {item.duration < 1
                ? `${Math.round(item.duration * 60)} sec`
                : `${Math.round(item.duration)} min`}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 font-semibold">
              💰 ₹{item.cost ? item.cost.toFixed(2) : "0.00"}
            </span>
          </div>
        </div>
      )}

      {/* Date + Delete button */}
      <div className="flex justify-between items-center">
        <span className="text-slate-400 text-sm">
          📅 {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
        </span>
        {onDelete && (
          <button
            onClick={() => onDelete(item._id)}
            className="btn btn-danger btn-sm"
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </motion.div>
  );
}
