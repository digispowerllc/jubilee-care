// src/components/notification/types.ts
import { ReactNode } from 'react';

export type ToastPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
    position?: ToastPosition;
    icon?: ReactNode;
    dismissible?: boolean;
    onClose?: () => void;
    action?: {
        label: string;
        onClick: () => void;
    };
}