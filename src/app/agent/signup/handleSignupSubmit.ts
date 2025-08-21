import toast from "react-hot-toast";

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

export const submitAgentSignup = async (
  agentData: AgentData,
  password: string
) => {
  try {
    const response = await fetch("/agent/signup/check", {
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
      toast.error(errorData.error || "Invalid request");
      return false;
    }

    // Validate response content type
    if (response.status === 409) {
      const errorData = await response.json();
      toast.error(
        errorData.error || "e-Mail address, phone, or NIN already registered"
      );
      return false;
    }

    if (response.status === 500) {
      const errorData = await response.json();
      toast.error(errorData.error || "Internal server error");
      return false;
    }

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(await response.text());
    }

    toast.success("Account created successfully!");
    return true;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Registration failed");
    return false;
  }
};

export const checkEmailAvailability = async (email: string) => {
  try {
    const res = await fetch(
      `/api/check-email?email=${encodeURIComponent(email)}`
    );

    if (!res.ok) {
      const errorData = await res.json();
      toast.error(errorData.error || "Failed to verify email");
      return false;
    }

    const result = await res.json();
    if (result.disposable) {
      toast.error("This email address cannot be used");
      return false;
    }

    return true;
  } catch (error) {
    toast.error("Unable to verify email. Please try again");
    console.error("Failed to verify email:", error);
    return false;
  }
};
