import { useState } from "react";

export default function useModal() {
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: null,
    showCancel: true,
    showConfirm: true
  });

  const showModal = (config) => {
    setModal({
      isOpen: true,
      title: config.title || "",
      message: config.message || "",
      type: config.type || "info",
      confirmText: config.confirmText || "Confirm",
      cancelText: config.cancelText || "Cancel",
      onConfirm: config.onConfirm || null,
      showCancel: config.showCancel !== false,
      showConfirm: config.showConfirm !== false
    });
  };

  const hideModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const showConfirm = (message, onConfirm, options = {}) => {
    showModal({
      title: options.title || "Confirm Action",
      message,
      type: options.type || "warning",
      confirmText: options.confirmText || "Yes, Continue",
      cancelText: options.cancelText || "Cancel",
      onConfirm,
      ...options
    });
  };

  const showAlert = (message, options = {}) => {
    showModal({
      title: options.title || "Notice",
      message,
      type: options.type || "info",
      confirmText: options.confirmText || "OK",
      showCancel: false,
      ...options
    });
  };

  const showSuccess = (message, options = {}) => {
    showModal({
      title: options.title || "Success",
      message,
      type: "success",
      confirmText: options.confirmText || "OK",
      showCancel: false,
      ...options
    });
  };

  const showError = (message, options = {}) => {
    showModal({
      title: options.title || "Error",
      message,
      type: "danger",
      confirmText: options.confirmText || "OK",
      showCancel: false,
      ...options
    });
  };

  return {
    modal,
    showModal,
    hideModal,
    showConfirm,
    showAlert,
    showSuccess,
    showError
  };
}

