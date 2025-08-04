"use client";

import { useEffect, useState, useCallback } from "react";
import {
  notifySuccess,
  notifyError,
} from "@/app/components/store/notification";

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

const Input = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input {...props} className="input" />
  </div>
);

const Select = ({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select {...props} className="input">
      {children}
    </select>
  </div>
);

export default function AgentEnroll() {
  const [step, setStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [agentData, setAgentData] = useState<AgentData>({ ...initialData });
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [stateLoading, setStateLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [previousState, setPreviousState] = useState("");
  const lgaCache = new Map<string, string[]>();

  const [emailChecking, setEmailChecking] = useState(false);

  const validateEmail = (email: string): boolean => {
    const trimmed = email.trim();
    if (
      !trimmed ||
      /\s/.test(trimmed) ||
      !/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)
    ) {
      notifyError("Enter a valid email address.");
      return false;
    }
    return true;
  };

  const checkEmail = async (): Promise<boolean> => {
    try {
      setEmailChecking(true);
      const res = await fetch(
        `/api/check-email?email=${encodeURIComponent(agentData.email)}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        notifyError(errorData.error || "Failed to verify email.");
        return false;
      }

      const result = await res.json();

      if (result.disposable) {
        notifyError("Invalid email address provided.");
        return false;
      }

      return true;
    } catch (error) {
      notifyError("Unable to verify email. Please try again.");
      return false;
    } finally {
      setEmailChecking(false);
    }
  };

  const validateStep = async (): Promise<boolean> => {
    const {
      surname,
      firstName,
      otherName,
      email,
      phone,
      nin,
      state,
      lga,
      address,
    } = agentData;
    const onlyLetters = /^[A-Za-z]+$/;
    const phonePattern = /^\d{10,15}$/;
    const ninPattern = /^\d{11}$/;

    switch (step) {
      case 1:
        if (!surname.trim() || !onlyLetters.test(surname))
          return notifyError("Surname is required."), false;
        if (!firstName.trim() || !onlyLetters.test(firstName))
          return notifyError("First name is required."), false;
        if (otherName && !onlyLetters.test(otherName.trim()))
          return notifyError("Other name must contain only letters."), false;
        break;
      case 2:
        if (!validateEmail(email)) return false;
        if (!phonePattern.test(phone))
          return notifyError("Invalid phone number."), false;
        return await checkEmail();
      case 3:
        if (!ninPattern.test(nin))
          return notifyError("NIN must be 11 digits."), false;
        break;
      case 4:
        if (!state) return notifyError("Select a state."), false;
        if (!lga) return notifyError("Select an LGA."), false;
        if (address.length < 10)
          return notifyError("Address too short."), false;
        break;
    }

    return true;
  };

  const nextStep = async () => {
    if (await validateStep()) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const submitForm = async () => {
    if (!(await validateStep())) return;

    setFormSubmitted(true);
    try {
      const res = await fetch("/agent/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentData),
      });

      const result = await res.json();
      if (!res.ok) {
        notifyError(result?.message || "Submission failed.");
        return;
      }

      notifySuccess("Agent onboarded successfully!");
      setAgentData({ ...initialData });
      setStep(1);
    } catch {
      notifyError("Failed to submit.");
    } finally {
      setFormSubmitted(false);
    }
  };

  const fetchStates = async () => {
    setStateLoading(true);
    try {
      const cached = sessionStorage.getItem("cachedStates");
      if (cached) {
        setStates(JSON.parse(cached));
      } else {
        const res = await fetch("https://apinigeria.vercel.app/api/v1/states");
        const data = await res.json();
        setStates(data.states);
        sessionStorage.setItem("cachedStates", JSON.stringify(data.states));
      }
    } catch {
      setStates([]);
    } finally {
      setStateLoading(false);
    }
  };

  const fetchCities = useCallback(
    async (state: string) => {
      if (lgaCache.has(state)) {
        setCities(lgaCache.get(state) ?? []);
        return;
      }

      setCityLoading(true);
      try {
        const res = await fetch(
          `https://apinigeria.vercel.app/api/v1/lga?state=${encodeURIComponent(
            state
          )}`
        );
        const data = await res.json();
        setCities(data.lgas);
        lgaCache.set(state, data.lgas);
      } catch {
        setCities([]);
      } finally {
        setCityLoading(false);
      }
    },
    [lgaCache]
  );

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (agentData.state && agentData.state !== previousState) {
      setPreviousState(agentData.state);
      setCities([]);
      fetchCities(agentData.state);
    }
  }, [agentData.state, fetchCities, previousState]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#008751]">
            Agent Onboarding
          </h1>
          <p className="text-gray-600 text-base mt-2">
            Complete all steps to register an agent.
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-white p-8 shadow-lg rounded-3xl space-y-10"
        >
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold text-[#008751] mb-6">
                Step 1: Personal Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="surname"
                    className="block text-base font-medium text-gray-800 mb-2"
                  >
                    Surname
                  </label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    placeholder="Enter surname"
                    value={agentData.surname}
                    onChange={(e) =>
                      setAgentData({ ...agentData, surname: e.target.value })
                    }
                    className="block w-full border border-gray-300 focus:border-[#008751] focus:ring-[#008751] rounded-lg shadow-sm px-4 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={agentData.firstName}
                    onChange={(e) =>
                      setAgentData({ ...agentData, firstName: e.target.value })
                    }
                    className="block w-full border border-gray-300 focus:border-[#008751] focus:ring-[#008751] rounded-lg shadow-sm px-4 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-base font-medium text-gray-800 mb-2">
                    Other Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter other name"
                    value={agentData.otherName}
                    onChange={(e) =>
                      setAgentData({ ...agentData, otherName: e.target.value })
                    }
                    className="block w-full border border-gray-300 focus:border-[#008751] focus:ring-[#008751] rounded-lg shadow-sm px-4 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none"
                  />
                </div>
              </div>

              {/* Next button aligned right */}
              <div className="flex justify-end pt-8">
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-lg bg-[#008751] px-6 py-3 text-white text-base font-medium hover:bg-[#006f42] transition-all duration-200"
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold text-[#008751] mb-6">
                Step 2: Contact Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-base font-medium text-gray-800 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={agentData.email}
                    onChange={(e) =>
                      setAgentData({ ...agentData, email: e.target.value })
                    }
                    className="block w-full border border-gray-300 focus:border-[#008751] focus:ring-[#008751] rounded-lg shadow-sm px-4 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 08012345678"
                    value={agentData.phone}
                    onChange={(e) =>
                      setAgentData({ ...agentData, phone: e.target.value })
                    }
                    className="block w-full border border-gray-300 focus:border-[#008751] focus:ring-[#008751] rounded-lg shadow-sm px-4 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 3: Identification */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold text-[#008751] mb-6">
                Step 3: Identification
              </h2>
              <div>
                <label className="block text-base font-medium text-gray-800 mb-2">
                  NIN (11 digits)
                </label>
                <input
                  type="tel"
                  placeholder="Enter NIN"
                  value={agentData.nin}
                  onChange={(e) =>
                    setAgentData({ ...agentData, nin: e.target.value })
                  }
                  className="block w-full border border-gray-300 focus:border-[#008751] focus:ring-[#008751] rounded-lg shadow-sm px-4 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Step 4: Location */}
          {step === 4 && (
            <>
              <h2 className="text-2xl font-semibold text-[#008751] mb-6">
                Step 4: Location
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-800 mb-2">
                    State
                  </label>
                  <select
                    value={agentData.state}
                    onChange={(e) =>
                      setAgentData({ ...agentData, state: e.target.value })
                    }
                    disabled={stateLoading}
                    className="block w-full border border-gray-300 focus:border-[#008751] focus:ring-[#008751] rounded-lg shadow-sm px-4 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none"
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
                  <label className="block text-base font-medium text-gray-800 mb-2">
                    LGA
                  </label>
                  <select
                    value={agentData.lga}
                    onChange={(e) =>
                      setAgentData({ ...agentData, lga: e.target.value })
                    }
                    disabled={!cities.length || cityLoading}
                    className="block w-full border border-gray-300 focus:border-[#008751] focus:ring-[#008751] rounded-lg shadow-sm px-4 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none"
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

              <div className="mt-6">
                <label className="block text-base font-medium text-gray-800 mb-2">
                  Full Address
                </label>
                <textarea
                  value={agentData.address}
                  onChange={(e) =>
                    setAgentData({ ...agentData, address: e.target.value })
                  }
                  className="w-full min-h-[120px] border border-gray-300 focus:border-[#008751] focus:ring-[#008751] rounded-lg shadow-sm px-4 py-3 text-base transition-all duration-200 ease-in-out focus:outline-none resize-none"
                  placeholder="Street, Area, Landmark..."
                />
              </div>
            </>
          )}

          {/* Navigation */}
          {step > 1 && (
            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={prevStep}
                className="text-[#008751] hover:underline text-base"
              >
                ← Back
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={step === 2 && emailChecking}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#008751] px-6 py-3 text-white text-base font-medium hover:bg-[#006f42] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === 2 && emailChecking ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin text-white"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3 3-3h-4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                        />
                      </svg>
                      Checking...
                    </>
                  ) : (
                    "Next →"
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={formSubmitted}
                  onClick={submitForm}
                  className="rounded-lg bg-[#008751] px-6 py-3 text-white text-base font-medium hover:bg-[#006f42] transition-all duration-200"
                >
                  {formSubmitted ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
