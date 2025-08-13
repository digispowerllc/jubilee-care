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

  // Field Renderer

  // Updated renderField helper with improved styling
  // Field Renderer
  const renderField = (
    field: keyof AgentData,
    label: string,
    type = "text",
    required = true,
    options?: { maxLength?: number; minLength?: number }
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={agentData[field]}
        onChange={(e) => updateField(field, e.target.value)}
        onBlur={handleBlur}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all focus:outline-none focus-visible:outline-none hover:shadow-sm"
        placeholder={`Enter your ${label.toLowerCase()}`}
        required={required}
        maxLength={options?.maxLength}
        minLength={options?.minLength}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#008751]">
              Agent Enrollment
            </h1>
            <p className="mt-2 text-gray-600">
              Complete all steps to register as an agent
            </p>
          </div>

          {/* Step Progress */}
          <div className="relative mb-8">
            {/* Gray base line */}
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full" />

            {/* Green animated line */}
            <div
              className="absolute top-5 left-0 h-1 bg-green-500 rounded-full transition-[width] duration-[1500ms] ease-in-out"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {/* Step circles */}
            <div className="flex justify-between relative">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium ${
                    n <= step
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {n < step ? "✓" : n}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

            {step === 2 && (
              <div className="space-y-6">
                {renderField("email", "Email Address", "email")}
                {renderField("phone", "Phone Number", "tel", true, {
                  minLength: 10,
                  maxLength: 11,
                })}

                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Create Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => updatePassword(e.target.value)}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all focus:outline-none focus-visible:outline-none hover:shadow-sm pr-12"
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
                  <PasswordStrengthMeter password={password} />
                </div>
              </div>
            )}

            {step === 3 &&
              renderField(
                "nin",
                "National Identification Number (NIN)",
                "tel",
                true,
                { minLength: 11, maxLength: 11 }
              )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* State */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      State<span className="text-red-500">*</span>
                    </label>
                    <select
                      value={agentData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      onBlur={handleBlur}
                      disabled={stateLoading}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all focus:outline-none focus-visible:outline-none hover:shadow-sm"
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

                  {/* LGA */}
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      LGA<span className="text-red-500">*</span>
                    </label>
                    <select
                      value={agentData.lga}
                      onChange={(e) => updateField("lga", e.target.value)}
                      onBlur={handleBlur}
                      disabled={!cities.length || cityLoading}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all focus:outline-none focus-visible:outline-none hover:shadow-sm"
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

                {/* Address */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Full Address<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={agentData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    onBlur={handleBlur}
                    className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all focus:outline-none focus-visible:outline-none hover:shadow-sm"
                    placeholder="Street, Area, Landmark..."
                    minLength={10}
                    maxLength={200}
                    required
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
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
                  className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-6 py-3 shadow-md transition-transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={step === 2 && emailChecking}
                >
                  {step === 2 && emailChecking ? "Verifying..." : "Continue →"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submitForm}
                  disabled={formSubmitted}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-6 py-3 shadow-md transition-transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {formSubmitted ? "Submitting..." : "Complete Enrollment"}
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
            Already have an account?{" "}
            <a
              href="/agent/signin"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign in here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
