import { NextApiRequest, NextApiResponse } from 'next';
import jobsData from '../../../data/jobs.json';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      
      const job = jobsData.jobs.find(job => job.id === id);

      if (!job) {
        return res.status(404).json({ error: '职位不存在' });
      }

      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ error: '获取职位信息失败' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 