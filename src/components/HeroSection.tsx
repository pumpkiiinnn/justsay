import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.6
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 25px -5px rgba(0, 113, 227, 0.4)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.98 }
  };
  
  return (
    <div className="relative min-h-[85vh] flex items-center overflow-hidden w-full">
      {/* 背景装饰元素 */}
      <motion.div 
        className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl"
        animate={{ 
          x: [20, -20], 
          y: [-20, 20],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "reverse", 
          duration: 15, 
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] rounded-full bg-secondary/10 blur-3xl"
        animate={{ 
          x: [-30, 30], 
          y: [30, -30],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "reverse", 
          duration: 18, 
          ease: "easeInOut"
        }}
      />
      
      {/* 前景内容 */}
      <div className="container mx-auto px-4 relative z-10 w-full">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            轻松掌握<span className="text-primary">英语表达</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-base-content-light mb-8 max-w-2xl mx-auto"
          >
            AI驱动的英语表达优化，让您的英语表达更加地道、专业
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="btn btn-lg btn-primary rounded-full px-8 text-white shadow-lg"
              onClick={onGetStarted}
            >
              开始体验
            </motion.button>
            
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="btn btn-lg btn-outline border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8"
            >
              了解更多
            </motion.button>
          </motion.div>
          
          {/* 特性展示 */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {[
              { title: "智能优化", description: "自动检测并修正语法错误和表达不当" },
              { title: "深度解析", description: "提供详细的语法规则解释和改进建议" },
              { title: "学习进步", description: "记录您的学习历程，持续提升英语水平" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-base-100/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-base-300"
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-base-content-light">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* 波浪底部装饰 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path
            fill="currentColor"
            fillOpacity="0.05"
            d="M0,160L48,133.3C96,107,192,53,288,69.3C384,85,480,171,576,192C672,213,768,171,864,176C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
