import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { code } = req.query as { code: string };
    
    try {
      // Connect to the database
      await prisma.$connect();
      
      // Find the URL by code
      const data = await prisma.urlSchema.findUnique({
        where: { code },
      });
      
      if (data) {
        // Check if the URL has expired
        if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
          res.writeHead(302, { Location: '/expired' });
          res.end();
        } else {
          // Increment the click count
          await prisma.urlSchema.update({
            where: { code },
            data: { clicked: data.clicked + 1 },
          });

          // Redirect to the URL
          res.writeHead(302, { Location: data.url });
          res.end();
        }
      } else {
        res.writeHead(302, { Location: '/404' });
        res.end();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      // Disconnect from the database
      await prisma.$disconnect();
    }
  } else {
    res.status(400).json({ message: 'Bad request' });
  }
}
