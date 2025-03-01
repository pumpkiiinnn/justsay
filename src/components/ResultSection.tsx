import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
  explanation?: string;
}

interface ResultSectionProps {
  original: string;
  corrected: string;
  diffResult: DiffPart[];
  showTooltip: (text: string, x: number, y: number) => void;
  hideTooltip: () => void;
}

const ResultSection = ({ 
  original, 
  corrected, 
  diffResult, 
  showTooltip, 
  hideTooltip 
}: ResultSectionProps) => {
  // 存储当前激活的提示项索引
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null);
  // 使用防抖计时器
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // 跟踪鼠标是否在元素上
  const isHoveringRef = useRef<boolean>(false);

  // 处理鼠标进入
  const handleMouseEnter = (e: React.MouseEvent, explanation: string, index: number) => {
    isHoveringRef.current = true;
    
    // 清除之前的计时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // 如果是新的索引，立即显示tooltip
    if (activeTooltipIndex !== index) {
      const rect = e.currentTarget.getBoundingClientRect();
      // 调整y位置，确保tooltip显示在元素上方足够距离
      const tooltipY = rect.top - 15;
      showTooltip(explanation, rect.left + rect.width / 2, tooltipY);
      setActiveTooltipIndex(index);
    }
  };

  // 处理鼠标离开
  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    
    // 使用延迟隐藏tooltip，防止闪烁
    debounceTimerRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        hideTooltip();
        setActiveTooltipIndex(null);
      }
    }, 300);
  };

  // 渲染差异部分
  const renderDiff = () => {
    return diffResult.map((part, index) => {
      const className = part.added 
        ? 'added' 
        : part.removed 
          ? 'removed' 
          : '';
      
      if (part.explanation && (part.added || part.removed)) {
        return (
          <span 
            key={index} 
            className={className}
            onMouseEnter={(e) => handleMouseEnter(e, part.explanation || '', index)}
            onMouseLeave={handleMouseLeave}
          >
            {part.value}
          </span>
        );
      } else {
        return (
          <span key={index} className={className}>
            {part.value}
          </span>
        );
      }
    });
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="result-section mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="bg-base-100/90 backdrop-blur-md rounded-3xl shadow-lg p-6 md:p-8 border border-base-300/50"
        variants={containerVariants}
      >
        <motion.h2 
          className="text-2xl font-bold mb-6 text-base-content"
          variants={itemVariants}
        >
          优化结果
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            className="original p-4 bg-base-200/50 rounded-xl border border-base-300/50"
            variants={itemVariants}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content-light mb-2">原始文本</h3>
            <div className="whitespace-pre-wrap break-words text-base-content">
              {original}
            </div>
          </motion.div>
          
          <motion.div 
            className="corrected p-4 bg-primary/5 rounded-xl border border-primary/20"
            variants={itemVariants}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">优化文本</h3>
            <div className="whitespace-pre-wrap break-words text-base-content">
              {corrected}
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="diff-view mt-6 p-4 bg-base-200/50 rounded-xl border border-base-300/50"
          variants={itemVariants}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content-light mb-2">对比视图 <span className="text-xs font-normal normal-case ml-2">(鼠标悬停在修改处查看详情)</span></h3>
          <div className="whitespace-pre-wrap break-words text-base-content">
            {renderDiff()}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResultSection;