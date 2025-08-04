'use client'; 

import React from 'react';

interface Props {
  onClose: () => void;
}

const AgentEnrollmentModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Agent Enrollment</h2>
        <p>Modal content here...</p>
        <button
          onClick={onClose}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AgentEnrollmentModal;
