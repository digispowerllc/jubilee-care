'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2 } from 'lucide-react';

interface PhoneUpdateModalProps {
  currentPhone: string;
  onClose: () => void;
}

export default function PhoneUpdateModal({ currentPhone, onClose }: PhoneUpdateModalProps) {
  const [phone, setPhone] = useState(currentPhone);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/profile/update-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });

      if (res.ok) {
        localStorage.setItem('wasUpdated', 'true');
        alert('Phone number updated successfully.');
        router.refresh();
        onClose();
      } else if (res.status === 400) {
        alert('This phone number is already associated with your account.');
      } else if (res.status === 401) {
        alert('Incorrect password. Please try again.');
      } else if (res.status === 422) {
        alert('Phone number must be valid.');
      } else if (res.status === 409) {
        alert('Unable to update phone number. Try again later.');
      } else {
        alert('Failed to update phone number.');
      }
    } catch (error) {
      console.error('Error updating phone:', error);
      alert('Failed to update phone number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Update Phone</h2>
        <form onSubmit={save}>
          <input
            type="tel"
            className="mb-3 w-full rounded border px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter new phone number"
          />
          <input
            type="password"
            className="w-full rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Current password"
          />

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
              {loading ? 'Updating...' : 'Update Phone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}