'use client';

import { useEffect, useState, useCallback } from 'react';
import { notifySuccess, notifyError } from '@/app/components/store/notification';

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
  surname: '',
  firstName: '',
  otherName: '',
  email: '',
  phone: '',
  nin: '',
  state: '',
  lga: '',
  address: '',
};

const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input {...props} className="input" />
  </div>
);

const Select = ({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) => (
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
  const [previousState, setPreviousState] = useState('');
  const lgaCache = new Map<string, string[]>();

  const validateEmail = (email: string): boolean => {
    const trimmed = email.trim();
    if (!trimmed || /\s/.test(trimmed) || !/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
      notifyError('Enter a valid email address.');
      return false;
    }
    return true;
  };

  const checkEmail = async (): Promise<boolean> => {
    try {
      const res = await fetch(`/api/checkemail?email=${encodeURIComponent(agentData.email)}`);
      const result = await res.json();
      if (result.disposable) {
        notifyError('Disposable email detected.');
        return false;
      }
      return true;
    } catch {
      notifyError('Failed to verify email.');
      return false;
    }
  };

  const validateStep = async (): Promise<boolean> => {
    const { surname, firstName, otherName, email, phone, nin, state, lga, address } = agentData;
    const onlyLetters = /^[A-Za-z]+$/;
    const phonePattern = /^\d{10,15}$/;
    const ninPattern = /^\d{11}$/;

    switch (step) {
      case 1:
        if (!surname.trim() || !onlyLetters.test(surname)) return notifyError('Valid surname required.'), false;
        if (!firstName.trim() || !onlyLetters.test(firstName)) return notifyError('Valid first name required.'), false;
        if (otherName && !onlyLetters.test(otherName.trim())) return notifyError('Other name must contain only letters.'), false;
        break;
      case 2:
        if (!validateEmail(email)) return false;
        if (!phonePattern.test(phone)) return notifyError('Invalid phone number.'), false;
        return await checkEmail();
      case 3:
        if (!ninPattern.test(nin)) return notifyError('NIN must be 11 digits.'), false;
        break;
      case 4:
        if (!state) return notifyError('Select a state.'), false;
        if (!lga) return notifyError('Select an LGA.'), false;
        if (address.length < 10) return notifyError('Address too short.'), false;
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
      const res = await fetch('/agent/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      });

      const result = await res.json();
      if (!res.ok) {
        notifyError(result?.message || 'Submission failed.');
        return;
      }

      notifySuccess('Agent onboarded successfully!');
      setAgentData({ ...initialData });
      setStep(1);
    } catch {
      notifyError('Failed to submit.');
    } finally {
      setFormSubmitted(false);
    }
  };

  const fetchStates = async () => {
    setStateLoading(true);
    try {
      const cached = sessionStorage.getItem('cachedStates');
      if (cached) {
        setStates(JSON.parse(cached));
      } else {
        const res = await fetch('https://apinigeria.vercel.app/api/v1/states');
        const data = await res.json();
        setStates(data.states);
        sessionStorage.setItem('cachedStates', JSON.stringify(data.states));
      }
    } catch {
      setStates([]);
    } finally {
      setStateLoading(false);
    }
  };

  const fetchCities = useCallback(async (state: string) => {
    if (lgaCache.has(state)) {
      setCities(lgaCache.get(state) ?? []);
      return;
    }

    setCityLoading(true);
    try {
      const res = await fetch(`https://apinigeria.vercel.app/api/v1/lga?state=${encodeURIComponent(state)}`);
      const data = await res.json();
      setCities(data.lgas);
      lgaCache.set(state, data.lgas);
    } catch {
      setCities([]);
    } finally {
      setCityLoading(false);
    }
  }, [lgaCache]);

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
      <div className="mx-auto max-w-3xl px-4 py-10">
   
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#008751]">Agent Onboarding</h1>
          <p className="text-gray-600 text-sm">Complete all steps to register an agent.</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="bg-white p-6 shadow rounded-2xl space-y-6">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-[#008751] mb-4">Step 1: Personal Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Surname" value={agentData.surname} onChange={(e) => setAgentData({ ...agentData, surname: e.target.value })} />
                <Input label="First Name" value={agentData.firstName} onChange={(e) => setAgentData({ ...agentData, firstName: e.target.value })} />
                <Input label="Other Name (Optional)" className="sm:col-span-2" value={agentData.otherName} onChange={(e) => setAgentData({ ...agentData, otherName: e.target.value })} />
              </div>
            </>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold text-[#008751] mb-4">Step 2: Contact Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Email Address" type="email" value={agentData.email} onChange={(e) => setAgentData({ ...agentData, email: e.target.value })} />
                <Input label="Phone Number" type="tel" placeholder="e.g. 08012345678" value={agentData.phone} onChange={(e) => setAgentData({ ...agentData, phone: e.target.value })} />
              </div>
            </>
          )}

          {/* Step 3: Identification */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold text-[#008751] mb-4">Step 3: Identification</h2>
              <Input label="NIN (11 digits)" type="tel" value={agentData.nin} onChange={(e) => setAgentData({ ...agentData, nin: e.target.value })} />
            </>
          )}

          {/* Step 4: Location */}
          {step === 4 && (
            <>
              <h2 className="text-xl font-semibold text-[#008751] mb-4">Step 4: Location</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="State" value={agentData.state} onChange={(e) => setAgentData({ ...agentData, state: e.target.value })} disabled={stateLoading}>
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>

                <Select label="LGA" value={agentData.lga} onChange={(e) => setAgentData({ ...agentData, lga: e.target.value })} disabled={!cities.length || cityLoading}>
                  <option value="">Select LGA</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">Full Address</label>
                <textarea
                  value={agentData.address}
                  onChange={(e) => setAgentData({ ...agentData, address: e.target.value })}
                  className="input w-full min-h-[100px] mt-1"
                  placeholder="Street, Area, Landmark..."
                />
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="text-[#008751] hover:underline">
                ← Back
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded bg-[#008751] px-6 py-2 text-white hover:bg-[#006f42]"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={formSubmitted}
                onClick={submitForm}
                className="rounded bg-[#008751] px-6 py-2 text-white hover:bg-[#006f42]"
              >
                {formSubmitted ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
