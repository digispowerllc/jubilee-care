"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { notifySuccess, notifyError } from "@/components/Notification";
import { protectData, unprotectData } from "@/lib/encryptorGenerators/dataProtection";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter";

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

  // Storage management with encryption
  const storage = useMemo(
    () => ({
      saveTempData: (data: AgentData, currentStep: number, pass: string) => {
        try {
          const encryptedData = {
            surname: data.surname,
            firstName: data.firstName,
            otherName: data.otherName || "",
            email: protectData(data.email, "email") as string,
            phone: protectData(data.phone, "phone") as string,
            nin: protectData(data.nin, "government-id") as string,
            state: data.state,
            lga: data.lga,
            address: data.address,
          };

          localStorage.setItem(
            "agent_enrollment",
            JSON.stringify({
              data: encryptedData,
              step: currentStep,
              password: pass,
              timestamp: new Date().toISOString(),
            })
          );
        } catch (error) {
          console.error("Failed to save temporary data:", error);
        }
      },

      getTempData: () => {
        try {
          const saved = localStorage.getItem("agent_enrollment");
          if (!saved) return null;

          const parsed = JSON.parse(saved);
          return {
            data: {
              ...parsed.data,
              email: unprotectData(parsed.data.email, "email"),
              phone: unprotectData(parsed.data.phone, "phone"),
              nin: unprotectData(parsed.data.nin, "government-id"),
            },
            step: parsed.step,
            password: parsed.password,
          };
        } catch (error) {
          console.error("Failed to load temporary data:", error);
          return null;
        }
      },

      clearTempData: () => {
        localStorage.removeItem("agent_enrollment");
      },
    }),
    []
  );

  // Load saved data on mount
  useEffect(() => {
    const saved = storage.getTempData();
    if (saved) {
      setAgentData(saved.data);
      setPassword(saved.password);
      setStep(saved.step);
    }
  }, [storage]);

  // Auto-save when fields change
  const updateField = useCallback(
    (field: keyof AgentData, value: string) => {
      setAgentData((prev) => {
        const newData = { ...prev, [field]: value };
        storage.saveTempData(newData, step, password);
        return newData;
      });
    },
    [step, password, storage]
  );

  const updatePassword = useCallback(
    (value: string) => {
      setPassword(value);
      storage.saveTempData(agentData, step, value);
    },
    [agentData, step, storage]
  );

  // Field blur handler for auto-saving
  const handleBlur = useCallback(() => {
    storage.saveTempData(agentData, step, password);
  }, [agentData, step, password, storage]);

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
      } catch {
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
        } catch {
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
      console.error("Failed to verify email:", error);
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
    if (await validateStep()) {
      const newStep = step + 1;
      setStep(newStep);
      storage.saveTempData(agentData, newStep, password);
    }
  }, [validateStep, step, agentData, password, storage]);

  const prevStep = () => {
    const newStep = step - 1;
    setStep(newStep);
    storage.saveTempData(agentData, newStep, password);
  };

  const submitForm = useCallback(async () => {
    if (!(await validateStep())) return;

    setFormSubmitted(true);

    try {
      const response = await fetch("/api/agent/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...agentData,
          password,
          encryptionVersion: "v2",
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      storage.clearTempData();
      notifySuccess("Account created successfully!");
      router.push("/agent/signin");
    } catch (error) {
      notifyError(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setFormSubmitted(false);
    }
  }, [validateStep, agentData, password, router, storage]);

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

  // Render field helper
  const renderField = (
    field: keyof AgentData,
    label: string,
    type = "text",
    required = true,
    options?: { maxLength?: number; minLength?: number }
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && "*"}
      </label>
      <input
        type={type}
        value={agentData[field]}
        onChange={(e) => updateField(field, e.target.value)}
        onBlur={handleBlur}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
        placeholder={`Enter your ${label.toLowerCase()}`}
        required={required}
        maxLength={options?.maxLength}
        minLength={options?.minLength}
      />
    </div>
  );

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
                {renderField("surname", "Surname")}
                {renderField("firstName", "First Name")}
                {renderField(
                  "otherName",
                  "Other Name (Optional)",
                  "text",
                  false
                )}
              </div>
            )}

            {/* Step 2: Contact Info */}
            {step === 2 && (
              <div className="space-y-5">
                {renderField("email", "Email Address", "email")}
                {renderField("phone", "Phone Number", "tel", true, {
                  minLength: 10,
                  maxLength: 11,
                })}
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Create Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => updatePassword(e.target.value)}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all pr-12"
                      placeholder="At least 8 characters"
                      minLength={8}
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
                  {/* Password Strength Meter */}
                  <PasswordStrengthMeter password={password} />
                </div>
              </div>
            )}

            {/* Step 3: Identification */}
            {step === 3 &&
              renderField(
                "nin",
                "National Identification Number (NIN)",
                "tel",
                true,
                { minLength: 11, maxLength: 11 }
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
                      onChange={(e) => updateField("state", e.target.value)}
                      onBlur={handleBlur}
                      disabled={stateLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      required
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
                      onChange={(e) => updateField("lga", e.target.value)}
                      onBlur={handleBlur}
                      disabled={!cities.length || cityLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      required
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
                    onChange={(e) => updateField("address", e.target.value)}
                    onBlur={handleBlur}
                    className="w-full min-h-[100px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Street, Area, Landmark..."
                    minLength={10}
                    maxLength={200}
                    required
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
