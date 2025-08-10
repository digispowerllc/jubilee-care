export const validateApiKey = (apiKey: string | undefined): boolean => {
    // In production, validate against your stored API keys
    return apiKey === process.env.NIMC_API_KEY;
};

export interface User {
    id: string;
    name: string
}

export const generateAuthToken = (user: User): string => {
    // In production, use a proper JWT or session token
    return 'mock_token_' + Math.random().toString(36).substring(2);
};