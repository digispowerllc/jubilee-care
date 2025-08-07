// src/components/notification/NotificationProvider.tsx
"use client";

import { createContext, useContext, useRef, ReactNode } from "react";
import { ToastContainer } from "./ToastContainer";
import type { Notification, NotificationType, ToastPosition } from "./types";

interface NotificationContextType {
  notify: (notification: Omit<Notification, "id">) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  update: (id: string, updates: Partial<Notification>) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const notificationsRef = useRef<Notification[]>([]);

  const notify = (notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = {
      id,
      dismissible: true,
      duration: 5000,
      position: "top-right",
      ...notification,
    };

    notificationsRef.current = [...notificationsRef.current, newNotification];
    return id;
  };

  const dismiss = (id: string) => {
    notificationsRef.current = notificationsRef.current.filter(
      (n) => n.id !== id
    );
  };

  const dismissAll = () => {
    notificationsRef.current = [];
  };

  const update = (id: string, updates: Partial<Notification>) => {
    notificationsRef.current = notificationsRef.current.map((n) =>
      n.id === id ? { ...n, ...updates } : n
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notify, dismiss, dismissAll, update }}
    >
      {children}
      <ToastContainer notifications={notificationsRef.current} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

// Create hook-based versions of notification functions
export const useNotify = () => {
  const { notify } = useNotification();
  return notify;
};

export const useNotifySuccess = () => {
  const notify = useNotify();
  return (message: string, options?: Omit<Notification, "message" | "type">) =>
    notify({ ...options, message, type: "success" });
};

export const useNotifyError = () => {
  const notify = useNotify();
  return (message: string, options?: Omit<Notification, "message" | "type">) =>
    notify({ ...options, message, type: "error" });
};

export const useNotifyInfo = () => {
  const notify = useNotify();
  return (message: string, options?: Omit<Notification, "message" | "type">) =>
    notify({ ...options, message, type: "info" });
};

export const useNotifyWarning = () => {
  const notify = useNotify();
  return (message: string, options?: Omit<Notification, "message" | "type">) =>
    notify({ ...options, message, type: "warning" });
};

export const useNotifyLoading = () => {
  const notify = useNotify();
  return (message: string, options?: Omit<Notification, "message" | "type">) =>
    notify({
      ...options,
      message,
      type: "loading",
      dismissible: false,
      duration: options?.duration || 30000,
    });
};
