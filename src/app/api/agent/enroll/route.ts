import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`[${new Date().toISOString()}] Incoming ${req.method} request to /api/your-endpoint`);

  if (req.method === 'POST') {
    console.log("Request body:", req.body);

    try {
      const user = await prisma.user.create({
        data: {
          surname: req.body.surname,
          firstName: req.body.firstName,
          lastName: req.body.lastName || null,
          email: req.body.email,
          phone: req.body.phone,
          nin: req.body.nin,
          state: req.body.state,
          lga: req.body.lga,
          address: req.body.address,
        },
      });

      console.log("User created successfully:", user);

      res.status(201).json({ success: true, user });
    } catch (error: unknown) {
      console.error("Error creating user:", error);

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  } else {
    console.warn(`Method ${req.method} not allowed`);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
