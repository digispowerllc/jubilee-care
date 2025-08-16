export interface UnprotectedData {
    firstName: string;
    surname: string;
    otherName: string | null;
    email: string;
    phone: string;
    nin: string;
    state: string;
    lga: string;
    address: string;
    emailVerified: boolean;
    memberSince?: Date;
    avatarUrl?: string;
    clients?: Array<{
        id: string;
        name: string;
        joinedDate: Date;
        status: "active" | "inactive";
    }>;
    transactions?: Array<{
        id: string;
        amount: number;
        date: Date;
        type: "deposit" | "withdrawal" | "transfer";
    }>;
}