import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function populateJobUrlIds() {
  console.log('开始填充 jobUrlId 字段...');
  
  try {
    // 1. 查询所有现有 Job 记录
    const jobsToUpdate = await prisma.job.findMany({
        where: {
            // 只处理 jobUrlId 为 null 的记录，避免重复处理
            jobUrlId: null
        }
    });

    console.log(`找到 ${jobsToUpdate.length} 条需要更新的记录.`);

    if (jobsToUpdate.length === 0) {
        console.log('没有需要填充 jobUrlId 的记录，脚本结束。');
        await prisma.$disconnect();
        return;
    }

    let updatedCount = 0;

    // 2. 遍历记录并更新 jobUrlId
    for (const job of jobsToUpdate) {
      // 从 url 字段中提取数字 ID
      const urlMatch = job.url.match(/\/position\/(\d+)\/detail/);
      const jobUrlId = urlMatch ? urlMatch[1] : null; // 提取数字部分

      if (jobUrlId) {
        // 3. 更新记录的 jobUrlId 字段
        await prisma.job.update({
          where: { id: job.id }, // 使用完整的 URL 作为查找条件
          data: {
            jobUrlId: jobUrlId,
          },
        });
        updatedCount++;
        console.log(`更新记录 ${job.id} 的 jobUrlId 为 ${jobUrlId}`);
      } else {
        console.warn(`无法从 URL ${job.url} 提取 jobUrlId`);
      }
    }

    console.log(`成功填充了 ${updatedCount} 条记录的 jobUrlId 字段.`);

  } catch (error) {
    console.error('填充 jobUrlId 失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行脚本
populateJobUrlIds(); 