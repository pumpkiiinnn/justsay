import { FC } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
  explanation?: string;
}

interface ResultSectionProps {
  diffResult: DiffPart[];
  showTooltip: (event: React.MouseEvent<HTMLSpanElement>) => void;
  hideTooltip: () => void;
}

const ResultSection: FC<ResultSectionProps> = ({ diffResult, showTooltip, hideTooltip }) => {
  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="result-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="card result-card"
        transition={{ duration: 0.3 }}
      >
        <div className="card-header">
          <h2 className="card-title">
            <FiCheckCircle className="section-icon success-icon" />
            优化结果
          </h2>
        </div>
        <motion.div 
          className="card-body"
          variants={itemVariants}
        >
          <div className="result-text">
            {diffResult.map((part, index) => {
              if (part.removed) {
                return (
                  <motion.span 
                    key={index} 
                    className="text-error"
                    data-explanation={part.explanation || ''}
                    onMouseEnter={showTooltip}
                    onMouseLeave={hideTooltip}
                    initial={{ backgroundColor: 'rgba(239, 68, 68, 0.3)' }}
                    animate={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                  >
                    {part.value}
                    {part.explanation && (
                      <motion.span 
                        className="error-indicator"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        ?
                      </motion.span>
                    )}
                  </motion.span>
                );
              } else if (part.added) {
                return (
                  <motion.span 
                    key={index} 
                    className="text-success"
                    data-explanation={part.explanation || ''}
                    onMouseEnter={showTooltip}
                    onMouseLeave={hideTooltip}
                    initial={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}
                    animate={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                  >
                    {part.value}
                    {part.explanation && (
                      <motion.span 
                        className="success-indicator"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.span>
                );
              } else {
                return <span key={index}>{part.value}</span>;
              }
            })}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResultSection;