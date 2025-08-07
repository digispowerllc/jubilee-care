'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2 } from 'lucide-react';

interface PersonalDetailsModalProps {
  currentName: string;
  currentUsername: string;
  currentBio: string;
  onClose: () => void;
}

export default function PersonalDetailsModal({
  currentName,
  currentUsername,
  currentBio,
  onClose,
}: PersonalDetailsModalProps) {
  const [name, setName] = useState(currentName);
  const [username, setUsername] = useState(currentUsername);
  const [bio, setBio] = useState(currentBio);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/profile/update-personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, bio })
      });

      if (res.ok) {
        localStorage.setItem('wasUpdated', 'true');
        alert('Profile updated successfully.');
        router.refresh();
        onClose();
      } else if (res.status === 400) {
        alert('Name must be at least 2 characters long.');
      } else if (res.status === 422) {
        alert('Invalid format. Only alphanumeric characters and underscores are allowed.');
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Update Personal Details</h2>
        <form onSubmit={save}>
          <input
            className="w-full rounded border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
          />
          <input
            className="mt-2 w-full rounded border px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          <textarea
            className="mt-2 w-full rounded border px-3 py-2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter bio (optional)"
            rows={3}
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
              {loading ? 'Updating...' : 'Update Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}