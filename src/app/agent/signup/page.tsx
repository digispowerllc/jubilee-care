"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter";
import {
  submitAgentSignup,
  checkEmailAvailability,
} from "./handleSignupSubmit";
import {
  storage,
  validateStep,
  fetchStates,
  fetchCities,
} from "./signupHandlers";

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

// Main component for agent enrollment
export default function AgentEnroll() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [agentData, setAgentData] = useState<AgentData>({ ...initialData });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [stateLoading, setStateLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const lgaCache = useMemo(() => new Map<string, string[]>(), []);

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await storage.getTempData();
        if (saved) {
          setAgentData({
            surname: saved.data.surname,
            firstName: saved.data.firstName,
            otherName: saved.data.otherName,
            email: saved.data.email,
            phone: saved.data.phone,
            nin: saved.data.nin,
            state: saved.data.state,
            lga: saved.data.lga,
            address: saved.data.address,
          });
          setPassword(saved.password);
          setStep(saved.step);
        }
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }

      // Load states separately
      const loadStates = async () => {
        setStateLoading(true);
        try {
          const statesData = await fetchStates();
          setStates(statesData);
        } finally {
          setStateLoading(false);
        }
      };
      loadStates();
    };

    loadData();
  }, []);

  // Auto-save when fields change
  const updateField = useCallback(
    async (field: keyof AgentData, value: string) => {
      const newData = { ...agentData, [field]: value };
      setAgentData(newData);
      await storage.saveTempData(newData, step);
    },
    [step, agentData]
  );

  const updatePassword = useCallback(
    async (value: string) => {
      setPassword(value);
      await storage.saveTempData(agentData, step);
    },
    [agentData, step]
  );

  // Field blur handler for auto-saving
  const handleBlur = useCallback(async () => {
    await storage.saveTempData(agentData, step);
  }, [agentData, step]);

  // Calculate password strength
  // Calculate password strength
  // (Removed unused passwordStrength state and effect)
  // Fetch cities when state changes
  useEffect(() => {
    if (agentData.state) {
      const loadCities = async () => {
        setCityLoading(true);
        try {
          const citiesData = await fetchCities(agentData.state, lgaCache);
          setCities(citiesData);
        } finally {
          setCityLoading(false);
        }
      };
      loadCities();
    }
  }, [agentData.state, lgaCache]);

  const checkEmail = useCallback(async (): Promise<boolean> => {
    try {
      setEmailChecking(true);
      return await checkEmailAvailability(agentData.email);
    } finally {
      setEmailChecking(false);
    }
  }, [agentData.email]);

  const nextStep = useCallback(async () => {
    if (await validateStep(step, agentData, password, checkEmail)) {
      const newStep = step + 1;
      setStep(newStep);
      storage.saveTempData(agentData, newStep);
    }
  }, [step, agentData, password, checkEmail]);

  const prevStep = () => {
    const newStep = step - 1;
    setStep(newStep);
    storage.saveTempData(agentData, newStep);
  };

  const submitForm = useCallback(async () => {
    if (!(await validateStep(step, agentData, password, checkEmail))) return;

    setFormSubmitted(true);
    try {
      const success = await submitAgentSignup(agentData, password);
      if (success) {
        storage.clearTempData();
        router.push("/agent/signin");
      }
    } finally {
      setFormSubmitted(false);
    }
  }, [step, agentData, password, router, checkEmail]);

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
       className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all focus:outline-none focus-visible:outline-none"
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-gray-700 ${
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
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-12 focus:outline-none focus-visible:outline-none"

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
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all focus:outline-none focus-visible:outline-none"
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
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all focus:outline-none focus-visible:outline-none"
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
                    className="w-full min-h-[100px] px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all focus:outline-none focus-visible:outline-none"
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
