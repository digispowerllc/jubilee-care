// // File: src/app/agent/signin/useAuth.ts
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, providerSignIn } from "./signAuth";

export const useAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/agent/profile";
  const [loading, setLoading] = useState(false);
  const [nimcLoading, setNimcLoading] = useState(false);

  const handleSignIn = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      const result = await signIn(identifier, password);
      if (result.success) {
        router.push(redirectTo);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSignIn = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      // This would typically redirect to OAuth provider
      // For demo, we'll simulate with a timeout
      const result = await providerSignIn(provider);
      if (result.success) {
        router.push(redirectTo);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleNimcVerification = async (nin: string) => {
    setNimcLoading(true);
    try {
      const result = await providerSignIn("nimc", { nin });
      if (result.success) {
        router.push(redirectTo);
      }
      return result;
    } finally {
      setNimcLoading(false);
    }
  };

  return {
    loading,
    nimcLoading,
    handleSignIn,
    handleProviderSignIn,
    handleNimcVerification,
    redirectTo
  };
};