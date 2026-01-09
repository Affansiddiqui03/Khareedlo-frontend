// src/components/ToastProvider.jsx
import React, { createContext, useCallback, useContext, useState } from "react";
import Toast from "./Toast";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((msg, opts = {}) => {
    const id = Date.now() + Math.random();
    const toast = { id, msg, type: opts.type || "info", timeout: opts.timeout || 4000 };
    setToasts((t) => [toast, ...t]);
    if (toast.timeout > 0) {
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), toast.timeout);
    }
  }, []);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      {/* container */}
      <div className="fixed z-50 right-4 top-4 flex flex-col gap-3 w-80">
        {toasts.map((t) => (
          <Toast key={t.id} id={t.id} type={t.type} onClose={() => remove(t.id)}>
            {t.msg}
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
