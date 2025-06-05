import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PageTransition from '@/components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

interface Job {
  id: string;
  jobUrlId?: string | null;
  title: string;
  description: string;
  company: string | null;
  companyLogo: string | null;
  location?: string | null;
  salary?: string | null;
  department?: string | null;
  jobType?: string | null;
  tags?: string[];
  requirements?: string[];
  experience?: string | null;
}

// 按公司分组的职位数据
interface GroupedJobs {
  [key: string]: Job[];
}

type CompanyTab = 'all' | '腾讯' | '字节跳动';

export default function PositionDescriptionSelect() {
  const router = useRouter();
  const { departmentName } = router.query;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [groupedJobs, setGroupedJobs] = useState<GroupedJobs>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CompanyTab>('all');

  const displayDepartmentName = Array.isArray(departmentName) ? 
    (departmentName[0] || '').split(' - ').pop() || '' :
    (departmentName || '').split(' - ').pop() || '';

  useEffect(() => {
    if (!router.isReady) return;

    if (departmentName && typeof departmentName === 'string') {
      const trimmedName = departmentName.trim();
      fetchJobs(trimmedName);
    } else if (!departmentName) {
      setJobs([]);
      setLoading(false);
    }
  }, [router.isReady, departmentName]);

  useEffect(() => {
    // 当jobs数据更新时，按公司分组
    const grouped = jobs.reduce((acc: GroupedJobs, job) => {
      const company = job.company || '其他';
      if (!acc[company]) {
        acc[company] = [];
      }
      acc[company].push(job);
      return acc;
    }, {});
    setGroupedJobs(grouped);
  }, [jobs]);

  const fetchJobs = async (deptName: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/jobs?department=${encodeURIComponent(deptName)}`);
      setJobs(res.data);
    } catch (e) {
      console.error('获取职位描述失败:', e);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionClick = (job: Job) => {
    if (job.jobUrlId) {
      router.push(`/jobs/position/detail/${encodeURIComponent(job.jobUrlId)}`);
    } else {
      console.warn('该职位没有 jobUrlId，无法跳转到详情页:', job.id);
    }
  };

  const formatJobDescription = (description: string) => {
    return description
      .replace(/(\d+、)/g, '\n$1')
      .replace(/([•·])/g, '\n$1')
      .split('\n')
      .filter(line => line.trim())
      .map((line, index) => (
        <p key={index} className="mb-2 pl-4">
          {line}
        </p>
      ));
  };

  // 根据当前选中的标签过滤公司
  const filteredCompanies = Object.entries(groupedJobs).filter(([company]) => {
    if (activeTab === 'all') return true;
    return company === activeTab;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6">
          {displayDepartmentName}
        </h2>

        {/* 公司切换标签页 */}
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2
                ${activeTab === 'all' 
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:shadow-md'}`}
            >
              <span>全部公司</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {Object.values(groupedJobs).reduce((acc, jobs) => acc + jobs.length, 0)}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('腾讯')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2
                ${activeTab === '腾讯' 
                  ? 'bg-green-600 text-white shadow-lg transform scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:shadow-md'}`}
            >
              <img src="/images/QQ.svg" alt="腾讯" className="w-5 h-5" />
              <span>腾讯</span>
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                {groupedJobs['腾讯']?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('字节跳动')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2
                ${activeTab === '字节跳动' 
                  ? 'bg-red-600 text-white shadow-lg transform scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:shadow-md'}`}
            >
              <img src="/images/bytedance.svg" alt="字节跳动" className="w-5 h-5" />
              <span>字节跳动</span>
              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                {groupedJobs['字节跳动']?.length || 0}
              </span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">暂无该类别的职位</div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <AnimatePresence mode="wait">
              {filteredCompanies.map(([company, companyJobs]) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <img
                      src={companyJobs[0]?.companyLogo || '/images/default-company.svg'}
                      alt={company}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    {company}
                  </h3>
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="space-y-6">
                      {companyJobs.map((job) => (
                        <motion.div
                          key={job.id}
                          className="relative border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow hover:bg-gray-50 transition-colors overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="absolute top-0 right-0 w-full h-full opacity-5">
                            <img
                              src={job.companyLogo || '/images/default-company.svg'}
                              alt={job.company || '公司Logo'}
                              className="w-full h-full object-contain object-right-top"
                            />
                          </div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <img
                                  src={job.companyLogo || '/images/default-company.svg'}
                                  alt={job.company || '公司Logo'}
                                  className="w-8 h-8 rounded-full mr-3"
                                />
                                <h2 className="text-xl font-semibold text-gray-900">
                                  {job.title}
                                </h2>
                              </div>
                              <div className="flex items-center space-x-4">
                                {job.location && (
                                  <span className="text-sm text-gray-500">
                                    📍 {job.location}
                                  </span>
                                )}
                                {job.salary && (
                                  <span className="text-sm text-gray-500">
                                    💰 {job.salary}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="prose max-w-none">
                              {formatJobDescription(job.description || '')}
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                              <div className="flex items-center space-x-4">
                                {job.experience && (
                                  <span className="text-sm text-gray-500">
                                    ⏳ {job.experience}
                                  </span>
                                )}
                                {job.tags && job.tags.length > 0 && (
                                  <div className="flex space-x-2">
                                    {job.tags.map((tag, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => handleDescriptionClick(job)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                查看详情
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageTransition>
  );
} 