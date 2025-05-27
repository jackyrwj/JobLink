import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import PageTransition from '../../../components/PageTransition';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
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

export default function CompanyAndApply() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

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

  const handleApplyClick = () => {
    if (job && job.sourceUrl) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      window.open(job.sourceUrl, '_blank');
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
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
            <h2 className="text-2xl font-bold mb-4">未找到公司信息</h2>
            <Link href="/" className="text-blue-500 hover:underline">
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <button onClick={() => router.back()} className="text-blue-500 hover:underline mb-4 inline-block">
                  ← 返回职位详情
                </button>
                <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                
                <div className="relative w-full max-w-md mx-auto">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg min-h-[120px] relative overflow-hidden">
                    <div className={`${isRevealed ? '' : 'opacity-0'} transition-opacity duration-500`}>
                      <p className="text-xl text-gray-600 mb-4">公司：{job.company}</p>
                      <p className="text-sm text-gray-500 mb-4">来源：{job.source}</p>
                    </div>
                    {!isRevealed && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-500 cursor-pointer hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-[1.02]"
                        onClick={handleReveal}
                      >
                        <span className="text-white font-bold text-lg flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          点击查看公司信息
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isRevealed && job.sourceUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-8 text-center"
                >
                  <button
                    onClick={handleApplyClick}
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors text-lg font-medium"
                  >
                    申请职位
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex justify-center"
          >
            <Image
              src="/images/hula_loop_octodex03.gif"
              alt="Company information illustration"
              width={500}
              height={500}
              style={{ objectFit: 'contain' }}
              unoptimized={true}
            />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
} 