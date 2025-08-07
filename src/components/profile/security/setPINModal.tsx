'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SetPinModalProps {
  onClose: () => void;
}

export default function SetPinModal({ onClose }: SetPinModalProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const clear = () => {
    setPin('');
    setConfirmPin('');
  };

  const digitsOnly = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  const isValidPIN = (value: string) => {
    return /^\d+$/.test(value) && value.length >= 6 && value.length <= 24;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidPIN(pin)) {
      alert('PIN must be between 6 and 24 digits');
      return;
    }
    if (pin !== confirmPin) {
      alert('PINs do not match');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('/api/profile/set-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });

      if (res.ok) {
        localStorage.setItem('wasUpdated', 'true');
        alert('PIN set successfully.');
        router.refresh();
        clear();
        onClose();
      } else if (res.status === 400) {
        alert('PIN must be at least 6 digits long.');
        clear();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to set PIN');
      }
    } catch (error) {
      console.error('Error setting PIN:', error);
      alert('Failed to set PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Set Your PIN</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="pin" className="block text-sm font-medium">
              New PIN
            </label>
            <input
              id="pin"
              type="text"
              inputMode="numeric"
              minLength={6}
              maxLength={24}
              value={pin}
              onChange={(e) => setPin(digitsOnly(e.target.value))}
              className="w-full rounded border p-2"
            />
          </div>

          <div>
            <label htmlFor="confirmPin" className="block text-sm font-medium">
              Confirm PIN
            </label>
            <input
              id="confirmPin"
              type="password"
              inputMode="numeric"
              minLength={6}
              maxLength={24}
              value={confirmPin}
              onChange={(e) => setConfirmPin(digitsOnly(e.target.value))}
              className="w-full rounded border p-2"
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Setting...' : 'Set PIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}