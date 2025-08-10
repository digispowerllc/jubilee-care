interface User {
  id: string;
  nin: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  verified: boolean;
  verificationDate?: string;
  registrationDate: string;
  updatedAt: string;
}

// Mock database - replace with real DB in production
const users: User[] = [];

/**
 * Creates a new user in the database
 */
export const createUser = async (userData: Omit<User, 'id' | 'registrationDate' | 'updatedAt'>): Promise<User> => {
  const newUser: User = {
    id: `user_${Math.random().toString(36).substring(2, 9)}`,
    ...userData,
    registrationDate: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);
  return newUser;
};

/**
 * Finds a user by their NIN
 */
export const getUserByNin = async (nin: string): Promise<User | null> => {
  return users.find(user => user.nin === nin) || null;
};

/**
 * Updates user verification status
 */
export const updateUserVerification = async (
  userId: string,
  verified: boolean,
  verificationDate: string
): Promise<User> => {
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const updatedUser = {
    ...users[userIndex],
    verified,
    verificationDate,
    updatedAt: new Date().toISOString()
  };

  users[userIndex] = updatedUser;
  return updatedUser;
};

/**
 * Additional useful user service functions
 */

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  return users.find(user => user.id === userId) || null;
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updateData: Partial<User>
): Promise<User> => {
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const updatedUser = {
    ...users[userIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  users[userIndex] = updatedUser;
  return updatedUser;
};

// List all users (paginated)
export const listUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<{ users: User[]; total: number }> => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    users: users.slice(start, end),
    total: users.length
  };
};





// import { PrismaClient, User } from '@prisma/client';

// const prisma = new PrismaClient();

// export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
//   return await prisma.user.create({
//     data: {
//       ...userData,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     }
//   });
// };

// export const getUserByNin = async (nin: string): Promise<User | null> => {
//   return await prisma.user.findUnique({
//     where: { nin }
//   });
// };

// export const updateUserVerification = async (
//   userId: string,
//   verified: boolean,
//   verificationDate: string
// ): Promise<User> => {
//   return await prisma.user.update({
//     where: { id: userId },
//     data: {
//       verified,
//       verificationDate,
//       updatedAt: new Date()
//     }
//   });
// };
