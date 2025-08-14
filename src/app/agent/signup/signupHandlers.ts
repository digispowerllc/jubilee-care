import { notifyError } from "@/components/Notification";

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

export const storage = {
    // Basic version without encryption
    saveTempData: (data: AgentData, step: number) => {
        const sessionData = {
            data: {
                ...data,
                // Flag sensitive fields
                email: "",
                phone: "",
                nin: ""
            },
            step,
            password: ""
        };
        localStorage.setItem("agent_enrollment", JSON.stringify(sessionData));
    },

    getTempData: () => {
        const saved = localStorage.getItem("agent_enrollment");
        return saved ? JSON.parse(saved) : null;
    },

    clearTempData: () => {
        localStorage.removeItem("agent_enrollment");
    }
};

export const validateEmail = (email: string): boolean => {
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

export const validateStep = async (
    step: number,
    agentData: AgentData,
    password: string,
    checkEmail: () => Promise<boolean>
): Promise<boolean> => {
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
            if (
                agentData.otherName.trim() &&
                !/^[A-Za-z]+$/.test(agentData.otherName.trim())
            ) {
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
            // Check password requirements
            const isPasswordValid = (
                password.length >= 8 &&
                /\d/.test(password) &&
                /[!@#$%^&*(),.?":{}|<>]/.test(password)
            );

            if (!isPasswordValid) {
                notifyError("Please meet all password requirements");
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
};

export const fetchStates = async (): Promise<string[]> => {
    try {
        const cached = sessionStorage.getItem("cachedStates");
        if (cached) {
            return JSON.parse(cached);
        }

        const res = await fetch("https://apinigeria.vercel.app/api/v1/states");
        const data = await res.json();
        sessionStorage.setItem("cachedStates", JSON.stringify(data.states));
        return data.states;
    } catch (error) {
        notifyError("Failed to load states");
        throw error;
    }
};

export const fetchCities = async (
    state: string,
    lgaCache: Map<string, string[]>
): Promise<string[]> => {
    if (!state) return [];

    if (lgaCache.has(state)) {
        return lgaCache.get(state) ?? [];
    }

    try {
        const res = await fetch(
            `https://apinigeria.vercel.app/api/v1/lga?state=${encodeURIComponent(state)}`
        );
        const data = await res.json();
        lgaCache.set(state, data.lgas);
        return data.lgas;
    } catch (error) {
        notifyError("Failed to load LGAs");
        throw error;
    }
};