// Any component
"use client";

import {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarning,
  notifyLoading,
} from "@/components/Notification";

export default function TestComponent() {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => notifySuccess("It worked!")}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Test Success
      </button>
      <button
        onClick={() => notifyError("Something went wrong")}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Test Error
      </button>
      <button
        onClick={() => notifySuccess("This is a success message", 5000)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Success with Duration
      </button>

      <button
        onClick={() => notifyError("This is an error message", 5000)}
        className="px-4 py-2 bg-yellow-500 text-white rounded"
      >
        Test Error with Duration
      </button>
      <button
        onClick={() => notifyInfo("This is an info message")}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Test Info
      </button>
      <button
        onClick={() => notifyWarning("This is a warning message")}
        className="px-4 py-2 bg-orange-500 text-white rounded"
      >
        Test Warning
      </button>
      <button
        onClick={() => notifyLoading("Loading...")}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        Test Loading
      </button>
      <button
        onClick={() => notifyInfo("This is an info message", 5000)}
        className="px-4 py-2 bg-teal-500 text-white rounded"
      >
        Test Info with Duration
      </button>
      <button
        onClick={() => notifyWarning("This is a warning message", 5000)}
        className="px-4 py-2 bg-pink-500 text-white rounded"
      >
        Test Warning with Duration
      </button>
      <button
        onClick={() => notifyLoading("Loading...", 5000)}
        className="px-4 py-2 bg-indigo-500 text-white rounded"
      >
        Test Loading with Duration
      </button>
    </div>
  );
}
