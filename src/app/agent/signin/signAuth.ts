// import AuthForm from "./AuthForm";
type AuthResult = {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    agentId: string;
    firstName: string;
    surname: string;
    email: string;
    phone: string;
  };
  requiresPassword?: boolean;
  lockout?: boolean;
  retryAfter?: number | string | null;
};

type AuthProvider = "google" | "github" | "nimc";

// NIMC Verification Status
type NimcVerificationStatus = "verified" | "pending" | "rejected" | "not_found";

interface NimcVerificationResult {
  status: NimcVerificationStatus;
  userData?: {
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
  };
  verificationDate?: string;
}

export const signIn = async (
  identifier: string,
  password: string
): Promise<AuthResult> => {
  try {
    // Basic validation
    if (!identifier) {
      return { success: false, message: "Please provide your email or phone." };
    }
    if (!password) {
      return { success: false, message: "Please enter your password." };
    }

    // Trim & normalize
    identifier = identifier.trim().toLowerCase();
    password = password.trim();

    if (!identifier) {
      return { success: false, message: "Identifier cannot be empty." };
    }

    // Validate identifier format (email or phone)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^\+?[\d\s-]{10,}$/.test(identifier);

    if (!isEmail && !isPhone) {
      return {
        success: false,
        message: "Please enter a valid email address or phone number",
      };
    }

    const response = await fetch("/agent/signin/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        identifier,
        password,
        usePassword: true,
        timestamp: new Date().toISOString(),
      }),
    });

    const data = await response.json();

    // Handle 429 separately to show lockout info
    if (response.status === 429) {
      return {
        success: false,
        lockout: true,
        message:
          data.message || "Account temporarily locked due to too many attempts",
        retryAfter: data.retryAfter || null, // optional: you can send milliseconds or formatted time from backend
      };
    }

    // Handle other non-OK responses
    if (!response.ok) {
      return {
        success: false,
        message:
          data?.error?.formErrors ||
          data?.error?.fieldErrors ||
          data?.message ||
          "Incorrect e-Mail address, phone number, or password",
      };
    }

    // Successful login src\app\api\agent\auth\logout
    return {
      success: data.success,
      token: data.token,
      user: data.user,
      requiresPassword: data.requiresPassword || false,
      message: data.message || "Login successful - Welcome back!",
      lockout: data.lockout || false,
    };
  } catch (error) {
    console.error("SignIn error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Network error during authentication",
    };
  }
};

// Handle provider sign-in
export const providerSignIn = async (
  provider: AuthProvider,
  authData?: {
    nin?: string;
    dob?: string;
    firstName?: string;
    lastName?: string;
    [key: string]: unknown;
  }
): Promise<AuthResult> => {
  try {
    // Special handling for NIMC verification
    if (provider === "nimc") {
      return handleNimcVerification(authData ?? {});
    }

    // OAuth providers
    const response = await fetch(`/api/3party/${provider}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        authData,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, message: error.message };
    }

    const data = await response.json();
    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error(`${provider} sign in error:`, error);
    return {
      success: false,
      message: `${provider.charAt(0).toUpperCase()}${provider.slice(1).toLowerCase()} authentication failed`,
    };
  }
};

// Handle NIMC verification
const handleNimcVerification = async (authData: {
  nin?: string;
  dob?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}): Promise<AuthResult> => {
  try {
    const { nin, dob, firstName, lastName } = authData;

    // Enhanced NIN validation
    if (!nin || !/^\d{11}$/.test(nin)) {
      return {
        success: false,
        message: "Valid 11-digit NIN is required",
      };
    }

    // Additional identity verification
    if (!dob || !firstName || !lastName) {
      return {
        success: false,
        message: "Additional identity information required",
      };
    }

    // Verify age (must be at least 18)
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (age < 18) {
      return {
        success: false,
        message: "Must be at least 18 years old",
      };
    }

    // Call NIMC verification API
    const response = await fetch("/api/3party/nimc/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NIMC_API_KEY}`,
      },
      body: JSON.stringify({
        nin,
        firstName,
        lastName,
        dob,
        verificationType: "standard",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || "NIMC verification failed",
      };
    }

    const result: NimcVerificationResult = await response.json();

    if (result.status !== "verified") {
      return {
        success: false,
        message: "NIMC verification failed. Details did not match.",
        user: undefined,
      };
    }

    // Create or update user account
    const userResponse = await fetch("/api/3party/nimc/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nin,
        ...result.userData,
        verified: true,
        verificationDate: result.verificationDate,
      }),
    });

    if (!userResponse.ok) {
      throw new Error("User registration failed");
    }

    const userData = await userResponse.json();

    return {
      success: true,
      token: userData.token,
      user: userData.user,
      message: "NIMC verification successful",
    };
  } catch (error) {
    console.error("NIMC verification error:", error);
    return {
      success: false,
      message: "NIMC service unavailable. Please try again later.",
    };
  }
};

// Additional helper functions
export const checkNimcStatus = async (
  nin: string
): Promise<NimcVerificationStatus> => {
  try {
    const response = await fetch(`/api/3party/nimc/status?nin=${nin}`);
    if (!response.ok) throw new Error("Status check failed");
    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error("NIMC status check error:", error);
    return "not_found";
  }
};
