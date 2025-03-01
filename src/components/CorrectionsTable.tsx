import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBookmark, FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  rule?: string;
  examples?: string[];
}

interface CorrectionsTableProps {
  corrections: Correction[];
  saveRule: (correction: Correction) => void;
}

const CorrectionsTable = ({ corrections, saveRule }: CorrectionsTableProps) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  
  const toggleExpand = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index]
    );
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.2,
        staggerChildren: 0.1
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
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };
  
  if (corrections.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="corrections-section mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="bg-base-100/90 backdrop-blur-md rounded-3xl shadow-lg p-6 md:p-8 border border-base-300/50"
        variants={containerVariants}
      >
        <motion.div 
          variants={itemVariants}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-2xl font-bold text-base-content">修正详情</h2>
          <div className="badge badge-primary badge-lg">{corrections.length} 处修正</div>
        </motion.div>
        
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
        >
          {corrections.map((correction, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="rounded-xl overflow-hidden border border-base-300 shadow-sm"
            >
              <div 
                className="p-4 bg-base-200/50 cursor-pointer flex justify-between items-center"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <span className="text-error mr-2">×</span>
                      <span className="font-medium text-error line-through">{correction.original}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-success mr-2">✓</span>
                      <span className="font-medium text-success">{correction.corrected}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="btn btn-sm btn-ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      saveRule(correction);
                    }}
                  >
                    <FiBookmark className="text-secondary" />
                  </motion.button>
                  {expandedItems.includes(index) ? 
                    <FiChevronUp /> : <FiChevronDown />}
                </div>
              </div>
              
              <AnimatePresence>
                {expandedItems.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-base-300 bg-base-100">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-base-content-light mb-2 flex items-center">
                          <FiInfo className="mr-2" />
                          解释
                        </h4>
                        <p className="text-base-content">{correction.explanation}</p>
                      </div>
                      
                      {correction.rule && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-base-content-light mb-2">规则</h4>
                          <div className="p-3 bg-base-200/50 rounded-lg text-sm">
                            {correction.rule}
                          </div>
                        </div>
                      )}
                      
                      {correction.examples && correction.examples.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-base-content-light mb-2">示例</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {correction.examples.map((example, i) => (
                              <li key={i} className="text-base-content">{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CorrectionsTable;