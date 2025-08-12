"use client";
  import { useCallback } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AddressUpdateModalProps {
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  onClose: () => void;
}

export default function AddressUpdateModal({
  address = "",
  country = "Nigeria",
  state = "",
  city = "",
  onClose,
}: AddressUpdateModalProps) {
  const [formData, setFormData] = useState({
    address,
    country,
    state,
    city,
  });
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [stateLoading, setStateLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const stateCacheKey = "cachedStates";
  const lgaCache = new Map<string, string[]>();

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile/update-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        localStorage.setItem("wasUpdated", "true");
        alert("Address updated successfully.");
        router.refresh();
        onClose();
      } else if (res.status === 400) {
        alert("Please fill in all required fields.");
      } else if (res.status === 422) {
        alert("Invalid address format. Please check your input.");
      } else {
        alert("Failed to update address.");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address.");
    } finally {
      setLoading(false);
    }
  };

  const loadStates = async () => {
    setStateLoading(true);
    try {
      const cached = sessionStorage.getItem(stateCacheKey);
      if (cached) {
        setStates(JSON.parse(cached));
      } else {
        const res = await fetch("https://apinigeria.vercel.app/api/v1/states");
        if (!res.ok) throw new Error(`Status: ${res.status}`);

        const data = await res.json();
        const states = data.states;
        setStates(states);
        sessionStorage.setItem(stateCacheKey, JSON.stringify(states));
      }

      if (formData.state) {
        fetchCities(formData.state);
      }
    } catch (e) {
      console.error("Failed to load states", e);
      setStates([]);
      alert("Could not load state options.");
    } finally {
      setStateLoading(false);
    }
  };



  const fetchCities = useCallback(
    async (state: string) => {
      setCityLoading(true);
      try {
        if (lgaCache.has(state)) {
          setCities(lgaCache.get(state) || []);
          return;
        }

        const res = await fetch(
          `https://apinigeria.vercel.app/api/v1/lga?state=${encodeURIComponent(
            state
          )}`
        );
        if (!res.ok) throw new Error(`Status: ${res.status}`);

        const data = await res.json();
        const cities = data.lgas;
        setCities(cities);
        lgaCache.set(state, cities);
      } catch (e) {
        console.error("Failed to fetch cities", e);
        setCities([]);
        alert(`Could not load LGAs for ${state}.`);
      } finally {
        setCityLoading(false);
      }
    },
    [lgaCache]
  );
  useEffect(() => {
    if (formData.state) {
      fetchCities(formData.state);
    }
  }, [formData.state, fetchCities]);
  useEffect(() => {
    if (formData.state) {
      fetchCities(formData.state);
    }
  }, [formData.state, fetchCities]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Edit Address</h2>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium">
              Country
            </label>
            <input
              id="country"
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="w-full rounded border bg-gray-100 px-3 py-2"
              disabled
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium">
              State
            </label>
            <select
              id="state"
              className="w-full rounded border px-3 py-2"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              disabled={stateLoading}
            >
              <option value="" disabled>
                Select state
              </option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium">
              City / Local Govt Area
            </label>
            <select
              id="city"
              className="w-full rounded border px-3 py-2"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              disabled={cityLoading || !cities.length}
            >
              <option value="" disabled>
                Select city/LGA
              </option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium">
              Address
            </label>
            <textarea
              id="address"
              rows={2}
              className="w-full rounded border px-3 py-2"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="rounded border px-4 py-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
