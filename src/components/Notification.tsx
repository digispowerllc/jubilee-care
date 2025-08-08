// components/Notification.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, Loader2, X } from "lucide-react";

type NotificationType = "success" | "error" | "info" | "warning" | "loading";
type NotificationPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

interface NotificationItem {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

declare global {
  interface Window {
    notify?: (message: string, type?: NotificationType, duration?: number) => void;
  }
}

interface NotificationProps {
  maxNotifications?: number;
  position?: NotificationPosition;
}

export function Notification({ 
  maxNotifications = 3, 
  position = "top-right"
}: NotificationProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [positions, setPositions] = useState<{id: string, top: number}[]>([]);

  const notify = (message: string, type: NotificationType = "info", duration = 5000) => {
    const id = Math.random().toString(36).slice(2, 9);
    
    setNotifications(prev => {
      const updated = prev.length >= maxNotifications 
        ? [...prev.slice(1), { id, message, type, duration }]
        : [...prev, { id, message, type, duration }];
      return updated;
    });

    // Calculate fixed positions for persistent locations
    setPositions(prev => {
      const newPositions = prev.length >= maxNotifications 
        ? [...prev.slice(1), { id, top: calculateTopPosition(prev.length - 1) }]
        : [...prev, { id, top: calculateTopPosition(prev.length) }];
      return newPositions;
    });
    
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        setPositions(prev => prev.filter(p => p.id !== id));
      }, duration);
    }
  };

  const calculateTopPosition = (index: number) => {
    if (maxNotifications === 1) return 16; // 1rem (top-4)
    // 1rem (top-4) + (index * 3.5rem) for gap-2 + notification height
    return 16 + (index * 56); 
  };

  useEffect(() => {
    window.notify = notify;
    return () => {
      window.notify = undefined;
    };
  }, []);

  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    loading: <Loader2 className="w-5 h-5 animate-spin" />,
  };

  const variantClasses = {
    success: "bg-green-50 border border-green-200 text-green-800",
    error: "bg-red-50 border border-red-200 text-red-800",
    info: "bg-blue-50 border border-blue-200 text-blue-800",
    warning: "bg-amber-50 border border-amber-200 text-amber-800",
    loading: "bg-gray-50 border border-gray-200 text-gray-800",
  };

  const positionClasses = {
    "top-right": "right-4",
    "top-left": "left-4",
    "bottom-right": "right-4",
    "bottom-left": "left-4",
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  return (
    <>
      {notifications.map((notification) => {
        const positionStyle = positions.find(p => p.id === notification.id);
        return (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              top: positionStyle?.top || calculateTopPosition(0)
            }}
            exit={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
            className={`fixed z-[9999] w-80 max-w-[calc(100vw-2rem)] rounded-lg shadow-lg ${variantClasses[notification.type]} ${positionClasses[position]}`}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              top: `${positionStyle?.top || calculateTopPosition(0)}px`
            }}
          >
            <div className="flex items-start gap-3 p-4">
              <div className="flex-shrink-0">
                {iconMap[notification.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium break-words">
                  {notification.message}
                </p>
              </div>
              <button 
                onClick={() => dismissNotification(notification.id)}
                className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {notification.duration && notification.duration > 0 && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: notification.duration / 1000, ease: "linear" }}
                className="h-1 bg-current opacity-20 absolute bottom-0 left-0 rounded-b-lg"
              />
            )}
          </motion.div>
        );
      })}
    </>
  );
}

export const notifySuccess = (message: string, duration?: number) => {
  if (typeof window !== "undefined" && window.notify) {
    window.notify(message, "success", duration);
  }
};

export const notifyError = (message: string, duration?: number) => {
  if (typeof window !== "undefined" && window.notify) {
    window.notify(message, "error", duration);
  }
};

export const notifyInfo = (message: string, duration?: number) => {
  if (typeof window !== "undefined" && window.notify) {
    window.notify(message, "info", duration);
  }
};

export const notifyWarning = (message: string, duration?: number) => {
  if (typeof window !== "undefined" && window.notify) {
    window.notify(message, "warning", duration);
  }
};

export const notifyLoading = (message: string, duration?: number) => {
  if (typeof window !== "undefined" && window.notify) {
    window.notify(message, "loading", duration);
  }
};
