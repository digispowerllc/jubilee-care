// File: src\app\contact\handleContactSubmit.ts
import toast from "react-hot-toast";

export interface ContactFormValues {
    name: string;
    email: string;
    message: string;
}
export async function handleContactSubmit(
    { name, email, message }: ContactFormValues,
    setName: (v: string) => void,
    setEmail: (v: string) => void,
    setMessage: (v: string) => void,
    setErrors: (v: string[]) => void,
    setLoading: (v: boolean) => void
) {
    if (!name) {
        toast.error("Your name is required.");
        return;
    }
    if (!email) {
        toast.error("Your email is required.");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error("Please enter a valid email address.");
        return;
    }
    if (!message) {
        toast.error("Your message is required.");
        return;
    }
    if (message.length < 10) {
        toast.error("Your message must be at least 10 characters long.");
        return;
    }
    if (message.length > 100) {
        toast.error("Your message cannot exceed 100 characters.");
        return;
    }

    setLoading(true);

    try {
        const res = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);

        if (!res.ok) {
            try {
                const errorData = await res.json();
                toast.error(errorData.error || "Failed to verify email.");
            } catch {
                toast.error("Failed to verify email. Invalid server response.");
            }
            return;
        }

        const result = await res.json();

        if (result.disposable) {
            toast.error("Invalid email address provided.");
            return;
        }

        const phoneNumber = "+2347039792389";
        const text = `Hello, my name is ${name}.\nEmail: ${email}\n\n${message}`;
        const encoded = encodeURIComponent(text);
        const url = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encoded}`;

        window.open(url, "_blank");
        setName("");
        setEmail("");
        setMessage("");
        setErrors([]);
        toast.success("Redirecting to WhatsApp...");
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error("Something went wrong. Try again.");
        }
    } finally {
        setLoading(false);
    }
}
