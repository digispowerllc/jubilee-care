"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { notifySuccess, notifyError } from "@/components/store/notification";

type AgentData = {
  surname: string;
  firstName: string;
  otherName: string;
  email: string;
  phone: string;
  nin: string;
  state: string;
  lga: string;
  address: string;
};

const initialData: AgentData = {
  surname: "",
  firstName: "",
  otherName: "",
  email: "",
  phone: "",
  nin: "",
  state: "",
  lga: "",
  address: "",
};

const PasswordStrength = ({ strength }: { strength: number }) => {
  const getColor = () => {
    if (strength > 70) return "bg-green-500";
    if (strength > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mt-1 h-1 w-full bg-gray-200 rounded-full">
      <div
        className={`h-full rounded-full ${getColor()}`}
        style={{ width: `${strength}%` }}
      />
    </div>
  );
};

export default function AgentEnroll() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [agentData, setAgentData] = useState<AgentData>({ ...initialData });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [stateLoading, setStateLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const lgaCache = useMemo(() => new Map<string, string[]>(), []);

  // Calculate password strength
  useEffect(() => {
    const strength = Math.min(Math.max(password.length * 10, 0), 100);
    setPasswordStrength(strength);
  }, [password]);

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      setStateLoading(true);
      try {
        const cached = sessionStorage.getItem("cachedStates");
        if (cached) {
          setStates(JSON.parse(cached));
        } else {
          const res = await fetch(
            "https://apinigeria.vercel.app/api/v1/states"
          );
          const data = await res.json();
          setStates(data.states);
          sessionStorage.setItem("cachedStates", JSON.stringify(data.states));
        }
      } catch (error) {
        notifyError("Failed to load states");
      } finally {
        setStateLoading(false);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (agentData.state) {
      const fetchCities = async () => {
        if (lgaCache.has(agentData.state)) {
          setCities(lgaCache.get(agentData.state) ?? []);
          return;
        }

        setCityLoading(true);
        try {
          const res = await fetch(
            `https://apinigeria.vercel.app/api/v1/lga?state=${encodeURIComponent(
              agentData.state
            )}`
          );
          const data = await res.json();
          setCities(data.lgas);
          lgaCache.set(agentData.state, data.lgas);
        } catch (error) {
          notifyError("Failed to load LGAs");
        } finally {
          setCityLoading(false);
        }
      };
      fetchCities();
    }
  }, [agentData.state, lgaCache]);

  const validateEmail = (email: string): boolean => {
    const trimmed = email.trim();
    if (
      !trimmed ||
      /\s/.test(trimmed) ||
      !/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)
    ) {
      notifyError("Enter a valid email address");
      return false;
    }
    return true;
  };

  const checkEmail = useCallback(async (): Promise<boolean> => {
    try {
      setEmailChecking(true);
      const res = await fetch(
        `/api/check-email?email=${encodeURIComponent(agentData.email)}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        notifyError(errorData.error || "Failed to verify email");
        return false;
      }

      const result = await res.json();
      if (result.disposable) {
        notifyError("This email address cannot be used");
        return false;
      }

      return true;
    } catch (error) {
      notifyError("Unable to verify email. Please try again");
      return false;
    } finally {
      setEmailChecking(false);
    }
  }, [agentData.email]);

  const validateStep = useCallback(async (): Promise<boolean> => {
    const validateField = (value: string, fieldName: string, minLength = 1) => {
      if (!value?.trim() || value.trim().length < minLength) {
        notifyError(`${fieldName} is required`);
        return false;
      }
      return true;
    };

    switch (step) {
      case 1:
        if (!validateField(agentData.surname, "Surname")) return false;
        if (!validateField(agentData.firstName, "First name")) return false;
        if (agentData.otherName && !/^[A-Za-z]+$/.test(agentData.otherName)) {
          notifyError("Other name must contain only letters");
          return false;
        }
        break;

      case 2:
        if (!validateField(agentData.email, "Email")) return false;
        if (!validateEmail(agentData.email)) return false;
        if (!validateField(agentData.phone, "Phone number", 10)) return false;
        if (!/^\d+$/.test(agentData.phone)) {
          notifyError("Phone number must contain only digits");
          return false;
        }
        if (password.length < 8) {
          notifyError("Password must be at least 8 characters");
          return false;
        }
        return await checkEmail();

      case 3:
        if (!validateField(agentData.nin, "NIN", 11)) return false;
        if (!/^\d{11}$/.test(agentData.nin)) {
          notifyError("NIN must be exactly 11 digits");
          return false;
        }
        break;

      case 4:
        if (!validateField(agentData.state, "State")) return false;
        if (!validateField(agentData.lga, "LGA")) return false;
        if (!validateField(agentData.address, "Address", 10)) return false;
        break;
    }

    return true;
  }, [step, agentData, password, checkEmail]);

  const nextStep = useCallback(async () => {
    if (await validateStep()) setStep((s) => s + 1);
  }, [validateStep]);

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const submitForm = useCallback(async () => {
    if (!(await validateStep())) return;

    setFormSubmitted(true);

    try {
      // Validate agent data first
      const validationRes = await fetch("/api/agent/validateAgent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: agentData.email.trim(),
          phone: agentData.phone.trim(),
          nin: agentData.nin.trim(),
        }),
      });

      if (!validationRes.ok) {
        const errorData = await validationRes.json();
        throw new Error(errorData.message || "Validation failed");
      }

      // Create agent account
      const enrollRes = await fetch("/api/agent/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...agentData,
          surname: agentData.surname.trim(),
          firstName: agentData.firstName.trim(),
          otherName: agentData.otherName?.trim() || "",
          email: agentData.email.trim(),
          phone: agentData.phone.trim(),
          nin: agentData.nin.trim(),
          state: agentData.state.trim(),
          lga: agentData.lga.trim(),
          address: agentData.address.trim(),
          password,
        }),
      });

      if (!enrollRes.ok) {
        const errorData = await enrollRes.json();
        throw new Error(errorData.message || "Enrollment failed");
      }

      notifySuccess("Account created successfully!");
      router.push("agent/signin");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to submit form";
      notifyError(message);
    } finally {
      setFormSubmitted(false);
    }
  }, [validateStep, agentData, password, router]);

  // Handle Enter key navigation
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (step < 4) await nextStep();
        else await submitForm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, nextStep, submitForm]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#008751]">
              Agent Enrollment
            </h1>
            <p className="mt-2 text-gray-600">
              Complete all steps to register as an agent
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex flex-col items-center ${
                  stepNumber < step ? "text-green-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    stepNumber <= step
                      ? "bg-green-100 border-2 border-green-500"
                      : "bg-gray-100 border-2 border-gray-300"
                  }`}
                >
                  {stepNumber < step ? "✓" : stepNumber}
                </div>
                <span className="text-xs mt-1">Step {stepNumber}</span>
              </div>
            ))}
          </div>

          {/* Form Steps */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Surname*
                  </label>
                  <input
                    type="text"
                    value={agentData.surname}
                    onChange={(e) =>
                      setAgentData({ ...agentData, surname: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Enter your surname"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    value={agentData.firstName}
                    onChange={(e) =>
                      setAgentData({ ...agentData, firstName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={agentData.otherName}
                    onChange={(e) =>
                      setAgentData({ ...agentData, otherName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Enter other name if any"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contact Info */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    value={agentData.email}
                    onChange={(e) =>
                      setAgentData({ ...agentData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    value={agentData.phone}
                    onChange={(e) =>
                      setAgentData({ ...agentData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="08012345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Create Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all pr-12"
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <PasswordStrength strength={passwordStrength} />
                  <p className="text-xs text-gray-500 mt-1">
                    {password.length > 0
                      ? password.length < 8
                        ? "Password too short"
                        : "Strong password"
                      : "Minimum 8 characters"}
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Identification */}
            {step === 3 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  National Identification Number (NIN)*
                </label>
                <input
                  type="text"
                  value={agentData.nin}
                  onChange={(e) =>
                    setAgentData({ ...agentData, nin: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="11-digit NIN"
                  maxLength={11}
                />
              </div>
            )}

            {/* Step 4: Location */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State*
                    </label>
                    <select
                      value={agentData.state}
                      onChange={(e) =>
                        setAgentData({ ...agentData, state: e.target.value })
                      }
                      disabled={stateLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LGA*
                    </label>
                    <select
                      value={agentData.lga}
                      onChange={(e) =>
                        setAgentData({ ...agentData, lga: e.target.value })
                      }
                      disabled={!cities.length || cityLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    >
                      <option value="">Select LGA</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address*
                  </label>
                  <textarea
                    value={agentData.address}
                    onChange={(e) =>
                      setAgentData({ ...agentData, address: e.target.value })
                    }
                    className="w-full min-h-[100px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Street, Area, Landmark..."
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  ← Back
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 text-white font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={step === 2 && emailChecking}
                >
                  {step === 2 && emailChecking ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    "Continue →"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submitForm}
                  disabled={formSubmitted}
                  className="flex items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 text-white font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formSubmitted ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Complete Enrollment"
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
            <p>
              Already have an account?{" "}
              <a
                href="/agent/signin"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
