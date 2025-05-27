import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import PageTransition from '../../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  category: string;
  sourceUrl: string;
  source: string;
}

export default function JobSelection() {
  const router = useRouter();
  const { category } = router.query;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [illustrationSrc, setIllustrationSrc] = useState(''); // 用于存储随机选择的插画路径

  const illustrations = [
    '/images/maxtocat.gif',
    '/images/NUX_Octodex.gif',
  ];

  useEffect(() => {
    // 在组件挂载时随机选择一个插画
    const randomIndex = Math.floor(Math.random() * illustrations.length);
    setIllustrationSrc(illustrations[randomIndex]);
  }, []); // 空数组表示只在组件挂载时运行一次

  useEffect(() => {
    if (category) {
      fetchJobs();
    }
  }, [category]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`/api/jobs?category=${category}`);
      setJobs(response.data);
    } catch (error) {
      console.error('获取职位失败:', error);
      setJobs([]); // 出错时清空职位列表
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelect = async (jobId: string) => {
    setSelectedJob(jobId);
    setIsAnimating(true);
    
    setTimeout(() => {
      router.push(`/jobs/${jobId}`);
    }, 300);
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
          <div className="text-center">加载中...</div>
        </div>
      </PageTransition>
    );
  }

  if (jobs.length === 0) {
     return (
      <PageTransition>
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">未找到 {category} 类别的职位信息</h2>
             <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
              返回首页
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 flex items-center justify-center">
        {/* 主要内容部分 - 两栏布局 */}
        <div className="relative py-3 px-4 sm:px-6 lg:px-8 z-10 flex items-center justify-center">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             {/* 左侧职位列表 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                 <div className="mb-8">
                    <Link href="/" className="text-blue-500 hover:underline flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      返回首页
                    </Link>
                  </div>
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                  选择具体职位
                </h2>
                <div className="space-y-4 relative z-10">
                    <AnimatePresence>
                      {jobs.map((job) => (
                        <motion.button
                          key={job.id}
                          onClick={() => handleJobSelect(job.id)}
                          className={`w-full p-4 text-left border rounded-lg transition-shadow ${
                            selectedJob === job.id
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-white hover:bg-gray-50 text-gray-800 shadow-sm hover:shadow-md'
                          }`}
                           initial={{ opacity: 1 }}
                           animate={
                             isAnimating && selectedJob === job.id
                               ? { opacity: 0 } 
                               : { opacity: 1 }
                           }
                           exit={{ opacity: 0 }} 
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <p className="text-sm text-gray-500 mt-2">
                            {job.description.substring(0, 100)}...
                          </p>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
              </div>
            </motion.div>

            {/* 右侧插画 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden md:flex justify-center"
            >
               {illustrationSrc && (
                <Image
                  src={illustrationSrc} // 使用随机选择的插画路径
                  alt="Job selection illustration"
                  width={500}
                  height={500}
                  objectFit="contain"
                  unoptimized={true}
                />
               )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 