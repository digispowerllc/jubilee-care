// src/components/store/notification.ts
'use client';

import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationState {
  message: string;
  type: NotificationType;
  duration: number;
  visible: boolean;
}

interface NotificationStore {
  notification: NotificationState | null;
  notify: (message: string, type: NotificationType, duration?: number) => void;
  clear: () => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  notification: null,
  notify: (message, type, duration = 4000) =>
    set({
      notification: {
        message,
        type,
        duration,
        visible: true,
      },
    }),
  clear: () => set({ notification: null }),
}));

// Export utilities
export const notifySuccess = (msg: string, duration?: number) =>
  useNotificationStore.getState().notify(msg, 'success', duration);

export const notifyError = (msg: string, duration?: number) =>
  useNotificationStore.getState().notify(msg, 'error', duration);

export const notifyInfo = (msg: string, duration?: number) =>
  useNotificationStore.getState().notify(msg, 'info', duration);

export const notifyWarning = (msg: string, duration?: number) =>
  useNotificationStore.getState().notify(msg, 'warning', duration);

export const clearNotification = () => useNotificationStore.getState().clear();

export default useNotificationStore;
