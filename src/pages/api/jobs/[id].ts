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
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: '缺少职位ID或ID格式不正确' });
      }

      // 使用 Prisma 根据 jobUrlId 字段查询职位详情
      const job = await prisma.job.findUnique({
        where: {
          jobUrlId: id, // 现在根据 jobUrlId 查询
        },
      });

      if (!job) {
        console.warn('未找到匹配的职位 (通过 jobUrlId 查询):', id);
        return res.status(404).json({ error: '职位不存在' });
      }

      res.status(200).json(job);
    } catch (error) {
      console.error('获取职位详情失败:', error);
      res.status(500).json({ error: '获取职位详情失败' });
    } finally {
      // 关闭 Prisma 连接
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 