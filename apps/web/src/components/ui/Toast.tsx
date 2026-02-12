"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";

/**
 * Toast component - Self-contained notification
 */
interface ToastItemProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  onRemove: (id: string) => void;
}

function ToastItem({ id, type, message, onRemove }: ToastItemProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const borderStyles = {
    success: "border-l-4 border-l-emerald-500",
    error: "border-l-4 border-l-red-500",
    warning: "border-l-4 border-l-amber-500",
    info: "border-l-4 border-l-blue-500",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-gray-100 bg-white/95 backdrop-blur-md p-4 shadow-xl shadow-gray-200/50",
        borderStyles[type],
      )}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium text-gray-700">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

/**
 * Toast container - Renders all active toasts
 */
export function ToastContainer() {
  const { toasts, removeToast } = useUiStore();

  return (
    <div
      className="fixed right-4 top-4 z-[60] flex max-w-sm flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="pointer-events-auto flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              id={toast.id}
              type={toast.type}
              message={toast.message}
              onRemove={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Hook to show toast notifications
 */
export function useToast() {
  const { showToast } = useUiStore();

  return {
    success: (message: string) => showToast("success", message),
    error: (message: string) => showToast("error", message),
    warning: (message: string) => showToast("warning", message),
    info: (message: string) => showToast("info", message),
  };
}
