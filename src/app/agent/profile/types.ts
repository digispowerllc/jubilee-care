// types.ts
import { TabController } from "./components/tabs/TabController";

export type TabType =
    | 'overview'
    | 'personal'
    | 'identification'
    | 'contact'
    | 'address'
    | 'security'
    | 'preferences';

export interface AgentProfileData {
    // Core Identification
    agentId: string;        // Internal ID for backend operations
    fieldId: string;        // Displayed as "Agent ID" in the UI
    surname: string;
    firstName: string;
    otherName: string | null;
    gender: string | null;
    dob: Date | null;

    // Contact Information
    email: string;
    phone: string;
    emailVerified: boolean;
    phoneVerified: boolean;

    // Government Identification
    nin: string;
    ninVerified: boolean;
    bvnVerified: boolean;
    documentVerified: boolean;

    // Location
    state: string;
    lga: string;
    address: string;

    // Verification Status
    dobVerified: boolean;
    genderVerified: boolean;

    // Metadata
    memberSince?: Date;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;

    // Account Status
    isActive: boolean;
    status: string;
    admittedAt?: Date;
}

export interface UnprotectedData extends Omit<AgentProfileData, 'emailVerified'> {
    emailVerified: boolean; // Ensure consistent type
}

// Verification Status Types
export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'not_added';
export type DocumentType = 'nin' | 'bvn' | 'passport' | 'driver_license';

export interface VerificationDocument {
    type: DocumentType;
    status: VerificationStatus;
    verifiedAt?: Date;
    rejectionReason?: string;
}

export interface ProfileControllerState {
    activeTab: TabType;
    isEditingPassword: boolean;
    isEditingPIN: boolean;
    is2FAEnabled: boolean;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    newPIN: string;
    confirmPIN: string;
    isEditingPersonal?: boolean;
    pinVerified: boolean;
    isViewingNIN?: boolean;
    isAddingNIN?: boolean;
    isUploadingDocuments?: boolean;
}

export interface ProfileTabProps {
    profileData: AgentProfileData;
    controller: TabController;
}

export interface IdentificationTabProps extends ProfileTabProps {
    documentStatus?: VerificationStatus;
    hasUploadedDocuments?: boolean;
    verificationDocuments?: VerificationDocument[];
    onViewNIN?: () => void;
    onAddNIN?: () => void;
    onUploadDocuments?: (files: FileList) => void;
}

export interface ContactTabProps extends ProfileTabProps {
    secondaryEmail?: string;
    secondaryPhone?: string;
    onVerifyEmail?: () => void;
    onVerifyPhone?: () => void;
}

export interface AddressTabProps extends ProfileTabProps {
    onVerifyAddress?: () => void;
    addressStatus?: VerificationStatus;
}

export interface SecurityTabProps extends ProfileTabProps {
    lastPasswordChange?: Date;
    lastLogin?: Date;
    failedLoginAttempts?: number;
    activeSessions?: number;
}

export interface PreferencesTabProps extends ProfileTabProps {
    language?: string;
    notificationPreferences?: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
    timezone?: string;
}

// Verification Status Helper
export interface VerificationStatusInfo {
    verified: boolean;
    level: 'Full' | 'Partial' | 'None';
    date: string | Date;
    pendingFields?: string[];
}