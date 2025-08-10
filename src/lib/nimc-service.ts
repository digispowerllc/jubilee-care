interface NimcVerificationResult {
  verified: boolean;
  reason?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
}

export const verifyNinWithNimc = async (data: {
  nin: string;
  firstName: string;
  lastName: string;
  dob: string;
  verificationType: string;
}): Promise<NimcVerificationResult> => {
  // Implement actual NIMC API integration here
  // This is a mock implementation:
  
  if (data.nin === '00000000000') {
    return {
      verified: false,
      reason: 'Test NIN always fails'
    };
  }

  return {
    verified: true,
    firstName: data.firstName,
    lastName: data.lastName,
    dob: data.dob,
    gender: 'Male' // Mock value
  };
};