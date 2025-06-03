import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import * as puppeteer from 'puppeteer';
import type { Page } from 'puppeteer';

const prisma = new PrismaClient();

interface JobData {
  title: string;
  department: string;
  location: string;
  jobType: string;
  description: string;
  requirements: string[];
  url: string;
  salary: string;
}

async function fetchJobs(page: Page, pageNum: number = 1, category: string = ''): Promise<JobData[]> {
  console.log(`正在抓取第 ${pageNum} 页数据，类别: ${category}...`);
  try {
    const url = `https://jobs.bytedance.com/experienced/position?keywords=&category=${category}&location=&project=&type=&job_hot_flag=&current=${pageNum}&limit=10&functionCategory=&tag=`;
    console.log(`导航到页面: ${url}`);
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    console.log('页面导航完成，等待职位列表元素...');
    await page.waitForSelector('a[href*="/experienced/position/"][data-id]', { timeout: 60000 });
    console.log('职位列表元素出现。');
    
    console.log('等待 3 秒确保页面完全渲染...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('等待结束。');

    const content = await page.content();
    const $ = cheerio.load(content);
    const jobs: JobData[] = [];

    // 解析职位列表，遍历包裹职位信息的 a 标签
    $('a[href*="/experienced/position/"][data-id]').each((_, element) => {
      const $element = $(element);
      const relativeUrl = $element.attr('href') || '';
      const jobUrl = `https://jobs.bytedance.com${relativeUrl}`;
      
      // 在 a 标签内部寻找嵌套的 div 来提取职位详情
      const $jobDetails = $element.find('.positionItem__1giWi.positionItem');
      
      const job: JobData = {
        title: $jobDetails.find('.positionItem-title-text').text().trim(),
        department: $jobDetails.find('.infoText-category__25NLe .content__3ZUKJ').text().trim(),
        location: $jobDetails.find('.subTitle__3sRa3 span').first().text().trim(),
        jobType: $jobDetails.find('.infoText__aS5hY').first().text().trim(),
        description: $jobDetails.find('.jobDesc__3ZDgU').text().trim(),
        requirements: $jobDetails
          .find('.jobDesc__3ZDgU')
          .text()
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => 
            line && (
              line.startsWith('1、') ||
              line.startsWith('2、') ||
              line.startsWith('3、') ||
              line.startsWith('4、') ||
              line.startsWith('5、') ||
              line.startsWith('-') ||
              line.startsWith('•') ||
              line.startsWith('*') ||
              line.startsWith('【') ||
              line.startsWith('【') ||
              line.startsWith('（') ||
              line.startsWith('(')
            )
          ),
        url: jobUrl,
        salary: $jobDetails.find('.salary__3ZUKJ').text().trim() || '面议',
      };
      console.log('解析到的职位数据:', job);
      jobs.push(job);
    });

    console.log(`第 ${pageNum} 页共找到 ${jobs.length} 个职位`);
    return jobs;
  } catch (error) {
    console.error(`抓取第 ${pageNum} 页数据时出错:`, error);
    return [];
  }
}

async function saveJobs(jobs: JobData[]) {
  console.log(`准备保存 ${jobs.length} 个职位数据...`);
  for (const job of jobs) {
    try {
      // 从职位 URL 中提取数字 ID
      const urlMatch = job.url.match(/\/position\/(\d+)\/detail/);
      const jobUrlId = urlMatch ? urlMatch[1] : null; // 提取数字部分，如果匹配不到则为null

      // 如果成功提取到 jobUrlId，则保存到数据库
      if (jobUrlId) {
        const savedJob = await prisma.job.upsert({
          where: { id: job.url }, // 仍然使用完整URL作为查找条件（因为旧数据id是url）
          update: {
            jobUrlId: jobUrlId, // 保存提取到的数字ID
            title: job.title,
            location: job.location,
            jobType: job.jobType,
            description: job.description,
            requirements: job.requirements,
            department: job.department,
            tags: [job.department, job.jobType].filter(tag => tag),
            salary: job.salary,
            url: job.url, // 确保url字段也更新
          },
          create: {
            id: job.url, // 新数据的id仍然是完整URL
            jobUrlId: jobUrlId, // 保存提取到的数字ID
            title: job.title,
            company: '字节跳动',
            companyLogo: '/images/bytedance.svg',
            location: job.location,
            salary: job.salary,
            tags: [job.department, job.jobType].filter(tag => tag),
            url: job.url,
            department: job.department,
            jobType: job.jobType,
            description: job.description,
            requirements: job.requirements,
          },
        });
        console.log('成功保存职位:', savedJob.title, savedJob.url, ', jobUrlId:', savedJob.jobUrlId);
      } else {
        console.warn('未从URL中提取到jobUrlId，跳过保存:', job.url);
      }
    } catch (error) {
      console.error('保存职位数据时出错:', error);
      console.error('职位数据:', job);
    }
  }
}

async function crawlAllJobs() {
  console.log('开始抓取字节跳动所有职位数据...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  
  try {
    const page = await browser.newPage();
    
    // 定义要抓取的类别
    const categories = [
      { name: '后端', id: '6704215862557018372' },
      { name: '前端', id: '6704215886108035339' },
      { name: '大数据', id: '6704215888985327886' },
      { name: '测试', id: '6704215897130666254' },
      { name: '算法', id: '6704215956018694411' },
      { name: '客户端', id: '6704215957146962184' },
      { name: '基础架构', id: '6704215958816295181' },
      { name: '多媒体', id: '6704215963966900491' },
      { name: '安全', id: '6704216109274368264' },
      { name: '计算机视觉', id: '6704216296701036811' },
      { name: '数据挖掘', id: '6704216635923761412' },
      { name: '运维', id: '6704217321877014787' },
      { name: '自然语言处理', id: '6704219452277262596' },
      { name: '机器学习', id: '6704219534724696331' },
      { name: '硬件', id: '6938376045242353957' }
    ];

    for (const categoryInfo of categories) {
      console.log(`\n开始抓取${categoryInfo.name}职位数据...`);
      let pageNum = 1;
      let hasMore = true;
      let emptyPageCount = 0; // 用于记录连续空页面的数量

      while (hasMore && pageNum <= 10) { // 增加到10页
        const jobs = await fetchJobs(page, pageNum, categoryInfo.id);
        if (jobs.length === 0) {
          emptyPageCount++;
          if (emptyPageCount >= 2) { // 如果连续两页都没有数据，认为已经到底了
            console.log(`连续${emptyPageCount}页没有${categoryInfo.name}职位数据，结束抓取`);
            hasMore = false;
          } else {
            console.log(`第${pageNum}页没有数据，继续尝试下一页...`);
            pageNum++;
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } else {
          emptyPageCount = 0; // 重置空页面计数
          await saveJobs(jobs);
          pageNum++;
          // 增加页面间的等待时间，避免请求过于频繁
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
      console.log(`完成${categoryInfo.name}职位数据抓取，共抓取${pageNum - 1}页`);
      // 在切换类别时增加等待时间
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  } finally {
    await browser.close();
  }
}

// 运行爬虫
crawlAllJobs()
  .then(() => {
    console.log('爬虫任务完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('爬虫任务失败:', error);
    process.exit(1);
  }); 