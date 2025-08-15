import { notifySuccess, notifyError } from "@/components/global/Notification";

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

export const submitAgentSignup = async (agentData: AgentData, password: string) => {
    try {
        const response = await fetch("/api/agent/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...agentData,
                password,
                encryptionVersion: "v2",
            }),
        });

        if (response.status === 400) {
            const errorData = await response.json();
            notifyError(errorData.error || "Invalid request");
            return false;
        }

        // Validate response content type
        if (response.status === 409) {
            const errorData = await response.json();
            notifyError(errorData.error || "e-Mail address, phone, or NIN already registered");
            return false;
        }

        if (response.status === 500) {
            const errorData = await response.json();
            notifyError(errorData.error || "Internal server error");
            return false;
        }

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(await response.text());
        }



        notifySuccess("Account created successfully!");
        return true;
    } catch (error) {
        notifyError(
            error instanceof Error ? error.message : "Registration failed"
        );
        return false;
    }
};

export const checkEmailAvailability = async (email: string) => {
    try {
        const res = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);

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
    }
};