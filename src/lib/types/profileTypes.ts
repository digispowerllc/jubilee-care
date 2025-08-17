
export interface UnprotectedData {
    agentId: string;
    firstName: string;
    surname: string;
    otherName: string | null;
    gender: string | null;
    dob: string | null;
    email: string | null;
    phone: string | null;
    nin: string | null;
    state: string | null;
    lga: string | null;
    address: string | null;
    memberSince?: Date;
    avatarUrl?: string | null;
    clients?: Array<{
        id: string;
        name: string;
        joinedDate: Date;
        status: "active" | "inactive";
    }>;
    transactions?: Array<{
        id: string;
        amount: number;
        date: Date;
        type: "deposit" | "withdrawal" | "transfer";
    }>;
}

export interface ProfileControllerState {
  isEditingPassword: boolean;
  isEditingPIN: boolean;
  is2FAEnabled: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  newPIN: string;
  confirmPIN: string;
  pinVerified: boolean;
}