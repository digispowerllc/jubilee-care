"use client";

import { useState } from "react";
import {
  FiAlertTriangle,
  FiUserX,
  FiTrash2,
  FiChevronRight,
  FiShield,
  FiLock,
  FiAlertCircle,
} from "react-icons/fi";
import { DeactivateModal } from "./modals/DeactivateAccountModal";
import { DeleteModal } from "./modals/DeleteDataModal";

export function DangerZone() {
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const dangerActions = [
    {
      id: "deactivate",
      title: "Deactivate Account",
      description:
        "Temporarily disable your account. You can reactivate later.",
      icon: FiUserX,
      color: "text-amber-600 bg-amber-100",
      modal: () => setShowDeactivate(true),
    },
    {
      id: "delete",
      title: "Delete All Data",
      description: "Permanently erase all your data. This cannot be undone.",
      icon: FiTrash2,
      color: "text-red-600 bg-red-100",
      modal: () => setShowDelete(true),
    },
  ];

  return (
    <>
      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 p-2">
            <FiAlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
            <p className="text-sm text-red-700 mt-1">
              Irreversible actions that affect your account permanently
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {dangerActions.map((action) => (
            <div
              key={action.id}
              className="bg-white rounded-lg p-4 border border-red-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={action.modal}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
                <FiChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Warning Notice */}
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start">
            <FiAlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-amber-900">
                Important Notice
              </h4>
              <p className="text-sm text-amber-800 mt-1">
                These actions are permanent and cannot be undone. Please ensure
                you understand the consequences before proceeding. We recommend
                exporting your data first.
              </p>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <FiShield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">
                Security Recommendations
              </h4>
              <ul className="text-sm text-blue-800 mt-1 space-y-1">
                <li>• Export your data before taking any permanent actions</li>
                <li>• Consider deactivation instead of permanent deletion</li>
                <li>
                  • Contact support if you&#39;re unsure about these actions
                </li>
              </ul>
            </div>
          </div>
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
