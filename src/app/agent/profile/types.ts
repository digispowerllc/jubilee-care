// import { NextRouter } from "next/router";
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
    agentId: string;       // Internal ID for backend operations
    fieldId?: string;      // Displayed as "Agent ID" in the UI
    surname: string;
    firstName: string;
    otherName: string | null;
    dob: Date | null;
    gender: string | null;
    email: string;
    phone: string;
    nin: string;
    state: string;
    lga: string;
    address: string;
    emailVerified: boolean;
    memberSince?: Date;
    avatarUrl?: string;
    createdAt: Date;
}

export interface UnprotectedData extends Omit<AgentProfileData, 'emailVerified'> {
    emailVerified: boolean; // Ensure consistent type
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
}

export interface ProfileTabProps {
    profileData: AgentProfileData;
    controller: ProfileControllerState;
}

export interface IdentificationTabProps extends ProfileTabProps {
    // Additional identification-specific props
    documentStatus?: 'verified' | 'pending' | 'rejected';
}

export interface ContactTabProps extends ProfileTabProps {
    // Additional contact-specific props
    secondaryEmail?: string;
    secondaryPhone?: string;
}

export interface AddressTabProps {
    profileData: AgentProfileData;
    controller: TabController;
}

export interface SecurityTabProps extends ProfileTabProps {
    // Additional security-specific props
    lastPasswordChange?: Date;
    lastLogin?: Date;
}

export interface PreferencesTabProps extends ProfileTabProps {
    // Additional preferences-specific props
    language?: string;
    notificationPreferences?: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
}
