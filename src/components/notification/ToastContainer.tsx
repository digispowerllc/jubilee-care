// src/components/notification/ToastContainer.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useNotification } from "./NotificationProvider";
import type { Notification, NotificationType, ToastPosition } from "./types";

const iconMap: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  loading: <Loader2 className="w-5 h-5 animate-spin" />,
};

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
};

const variantClasses: Record<NotificationType, string> = {
  success: "bg-emerald-500 text-white border-emerald-600",
  error: "bg-rose-500 text-white border-rose-600",
  info: "bg-blue-500 text-white border-blue-600",
  warning: "bg-amber-500 text-white border-amber-600",
  loading: "bg-gray-700 text-white border-gray-800",
};

export const ToastContainer = ({
  notifications,
}: {
  notifications: Notification[];
}) => {
  // Group notifications by position
  const notificationsByPosition = notifications.reduce((acc, notification) => {
    const position = notification.position || "top-right";
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(notification);
    return acc;
  }, {} as Record<ToastPosition, Notification[]>);

  return (
    <>
      {Object.entries(notificationsByPosition).map(([position, toasts]) => (
        <div
          key={position}
          className={`fixed z-[9999] space-y-2 ${
            positionClasses[position as ToastPosition]
          }`}
        >
          <AnimatePresence>
            {toasts.map((toast) => (
              <Toast key={toast.id} toast={toast} />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
};

const Toast = ({ toast }: { toast: Notification }) => {
  const { dismiss } = useNotification();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: toast.position?.includes("right") ? 100 : -100 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`flex items-start gap-3 rounded-lg border shadow-lg p-4 max-w-xs ${
        variantClasses[toast.type]
      }`}
    >
      <div className="flex-shrink-0">{toast.icon || iconMap[toast.type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              dismiss(toast.id);
            }}
            className="mt-2 text-xs font-semibold underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      {toast.dismissible && (
        <button
          onClick={() => dismiss(toast.id)}
          className="flex-shrink-0 -mt-1 -mr-1 p-1 rounded-full hover:bg-black/10 transition-colors"
        >
          <span className="sr-only">Close</span>
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};
