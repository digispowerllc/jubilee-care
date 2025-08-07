'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordUpdateModalProps {
  onClose: () => void;
}

export default function PasswordUpdateModal({ onClose }: PasswordUpdateModalProps) {
  const [current, setCurrent] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const clear = () => {
    setCurrent('');
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setShowCurrentPassword(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current, newPassword })
      });

      if (res.ok) {
        localStorage.setItem('wasUpdated', 'true');
        clear();
        alert('Password changed successfully.');
        router.refresh();
        onClose();
      } else if (res.status === 400) {
        alert('Current password is incorrect.');
        clear();
      } else if (res.status === 422) {
        alert('New password must be at least 8 characters long.');
      } else {
        alert('Failed to change password.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Change Password</h2>
        <form onSubmit={save}>
          <div className="relative">
            <input
              value={current}
              type={showCurrentPassword ? 'text' : 'password'}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Current password"
              className="mb-2 w-full rounded-lg border px-4 py-3 pr-10 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-red-500"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          <div className="relative">
            <input
              value={newPassword}
              type={showNewPassword ? 'text' : 'password'}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="mb-2 w-full rounded-lg border px-4 py-3 pr-10 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-red-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          <div className="relative">
            <input
              value={confirmPassword}
              type={showConfirmPassword ? 'text' : 'password'}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="mb-2 w-full rounded-lg border px-4 py-3 pr-10 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-red-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
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
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}