import { NextResponse } from 'next/server';
import { createUser, getUserByNin } from '@/lib/user-service';
import { generateAuthToken } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    const { nin, firstName, lastName, dob, gender, verified, verificationDate } = await req.json();

    // Check if user already exists
    const existingUser = await getUserByNin(nin);
    if (existingUser) {
      // Update existing user
      const updatedUser = await updateUserVerification(
        existingUser.id, 
        verified, 
        verificationDate
      );
      
      const token = generateAuthToken(updatedUser);
      
      return NextResponse.json({
        token,
        user: updatedUser
      });
    }

    // Create new user
    const newUser = await createUser({
      nin,
      firstName,
      lastName,
      dob,
      gender,
      verified,
      verificationDate
    });

    // Add 'name' property to match expected User type
    const userWithName = {
      ...newUser,
      name: `${firstName} ${lastName}`
    };

    const token = generateAuthToken(userWithName);

    return NextResponse.json({
      token,
      user: userWithName
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

// Mock database functions
// Remove local implementations to avoid conflicts with imports.

async function updateUserVerification(userId: string, verified: boolean, verificationDate: string) {
  // Replace with actual database update
  // For demonstration, add a mock name property
  return {
    id: userId,
    name: 'Updated User', // Replace with actual name if available
    verified,
    verificationDate
  };
}