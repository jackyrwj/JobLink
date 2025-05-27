import { NextApiRequest, NextApiResponse } from 'next';
import jobsData from '../../../data/jobs.json';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { category } = req.query;
      
      let jobs = jobsData.jobs;
      
      if (category) {
        jobs = jobs.filter(job => job.category === category);
      }

      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: '获取职位信息失败' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 