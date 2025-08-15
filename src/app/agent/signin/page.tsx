// File: src/app/agent/signin/page.tsx

"use client";

import { useAuth } from "./useAuth";
import { AuthForm } from "./AuthForm";
import { notifySuccess, notifyError } from "@/components/global/Notification";

export default function SignInPage() {
  const {
    loading,
    nimcLoading,
    handleSignIn,
    handleProviderSignIn,
    handleNimcVerification,
  } = useAuth();

  const handleSubmit = async (identifier: string, password: string) => {
    const result = await handleSignIn(identifier, password);
    if (result.success) {
      // notifySuccess("Login successful!");
    } else if (result.message) {
      notifyError(result.message);
    }
  };

  const handleProviderSubmit = async (provider: "google" | "github") => {
    const result = await handleProviderSignIn(provider);
    if (result.success) {
      notifySuccess(`${provider} login successful!`);
    } else if (result.message) {
      notifyError(result.message);
    }
  };

  const handleNimcSubmit = async (nin: string) => {
    const result = await handleNimcVerification(nin);
    if (result.success) {
      notifySuccess("NIMC verification successful!");
    } else if (result.message) {
      notifyError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <AuthForm
        loading={loading}
        nimcLoading={nimcLoading}
        onSubmit={handleSubmit}
        onProviderSignIn={handleProviderSubmit}
        onNimcVerify={handleNimcSubmit}
      />
    </div>
  );
}
