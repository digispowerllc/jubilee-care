'use client';

import { useEffect } from 'react';
import useNotificationStore from '../store/notification';

export default function Notification() {
  const { notification, clear } = useNotificationStore();

  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => {
        clear();
      }, notification.duration);

      return () => clearTimeout(timeout);
    }
  }, [notification, clear]);

  if (!notification || !notification.visible) return null;

  return (
    <div className={`notification ${notification.type}`}>
      <span>{notification.message}</span>
      <button onClick={clear}>×</button>

      <style jsx>{`
        .notification {
          position: fixed;
          top: 4rem;
          right: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          z-index: 9999;
          min-width: 220px;
          max-width: 300px;
        }

        .success {
          background-color: #22c55e;
        }
        .error {
          background-color: #ef4444;
        }
        .info {
          background-color: #3b82f6;
        }
        .warning {
          background-color: #f59e0b;
        }

        button {
          background: transparent;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          color: white;
          line-height: 1;
          padding: 0;
        }

         @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
