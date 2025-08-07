'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ChangePinModalProps {
  userId: string;
  onClose: () => void;
}

export default function ChangePinModal({ userId, onClose }: ChangePinModalProps) {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const clear = () => {
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
  };

  const changePin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPin !== confirmPin) {
      alert('PINs do not match');
      return;
    }
    if (!/^\d{6,256}$/.test(newPin)) {
      alert('New PIN must be 6 to 256 digits');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('/api/profile/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPin, newPin })
      });

      if (res.ok) {
        localStorage.setItem('wasUpdated', 'true');
        alert('PIN changed successfully.');
        router.refresh();
        clear();
        onClose();
      } else if (res.status === 400) {
        alert('Current PIN is incorrect.');
        clear();
      } else if (res.status === 422) {
        alert('New PIN must be at least 6 digits long.');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to change PIN');
      }
    } catch (error) {
      console.error('Error changing PIN:', error);
      alert('Failed to change PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Change PIN</h2>
        <form onSubmit={changePin}>
          <input
            type="password"
            placeholder="Current PIN"
            value={oldPin}
            onChange={(e) => setOldPin(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
          <input
            type="password"
            placeholder="New PIN"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            className="mt-2 w-full rounded border p-2"
            required
          />
          <input
            type="password"
            placeholder="Confirm New PIN"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            className="mt-2 w-full rounded border p-2"
            required
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="submit"
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change PIN'}
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