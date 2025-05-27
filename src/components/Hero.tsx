import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Hero() {
  const subtitles = [
    "找工作不再迷茫！精准匹配理想职位",
    "量身定制岗位推荐，看中就点，公司详情与招聘页一步到位"
  ];

  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const currentText = subtitles[currentSubtitleIndex];
      if (isDeleting) {
        setDisplayedSubtitle(currentText.substring(0, displayedSubtitle.length - 1));
        setTypingSpeed(50);
      } else {
        setDisplayedSubtitle(currentText.substring(0, displayedSubtitle.length + 1));
        setTypingSpeed(100);
      }
    };

    const timeout = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedSubtitle, isDeleting, currentSubtitleIndex, subtitles, typingSpeed]);

  useEffect(() => {
    if (!isDeleting && displayedSubtitle === subtitles[currentSubtitleIndex]) {
      // Done typing, time to delete
      const timeout = setTimeout(() => setIsDeleting(true), 1500);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayedSubtitle === '') {
      // Done deleting, move to next subtitle
      setIsDeleting(false);
      setCurrentSubtitleIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
      setTypingSpeed(100);
    }
  }, [displayedSubtitle, isDeleting, currentSubtitleIndex, subtitles]);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50 to-white opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            JobLink
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            {displayedSubtitle}
            <span className="border-r-2 border-gray-600 animate-blink"></span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => {
                const element = document.getElementById('main-content');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 text-lg font-medium"
            >
              开始探索
            </button>
            <a
              href="https://github.com/yourusername/joblink"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-300 text-lg font-medium"
            >
              GitHub
            </a>
          </motion.div>
        </motion.div>

        {/* 特性展示 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            {
              title: '智能匹配',
              description: '基于AI的职位推荐系统，精准匹配你的技能和期望',
              icon: '🎯'
            },
            {
              title: '实时更新',
              description: '及时获取最新职位信息，不错过任何机会',
              icon: '⚡'
            },
            {
              title: '个性化体验',
              description: '根据你的偏好定制求职体验，提高求职效率',
              icon: '✨'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 向下滚动指示器 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="w-1 h-2 bg-gray-400 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </div>
  );
} 