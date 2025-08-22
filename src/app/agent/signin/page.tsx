// File: src/app/agent/signin/page.tsx

"use client";

import { useAuth } from "./useAuth";
import { AuthForm } from "./AuthForm";
import toast from "react-hot-toast";
import { AgentLoginSeo } from "@/components/seo";

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
      // toast.success("Login successful!");
    } else if (result.message) {
      toast.error(result.message);
    }
  };

  const handleProviderSubmit = async (provider: "google" | "github") => {
    const result = await handleProviderSignIn(provider);
    if (result.success) {
      toast.success(`${provider} login successful!`);
    } else if (result.message) {
      toast.error(result.message);
    }
  };

  const handleNimcSubmit = async (nin: string) => {
    const result = await handleNimcVerification(nin);
    if (result.success) {
      toast.success("NIMC verification successful!");
    } else if (result.message) {
      toast.error(result.message);
    }
  };

  return (
    <>
      <AgentLoginSeo />
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <AuthForm
          loading={loading}
          nimcLoading={nimcLoading}
          onSubmit={handleSubmit}
          onProviderSignIn={handleProviderSubmit}
          onNimcVerify={handleNimcSubmit}
        />
      </div>
    </>
  );
}
