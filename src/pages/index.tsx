import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '@/components/PageTransition';
import Hero from '@/components/Hero';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [illustrationSrc, setIllustrationSrc] = useState('');
  const [showMessages, setShowMessages] = useState(false);

  // 使用 react-intersection-observer 监听整个对话区域的可见性
  const [ref, inView] = useInView({ 
    triggerOnce: true,
    threshold: 0.1,
    onChange: (inView) => {
      if (inView) {
        setShowMessages(true);
      }
    }
  });

  const illustrations = [
    '/images/maxtocat.gif',
    '/images/NUX_Octodex.gif',
    '/images/nyantocat.gif',
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * illustrations.length);
    setIllustrationSrc(illustrations[randomIndex]);
  }, []);

  const categories = [
    { id: 'frontend', name: '前端开发', icon: '🎨' },
    { id: 'backend', name: '后端开发', icon: '⚙️' },
    { id: 'mobile', name: '移动开发', icon: '📱' },
    { id: 'ai', name: '人工智能', icon: '🤖' },
    { id: 'data', name: '数据分析', icon: '📊' },
    { id: 'product', name: '产品经理', icon: '🎯' },
    { id: 'design', name: 'UI/UX设计', icon: '✨' },
    { id: 'operation', name: '运营', icon: '📈' },
    { id: 'marketing', name: '市场营销', icon: '🎯' },
    { id: 'sales', name: '销售', icon: '💰' },
    { id: 'hr', name: '人力资源', icon: '👥' },
    { id: 'finance', name: '财务', icon: '💹' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setTimeout(() => {
      router.push(`/jobs/selection?category=${categoryId}`);
    }, 500);
  };

  const companies = [
    {
      name: '腾讯',
      logo: '/images/QQ.svg',
      message: '我们不仅提供有竞争力的薪酬福利，更有开放的企业文化和广阔的发展平台，加入腾讯，一起探索技术的边界，连接一切可能！',
      position: 'top-left'
    },
    {
      name: '字节跳动',
      logo: '/images/bytedance.svg',
      message: '年轻、有活力、敢想敢干是我们的标签！在这里，扁平化管理，鼓励创新，你将和最优秀的人一起，用技术改变世界，欢迎加入字节跳动！',
      position: 'top-right'
    },
    {
      name: '美团',
      logo: '/images/meituan.svg',
      message: '我们在做一件关于"美好生活"的事情，用科技的力量连接人与服务。加入美团，你会发现工作不仅是代码和项目，更是为亿万用户带来便利和幸福！',
      position: 'bottom-left'
    },
    {
      name: '阿里巴巴',
      logo: '/images/alibaba.svg',
      message: '"让天下没有难做的生意"是我们的使命。在阿里，我们拥抱变化，相信创新，你将有机会参与到最前沿的项目，和全球的优秀人才一起，定义未来商业！',
      position: 'bottom-right'
    }
  ];

  return (
    <PageTransition>
      <div className="bg-gray-100">
        <Hero />
        
        {/* 公司对话展示区域 */}
        <div ref={ref} className="relative h-[800px] bg-gradient-to-b from-gray-100 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="relative h-full">
              {companies.map((company, index) => (
                <div
                  key={company.name}
                  className={`absolute ${company.position === 'top-left' ? 'top-20 left-10' : 
                    company.position === 'top-right' ? 'top-20 right-10' :
                    company.position === 'bottom-left' ? 'bottom-20 left-10' : 'bottom-20 right-10'}`}
                >
                  {/* 公司图标 */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="relative"
                  >
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={180}
                      height={180}
                      className="rounded-full shadow-lg object-cover aspect-square"
                    />
                    
                    {/* 聊天气泡 */}
                    <AnimatePresence>
                      {showMessages && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0, x: company.position.includes('left') ? -20 : 20 }}
                          animate={{ scale: 1, opacity: 1, x: 0 }}
                          transition={{ 
                            duration: 0.8,
                            delay: 1 + index * 0.3,
                            type: "spring",
                            stiffness: 100,
                            damping: 15
                          }}
                          className={`absolute ${
                            company.position.includes('left') ? 'left-full ml-6' : 'right-full mr-6'
                          } ${
                            company.position.includes('top') ? 'top-1/4' : 'bottom-1/4'
                          }`}
                        >
                          <div className="bg-gray-100 rounded-3xl shadow-lg p-4 w-80 border border-gray-300">
                            <div className="font-bold text-gray-800 mb-1">{company.name}</div>
                            <p className="text-gray-600 whitespace-normal">{company.message}</p>
                          </div>
                          {/* 气泡尾巴 - 边框 */}
                          <div className={`absolute w-0 h-0 
                            ${company.position.includes('left') 
                              ? 'border-t-[10px] border-b-[10px] border-r-[10px] border-t-transparent border-b-transparent border-r-gray-300 left-[-10px] top-[24px]' 
                              : 'border-t-[10px] border-b-[10px] border-l-[10px] border-t-transparent border-b-transparent border-l-gray-300 right-[-10px] top-[24px]'
                            }
                          `}></div>
                          {/* 气泡尾巴 - 背景填充 */}
                           <div className={`absolute w-0 h-0 
                            ${company.position.includes('left') 
                              ? 'border-t-[8px] border-b-[8px] border-r-[8px] border-t-transparent border-b-transparent border-r-gray-100 left-[-8px] top-[26px]' 
                              : 'border-t-[8px] border-b-[8px] border-l-[8px] border-t-transparent border-b-transparent border-l-gray-100 right-[-8px] top-[26px]'
                            }
                          `}></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 职位类别选择部分 */}
        <div id="main-content" className="bg-gradient-to-b from-white to-gray-50 py-16 px-4 flex items-center justify-center">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* 左侧插画 */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden md:flex justify-center"
            >
              {illustrationSrc && (
                <Image
                  src={illustrationSrc}
                  alt="Job search illustration"
                  width={500}
                  height={500}
                  style={{ objectFit: 'contain' }}
                  unoptimized={true}
                />
              )}
            </motion.div>

            {/* 右侧职位类别选择 */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                  选择你感兴趣的职位类别
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`p-4 rounded-xl text-left transition-all duration-300 w-full ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white scale-105 shadow-lg'
                          : 'bg-white hover:bg-blue-50 text-gray-800 shadow-sm hover:shadow-md'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <div className="font-medium">{category.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
} 