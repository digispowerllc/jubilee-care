import { NextRouter } from "next/router";

export type TabType =
    | 'overview'
    | 'personal'
    | 'identification'
    | 'contact'
    | 'address'
    | 'security'
    | 'preferences';

export interface AgentProfileData {
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
    emailVerified: Date | null;
    memberSince?: Date;
    avatarUrl?: string;
    agentId: string;
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

export interface AddressTabProps extends ProfileTabProps {
    profileData: AgentProfileData;
    controller: ProfileControllerState;
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