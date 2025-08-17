import { useState } from "react";
import { FiX, FiChevronRight } from "react-icons/fi";
import { Modal } from "./Modal";

interface PINModalProps {
  isOpen: boolean;
  onClose: () => void;
  purpose: "viewNIN" | "viewPhone" | "";
}

export function PINModal({ isOpen, onClose, purpose }: PINModalProps) {
  const [pin, setPin] = useState("");

  const verifyPIN = (enteredPin: string) => {
    // Mock verification
    if (enteredPin === "1234") return true;
    return false;
  };

  const handlePINSubmit = () => {
    if (verifyPIN(pin)) {
      onClose();
    } else {
      alert("Invalid PIN. Please try again.");
      setPin("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Enter PIN to View ${purpose === "viewNIN" ? "NIN" : "Phone Number"}`}
    >
      <div className="space-y-4">
        {/* ... PIN input and keypad implementation ... */}
      </div>
    </Modal>
  );
}
