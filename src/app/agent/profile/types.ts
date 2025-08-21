// File: src/app/agent/profile/types.ts

/**
 * Profile tab types
 */
export type TabType =
  | "overview"
  | "personal"
  | "identification"
  | "contact"
  | "address"
  | "security"
  | "preferences";

/**
 * Overall account status
 */
export type AgentStatus =
  | "ACTIVE"
  | "DEACTIVATED"
  | "PENDING_DELETION"
  | "DELETED";

/**`
 * Audit log enums
 */
export type AuditAction =
  | "ACCOUNT_DELETION_REQUEST"
  | "ACCOUNT_DEACTIVATION"
  | "LOGIN_ATTEMPT"
  | "LOGIN_SUCCESS"
  | "PASSWORD_CHANGE"
  | "PASSWORD_RESET"
  | "DATA_EXPORT"
  | "DATA_DELETION"
  | "PERMISSION_CHANGE"
  | "SYSTEM_EVENT";

export type AuditStatus = "SUCCESS" | "FAILED" | "PENDING" | "REVERTED";
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/**
 * Core decrypted profile / personal information
 */
export interface AgentData {
  agentId: string;
  fieldId: string;
  surname: string | null;
  firstName: string | null;
  otherName: string | null;
  gender: string | null;
  dob: Date | null;
  nameVerified: boolean;
  nameVerificationDate: Date | null;

  // Contact
  email: string | null;
  phone: string | null;
  emailVerified: boolean;
  emailVerifiedDate: Date | null;
  phoneVerified: boolean;
  phoneVerifiedDate: Date | null;

  // Government IDs
  nin: string | null;
  bvn?: string | null;
  ninVerified: boolean;
  ninVerifiedDate: Date | null;
  bvnVerified: boolean;
  bvnVerifiedDate: Date | null;
  documentVerified: boolean;
  documentVerifiedDate: Date | null;

  // Location
  state: string | null;
  lga: string | null;
  address: string | null;

  // Verification flags
  dobVerified: boolean;
  dobVerifiedDate: Date | null;
  genderVerified: boolean;
  genderVerifiedDate: Date | null;

  // Account metadata
  memberSince: Date;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;

  // Status
  isActive: boolean;
  status: AgentStatus;
  admittedAt?: Date;
  deletedAt?: Date;
  deactivatedAt?: Date;
  deletionReason?: string;
  deactivationReason?: string;
}

/**
 * Supporting summaries
 */
export interface SessionSummary {
  id: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
}

export interface AccountLockSummary {
  id: string;
  reason?: string;
  createdAt: Date;
  expiresAt: Date;
  action?: string;
  ipAddress?: string;
}

export interface AuditLogSummary {
  id: string;
  action: AuditAction;
  ipAddress: string;
  userAgent: string;
  status: AuditStatus;
  severity: Severity;
  createdAt: Date;
  details?: string;
  targetId?: string;
  targetType?: string;
}

/**
 * Failed login or deletion attempt summary
 */
export interface FailedAttemptSummary {
  id: string;
  agentId: string;
  action: "LOGIN" | "PIN_VERIFICATION" | "ACCOUNT_DELETION";
  ipAddress: string;
  userAgent?: string;
  details?: string;
  createdAt: Date;
  attempts: number;
}

/**
 * Account deletion schedule summary
 */
export interface DeletionScheduleSummary {
  id: string;
  agentId: string;
  deletionType: "FULL_ACCOUNT" | "DATA_ONLY";
  scheduledAt: Date;
  completedAt?: Date;
  createdAt: Date;
}

/**
 * Security-related info
 */
export interface SecurityData {
  sessions: SessionSummary[];
  accountLocks: AccountLockSummary[];
  auditLogs: AuditLogSummary[];
}

/**
 * Extended security info including failed attempts and deletion schedules
 */
export interface SecurityDataExtended extends SecurityData {
  failedAttempts: FailedAttemptSummary[];
  deletionSchedules: DeletionScheduleSummary[];
}

/**
 * Other agent metadata
 */
export interface OtherData {
  notes?: string; // placeholder for future expansion
}

/**
 * Full aggregate type for convenience
 */
export interface AgentFullData {
  profile: AgentData;
  security: SecurityData;
  other: OtherData;
}

/**
 * Full aggregate type with extended security
 */
export interface AgentFullDataExtended {
  profile: AgentData;
  security: SecurityDataExtended;
  other: OtherData;
}

/**
 * Security-related request structures
 */
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PINChangeRequest {
  newPIN: string;
  confirmPIN: string;
}

export interface TwoFARequest {
  enable: boolean;
}

/**
 * Tab props common security handlers
 */
export interface SecurityHandlers {
  onPasswordChange: (req: PasswordChangeRequest) => void;
  onPINChange: (req: PINChangeRequest) => void;
  onToggle2FA: (req: TwoFARequest) => void;
}

/**
 * Tab + Security Controller State
 */
export interface ProfileControllerState {
  // UI Navigation
  activeTab: TabType;

  // Security Forms
  isEditingPassword: boolean;
  isEditingPIN: boolean;

  // Password Fields
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;

  // PIN Fields
  newPIN: string;
  confirmPIN: string;

  // Status Flags
  pinVerified: boolean;
  is2FAEnabled: boolean;
}
