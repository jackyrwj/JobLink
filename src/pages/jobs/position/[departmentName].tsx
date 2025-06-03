import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';

interface Job {
  id: string; // 这个id仍然是职位的完整URL
  jobUrlId?: string | null; // 添加 jobUrlId 字段
  title: string;
  description: string;
}

export default function PositionDescriptionSelect() {
  const router = useRouter();
  // 从URL参数中获取departmentName
  const { departmentName } = router.query;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 确保 departmentName 存在且是字符串类型
    if (departmentName && typeof departmentName === 'string') {
      fetchJobs(departmentName);
    } else if (!departmentName) {
        // 如果 departmentName 为空，可能是直接访问页面或参数错误，可以清空数据或显示提示
        setJobs([]);
        setLoading(false);
    }
  }, [departmentName]); // 依赖 departmentName

  const fetchJobs = async (deptName: string) => {
    setLoading(true);
    try {
      // 调用 /api/jobs 接口，并传递 departmentName 参数
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
    // 跳转到职位详情页，传递 jobUrlId 作为参数
    if (job.jobUrlId) {
      router.push(`/jobs/position/detail/${encodeURIComponent(job.jobUrlId)}`);
    } else {
      console.warn('该职位没有 jobUrlId，无法跳转到详情页:', job.id);
      // 可以根据需求处理没有 jobUrlId 的情况，例如显示提示或禁用点击
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6">请选择你感兴趣的职位描述</h2>
        {loading ? (
          <div>加载中...</div>
        ) : jobs.length === 0 ? (
          <div>暂无该类别的职位</div>
        ) : (
          <div className="w-full max-w-2xl space-y-4">
            {jobs.map((job) => (
              <motion.button
                key={job.id}
                // 传递整个 job 对象或至少 jobUrlId
                onClick={() => handleDescriptionClick(job)}
                className="block w-full text-left p-4 bg-white rounded-lg shadow hover:bg-blue-50 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-semibold text-lg mb-2">{job.title}</div>
                <div className="text-gray-600 line-clamp-3">{job.description}</div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
} 