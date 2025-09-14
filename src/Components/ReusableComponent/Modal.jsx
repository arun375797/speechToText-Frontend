import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = "info", // info, success, warning, danger
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  showCancel = true,
  showConfirm = true
}) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: "✅",
          iconBg: "bg-emerald-500/20",
          iconColor: "text-emerald-400",
          titleColor: "text-emerald-400",
          borderColor: "border-emerald-500/30"
        };
      case "warning":
        return {
          icon: "⚠️",
          iconBg: "bg-yellow-500/20",
          iconColor: "text-yellow-400",
          titleColor: "text-yellow-400",
          borderColor: "border-yellow-500/30"
        };
      case "danger":
        return {
          icon: "❌",
          iconBg: "bg-red-500/20",
          iconColor: "text-red-400",
          titleColor: "text-red-400",
          borderColor: "border-red-500/30"
        };
      default:
        return {
          icon: "ℹ️",
          iconBg: "bg-blue-500/20",
          iconColor: "text-blue-400",
          titleColor: "text-blue-400",
          borderColor: "border-blue-500/30"
        };
    }
  };

  const typeStyles = getTypeStyles();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={`relative bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border ${typeStyles.borderColor} max-w-md w-full mx-4`}
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${typeStyles.iconBg}`}>
                  <span className={`text-2xl ${typeStyles.iconColor}`}>
                    {typeStyles.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${typeStyles.titleColor}`}>
                    {title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <p className="text-gray-300 leading-relaxed">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 pt-0">
              {showCancel && (
                <button
                  onClick={onClose}
                  className="btn-secondary flex-1"
                >
                  {cancelText}
                </button>
              )}
              {showConfirm && (
                <button
                  onClick={handleConfirm}
                  className={`${
                    type === "danger" 
                      ? "btn-danger" 
                      : type === "success"
                      ? "btn-success"
                      : type === "warning"
                      ? "btn-warning"
                      : "btn-primary"
                  } flex-1`}
                >
                  {confirmText}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

