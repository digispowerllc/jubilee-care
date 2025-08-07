'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RemovePinModalProps {
  onClose: () => void;
}

export default function RemovePinModal({ onClose }: RemovePinModalProps) {
  const [currentPin, setCurrentPin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const clear = () => {
    setCurrentPin('');
  };

  const removePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/profile/remove-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPin })
      });

      if (res.ok) {
        localStorage.setItem('wasUpdated', 'true');
        alert('PIN removed successfully.');
        router.refresh();
        clear();
        onClose();
      } else if (res.status === 400) {
        alert('Current PIN is incorrect.');
        clear();
      } else if (res.status === 422) {
        alert('PIN must be at least 6 digits long.');
        clear();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to remove PIN');
      }
    } catch (error) {
      console.error('Error removing PIN:', error);
      alert('Failed to remove PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Remove PIN</h2>
        <p className="mb-4">Are you sure you want to remove your PIN?</p>
        <form onSubmit={removePin}>
          <input
            type="password"
            placeholder="Enter your current PIN"
            value={currentPin}
            onChange={(e) => setCurrentPin(e.target.value)}
            className="w-full rounded border p-2"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="submit"
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Removing...' : 'Confirm'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}