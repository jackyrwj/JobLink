import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PageTransition from '@/components/PageTransition';

interface Job {
  id: string; // 完整URL
  jobUrlId?: string | null; // 数字ID
  title: string;
  company: string | null;
  companyLogo: string | null;
  location: string | null;
  salary: string | null;
  tags: string[];
  url: string; // 完整URL
  department: string | null;
  jobType: string | null;
  description: string | null;
  requirements: string[];
}

export default function JobDetail() {
  const router = useRouter();
  // 从URL参数中获取 jobUrlId
  const { jobUrlId } = router.query;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 确保 jobUrlId 存在且是字符串类型
    if (jobUrlId && typeof jobUrlId === 'string') {
      fetchJob(jobUrlId);
    } else if (!jobUrlId) {
        // 如果 jobUrlId 为空，显示未找到
        setJob(null);
        setLoading(false);
    }
  }, [jobUrlId]); // 依赖 jobUrlId

  const fetchJob = async (id: string) => {
    setLoading(true);
    try {
      // 调用 /api/jobs/[id] 接口，传递 jobUrlId 作为参数
      const res = await axios.get(`/api/jobs/${encodeURIComponent(id)}`);
      setJob(res.data);
    } catch (e) {
      console.error('获取职位详情失败:', e);
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-10 flex flex-col items-center">
        {loading ? (
          <div>加载中...</div>
        ) : !job ? (
          <div>未找到该职位</div>
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
            <div className="flex items-center mb-6">
              {/* 使用 job.companyLogo，注意可能是 null */}
              {job.companyLogo && (
                <img src={job.companyLogo} alt={job.company || '公司Logo'} className="w-12 h-12 rounded-full mr-4" />
              )}
              <div>
                <div className="text-xl font-bold">{job.title}</div>
                <div className="text-gray-600">{job.company || '公司名称'} · {job.location || '地点'}</div>
              </div>
            </div>
            {/* 其他字段的展示，注意处理可能为 null 的情况 */}
            {job.salary && (
              <div className="mb-4">
                <span className="font-semibold">薪资：</span>{job.salary}
              </div>
            )}
            {job.department && (
              <div className="mb-4">
                <span className="font-semibold">部门：</span>{job.department}
              </div>
            )}
            {job.jobType && (
              <div className="mb-4">
                <span className="font-semibold">职位类型：</span>{job.jobType}
              </div>
            )}
            {job.tags && job.tags.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold">标签：</span>
                {job.tags.map((tag, i) => (
                  <span key={i} className="inline-block bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1 mr-2">{tag}</span>
                ))}
              </div>
            )}
            {job.description && (
              <div className="mb-4">
                <span className="font-semibold">职位描述：</span>
                {/* 保持 whitespace-pre-line 以保留格式 */}
                <div className="whitespace-pre-line text-gray-800 mt-2">{job.description}</div>
              </div>
            )}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-4">
                <span className="font-semibold">职位要求：</span>
                <ul className="list-disc ml-6 mt-2">
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            {job.url && (
              <div className="mt-6 text-right">
                <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">查看原始职位链接</a>
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
} 