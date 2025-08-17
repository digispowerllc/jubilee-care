"use client";

import { useState } from "react";
import {
  FiAlertTriangle,
  FiUserX,
  FiTrash2,
  FiChevronRight,
} from "react-icons/fi";
import { DeactivateModal } from "./modals/DeactivateAccountModal";
import { DeleteModal } from "./modals/DeleteDataModal";

export function DangerZone() {
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <div className="border border-red-100 rounded-xl bg-white shadow-sm overflow-hidden mt-8">
        <div className="p-5 bg-gradient-to-r from-red-50 to-rose-50">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-red-600 w-5 h-5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-900">Danger Zone</h4>
              <p className="text-sm text-red-700 mt-1">
                Permanent actions that cannot be undone
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-red-50">
          <button
            onClick={() => setShowDeactivate(true)}
            className="w-full px-5 py-4 hover:bg-red-50 transition-colors flex justify-between items-center group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <FiUserX className="w-4 h-4 text-red-600" />
              </div>
              <span className="font-medium text-red-900">
                Deactivate Account
              </span>
            </div>
            <FiChevronRight className="text-red-400 group-hover:text-red-600" />
          </button>

          <button
            onClick={() => setShowDelete(true)}
            className="w-full px-5 py-4 hover:bg-red-50 transition-colors flex justify-between items-center group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <FiTrash2 className="w-4 h-4 text-red-600" />
              </div>
              <span className="font-medium text-red-900">Delete All Data</span>
            </div>
            <FiChevronRight className="text-red-400 group-hover:text-red-600" />
          </button>
        </div>
      </div>

      <DeactivateModal
        isOpen={showDeactivate}
        onClose={() => setShowDeactivate(false)}
      />
      <DeleteModal isOpen={showDelete} onClose={() => setShowDelete(false)} />
    </>
  );
}
