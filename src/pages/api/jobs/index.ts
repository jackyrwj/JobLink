import { NextApiRequest, NextApiResponse } from 'next';
// 移除导入本地 JSON 文件
// import jobsData from '../../../data/jobs.json';

import { PrismaClient } from '@prisma/client'; // 导入 PrismaClient

const prisma = new PrismaClient(); // 初始化 PrismaClient

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // 从查询参数中获取 department
      const { department } = req.query;
      
      let jobs;

      if (department && typeof department === 'string') {
        // 使用 Prisma 根据 department 字段查询
        jobs = await prisma.job.findMany({
          where: {
            department: department,
          },
        });
      } else {
        // 如果没有 department 参数，获取所有职位（或者根据需求修改）
        jobs = await prisma.job.findMany();
      }

      res.status(200).json(jobs);
    } catch (error) {
      console.error('获取职位信息失败:', error);
      res.status(500).json({ error: '获取职位信息失败' });
    } finally {
      // 关闭 Prisma 连接
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 