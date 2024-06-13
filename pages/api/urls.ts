import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import shortid from 'shortid';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await prisma.$connect();
      const urls = await prisma.urlSchema.findMany();
      res.status(200).json(urls);
    } catch (error) {
      console.error('Error fetching URLs:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'POST') {
    const { url } = req.body;
    const code = shortid.generate();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    try {
      await prisma.$connect();
      const newUrl = await prisma.urlSchema.create({
        data: {
          code,
          url,
          expiresAt,
        },
      });
      res.status(201).json(newUrl);
    } catch (error) {
      console.error('Error creating URL:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}