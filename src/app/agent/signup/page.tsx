"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, ArrowLeft, Shield, User, Mail, Phone, MapPin, FileText } from "lucide-react";
import { FiLock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isPasswordValid, setIsPasswordValid] = useState(false);

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

  // Password strength indicators
  const passwordStrength = {
    hasMinLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
  };

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
  useEffect(() => {
    const isValid = (
      password.length >= 8 &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
    setIsPasswordValid(isValid);
  }, [password]);

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
  const renderField = (
    field: keyof AgentData,
    label: string,
    type = "text",
    required = true,
    options?: { maxLength?: number; minLength?: number },
    icon?: React.ElementType
  ) => {
    const IconComponent = icon;
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
          {IconComponent && (
            <IconComponent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          )}
          <input
            type={type}
            value={agentData[field]}
            onChange={(e) => updateField(field, e.target.value)}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
              IconComponent ? "pl-10" : ""
            }`}
            placeholder={`Enter your ${label.toLowerCase()}`}
            required={required}
            maxLength={options?.maxLength}
            minLength={options?.minLength}
          />
        </div>
      </div>
    );
  };

  const steps = [
    { number: 1, title: "Personal Information" },
    { number: 2, title: "Contact Details" },
    { number: 3, title: "Identity Verification" },
    { number: 4, title: "Location Details" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Agent Enrollment
          </h1>
          <p className="text-green-100">
            Complete all steps to register as an agent
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Step Progress */}
          <div className="relative">
            <div className="flex justify-between mb-3">
              {steps.map((stepItem) => (
                <div key={stepItem.number} className="text-center flex-1">
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    Step {stepItem.number}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stepItem.title}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative mb-8">
              <div className="absolute top-3 left-0 w-full h-1.5 bg-gray-200 rounded-full" />
              <div
                className="absolute top-3 left-0 h-1.5 bg-green-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
              <div className="flex justify-between relative">
                {steps.map((stepItem) => (
                  <div
                    key={stepItem.number}
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium transition-all ${
                      stepItem.number <= step
                        ? "bg-green-500 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {stepItem.number < step ? "✓" : stepItem.number}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {renderField("surname", "Surname", "text", true, undefined, User)}
                  {renderField("firstName", "First Name", "text", true, undefined, User)}
                  {renderField("otherName", "Other Name", "text", false, undefined, User)}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {renderField("email", "Email Address", "email", true, undefined, Mail)}
                  {renderField("phone", "Phone Number", "tel", true, {
                    minLength: 10,
                    maxLength: 11,
                  }, Phone)}

                  {/* Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Create Password<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => updatePassword(e.target.value)}
                        onBlur={handleBlur}
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="At least 8 characters with number and special character"
                        minLength={8}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Password Requirements */}
                    <div className="mt-3 space-y-2">
                      <PasswordRequirement
                        met={passwordStrength.hasMinLength}
                        text="At least 8 characters"
                      />
                      <PasswordRequirement
                        met={passwordStrength.hasNumber}
                        text="Contains a number"
                      />
                      <PasswordRequirement
                        met={passwordStrength.hasSpecialChar}
                        text="Contains a special character"
                      />
                      <PasswordRequirement
                        met={passwordStrength.hasUppercase}
                        text="Contains an uppercase letter"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {renderField("nin", "National Identification Number (NIN)", "tel", true, {
                    minLength: 11,
                    maxLength: 11,
                  }, FileText)}
                  
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">NIN Verification</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Your NIN will be verified for identity confirmation and enhanced security.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* State */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        State<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          value={agentData.state}
                          onChange={(e) => updateField("state", e.target.value)}
                          onBlur={handleBlur}
                          disabled={stateLoading}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none"
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
                    </div>

                    {/* LGA */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        LGA<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          value={agentData.lga}
                          onChange={(e) => updateField("lga", e.target.value)}
                          onBlur={handleBlur}
                          disabled={!cities.length || cityLoading}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none"
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
                  </div>

                  {/* Address */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Full Address<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <textarea
                        value={agentData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        onBlur={handleBlur}
                        className="w-full min-h-[100px] pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="Street, Area, Landmark..."
                        minLength={10}
                        maxLength={200}
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              {step > 1 ? (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center text-green-600 hover:text-green-800 font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </motion.button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl shadow-md hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={step === 2 && (emailChecking || !isPasswordValid)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {step === 2 && emailChecking ? (
                    <div className="flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Verifying...
                    </div>
                  ) : (
                    "Continue"
                  )}
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  onClick={submitForm}
                  disabled={formSubmitted}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl shadow-md hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {formSubmitted ? (
                    <div className="flex items-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Submitting...
                    </div>
                  ) : (
                    "Complete Enrollment"
                  )}
                </motion.button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-4">
            Already have an account?{" "}
            <a
              href="/agent/signin"
              className="font-medium text-green-600 hover:text-green-500 transition-colors"
            >
              Sign in here
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center text-sm">
      {met ? (
        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
      ) : (
        <div className="h-4 w-4 rounded-full border border-gray-300 mr-2" />
      )}
      <span className={met ? "text-gray-600" : "text-gray-400"}>{text}</span>
    </div>
  );
}