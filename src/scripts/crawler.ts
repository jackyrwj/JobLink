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
              line.startsWith('*')
            )
          ),
        url: jobUrl,
        salary: '面议',
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
      const savedJob = await prisma.job.upsert({
        where: { id: job.url },
        update: {
          title: job.title,
          location: job.location,
          jobType: job.jobType,
          description: job.description,
          requirements: job.requirements,
          department: job.department,
          tags: [job.department, job.jobType].filter(tag => tag),
          salary: job.salary,
        },
        create: {
          id: job.url,
          title: job.title,
          company: 'ByteDance',
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
      console.log('成功保存职位:', savedJob.title, savedJob.url);
    } catch (error) {
      console.error('保存职位数据时出错:', error);
      console.error('职位数据:', job);
    }
  }
}

async function crawlAllJobs() {
  console.log('开始抓取字节跳动后端和前端职位数据...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  
  try {
    const page = await browser.newPage();
    
    // 定义要抓取的类别
    const categories = [
      { name: '后端', id: '6704215862557018372' },
      { name: '前端', id: '6704215886108035339' }
    ];

    for (const categoryInfo of categories) {
      console.log(`开始抓取${categoryInfo.name}职位数据...`);
      let pageNum = 1;
      let hasMore = true;

      while (hasMore && pageNum <= 2) { // 限制只爬取前 2 页
        const jobs = await fetchJobs(page, pageNum, categoryInfo.id);
        if (jobs.length === 0) {
          console.log(`没有更多${categoryInfo.name}职位数据，结束抓取`);
          hasMore = false;
        } else {
          await saveJobs(jobs);
          pageNum++;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
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