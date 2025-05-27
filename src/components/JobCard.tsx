import { motion } from 'framer-motion';
import { Job } from '@/types/job';
import { useRouter } from 'next/router';

interface JobCardProps {
  job: Job;
  index: number;
}

export default function JobCard({ job, index }: JobCardProps) {
  const router = useRouter();
  const { pathname } = router;

  // 根据当前页面路径选择对应的 GIF
  const getGifForPage = () => {
    // 获取当前路径的最后一段
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    // 如果是首页或根路径
    if (pathname === '/' || pathname === '') {
      return '/images/nyantocat.gif';
    }
    // 如果是公司详情页
    else if (pathname.includes('/jobs/company/')) {
      return '/images/hula_loop_octodex03.gif';
    }
    // 如果是职位列表页
    else if (pathname.includes('/jobs/position')) {
      return '/images/maxtocat.gif';
    }
    // 如果是地点列表页
    else if (pathname.includes('/jobs/location')) {
      return '/images/NUX_Octodex.gif';
    }
    // 其他情况显示 nyantocat
    else {
      return '/images/nyantocat.gif';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
          <span className="text-sm text-gray-500">{job.location}</span>
        </div>
        
        <div className="flex items-center mb-4">
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-gray-600">{job.company}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-green-600 font-semibold">{job.salary}</span>
          <button
            onClick={() => router.push(`/jobs/company/${job.id}`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            查看详情
          </button>
        </div>
      </div>

      <div className="relative h-48 bg-gray-100">
        <img
          src={getGifForPage()}
          alt="Job illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  );
} 