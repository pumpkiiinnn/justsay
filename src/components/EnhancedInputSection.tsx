import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface EnhancedInputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleOptimize: () => void;
  isLoading: boolean;
  useExampleText: () => void;
  exampleText: string;
}

const EnhancedInputSection = ({
  inputText,
  setInputText,
  handleOptimize,
  isLoading,
  useExampleText,
  exampleText
}: EnhancedInputSectionProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState(150);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // 自动调整文本域高度
  useEffect(() => {
    if (textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      const minHeight = 150;
      const maxHeight = 400;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      setTextareaHeight(newHeight);
    }
  }, [inputText]);
  
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        mass: 1
      }
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
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
    hover: {
      scale: 1.05,
      boxShadow: '0 6px 20px -5px rgba(0, 0, 0, 0.2)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.98 }
  };
  
  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="w-full max-w-4xl mx-auto"
    >
      <motion.div 
        variants={contentVariants}
        className={`relative overflow-hidden rounded-3xl ${
          isFocused 
            ? 'shadow-lg ring-2 ring-primary/50' 
            : 'shadow-md hover:shadow-lg'
        } transition-shadow duration-300 backdrop-blur-md bg-base-100/90`}
      >
        <div className="py-6 px-8">
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-base-content">输入您的英语文本</h2>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={useExampleText}
              className="btn btn-sm btn-outline btn-accent"
            >
              使用示例
            </motion.button>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="relative">
              <motion.textarea
                ref={textareaRef}
                className="w-full p-4 bg-base-200/50 rounded-xl border-base-300 border focus:outline-none focus:ring-0 resize-none text-base-content"
                style={{ height: textareaHeight }}
                placeholder="请输入您想要优化的英语文本..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                animate={{ height: textareaHeight }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
              />
              
              {/* 字数统计 */}
              <div className="absolute bottom-3 right-3 text-xs text-base-content-light">
                {inputText.length} 字符
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-6 flex justify-end">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="btn btn-lg btn-primary px-8 rounded-full text-white shadow-md disabled:opacity-70"
              onClick={handleOptimize}
              disabled={isLoading || !inputText.trim()}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    className="w-6 h-6 rounded-full border-2 border-white border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <motion.span
                    key="optimize"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    优化文本
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* 装饰元素 */}
      <div className="absolute -z-10 w-40 h-40 blur-3xl rounded-full bg-primary/10 -top-10 -left-10" />
      <div className="absolute -z-10 w-40 h-40 blur-3xl rounded-full bg-secondary/10 -bottom-10 -right-10" />
    </motion.div>
  );
};

export default EnhancedInputSection;
