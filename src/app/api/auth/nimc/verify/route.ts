import { NextResponse } from 'next/server';
// import { verifyNinWithNimc } from '@/lib/nimc-service';
import { validateApiKey } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    // Validate API key
    const apiKey = req.headers.get('Authorization')?.split(' ')[1];
    if (!validateApiKey(apiKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { nin, firstName, lastName, dob, verificationType } = await req.json();

    // Validate input
    if (!nin || !/^\d{11}$/.test(nin)) {
      return NextResponse.json(
        { error: 'Invalid NIN format' },
        { status: 400 }
      );
    }

    // Verify with NIMC service (mock or real implementation)
    const verificationResult = await verifyNinWithNimc({
      nin,
      firstName,
      lastName,
      dob,
      verificationType
    });

    if (!verificationResult.verified) {
      return NextResponse.json(
        { 
          status: 'rejected',
          reason: verificationResult.reason || 'Details did not match'
        },
        { status: 200 }
      );
    }

    if (
      verificationResult.verified &&
      'firstName' in verificationResult &&
      'lastName' in verificationResult &&
      'dob' in verificationResult &&
      'gender' in verificationResult
    ) {
      return NextResponse.json({
        status: 'verified',
        userData: {
          firstName: verificationResult.firstName,
          lastName: verificationResult.lastName,
          dob: verificationResult.dob,
          gender: verificationResult.gender
        },
        verificationDate: new Date().toISOString()
      });
    }
    // Fallback in case of unexpected result shape
    return NextResponse.json(
      { error: 'Verification result missing user data' },
      { status: 500 }
    );

  } catch (error) {
    console.error('NIMC verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock service (replace with actual NIMC API call)
interface NinVerificationData {
  nin: string;
  firstName: string;
  lastName: string;
  dob: string;
  verificationType?: string;
}

async function verifyNinWithNimc(data: NinVerificationData) {
  // In a real implementation, this would call the actual NIMC API
  // This is a mock implementation for development
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock verification logic
  const mockDatabase = [
    {
      nin: '12345678901',
      firstName: 'John',
      lastName: 'Doe',
      dob: '1990-01-01',
      gender: 'Male'
    }
  ];

  const record = mockDatabase.find(r => r.nin === data.nin);
  
  if (!record) {
    return { verified: false, reason: 'NIN not found' };
  }

  if (
    record.firstName.toLowerCase() !== data.firstName.toLowerCase() ||
    record.lastName.toLowerCase() !== data.lastName.toLowerCase() ||
    record.dob !== data.dob
  ) {
    return { verified: false, reason: 'Identity mismatch' };
  }

  return {
    verified: true,
    ...record
  };
}