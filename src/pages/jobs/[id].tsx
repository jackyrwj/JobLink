import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDescription, setSelectedDescription] = useState<string>('');
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
    if (id) {
      fetchJobDetail();
    }
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const response = await axios.get(`/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('获取职位详情失败:', error);
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionSelect = async (description: string) => {
    setSelectedDescription(description);
    setIsAnimating(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (job) {
       router.push(`/jobs/company/${job.id}`);
    }
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

  if (!job) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">未找到职位信息</h2>
            <Link href="/" className="text-blue-500 hover:underline">
              返回首页
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const descriptionItems = job.description.split(/[0-9]+\./).filter(item => item.trim());

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 flex items-center justify-center">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex justify-center"
          >
            {illustrationSrc && ( // 确保插画路径已设置
              <Image
                src={illustrationSrc} // 使用随机选择的插画路径
                alt="Job detail illustration"
                width={500}
                height={500}
                objectFit="contain"
                unoptimized={true}
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <Link href={`/jobs/selection?category=${job.category}`} className="text-blue-500 hover:underline mb-4 inline-block">
                  ← 返回职位列表
                </Link>
                <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">请选择您感兴趣的工作内容</h2>
                <div className="space-y-4">
                  <AnimatePresence>
                    {descriptionItems.map((item, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleDescriptionSelect(item.trim())}
                        className={`w-full p-4 text-left border rounded-lg transition-shadow ${
                          selectedDescription === item.trim()
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white hover:bg-gray-50 text-gray-800 shadow-sm hover:shadow-md'
                        }`}
                        initial={{ opacity: 1 }}
                        animate={
                          isAnimating && selectedDescription === item.trim()
                            ? { opacity: 1, scale: 1.1, y: 0 }
                            : selectedDescription !== '' && selectedDescription !== item.trim()
                            ? { opacity: 0.5, scale: 0.9, y: -10 }
                            : { opacity: 1, scale: 1 }
                        }
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        {item.trim()}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
} 