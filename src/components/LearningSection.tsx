import { FC } from 'react';
import { motion } from 'framer-motion';
import { FiGlobe } from 'react-icons/fi';

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  rule?: string;
  examples?: string[];
}

interface LearningSectionProps {
  corrections: Correction[];
}

const LearningSection: FC<LearningSectionProps> = ({ corrections }) => {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="learning-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="card learning-card"
        whileHover={{ boxShadow: 'var(--shadow-lg)' }}
        transition={{ duration: 0.3 }}
      >
        <div className="card-header">
          <h2 className="card-title">
            <FiGlobe className="section-icon warning-icon" />
            语法规则学习
          </h2>
        </div>
        <div className="card-body">
          <div className="learning-grid">
            {corrections.filter(c => c.rule).map((correction, index) => (
              <motion.div 
                key={index} 
                className="rule-card"
                variants={cardVariants}
                whileHover={{ 
                  y: -5, 
                  boxShadow: 'var(--shadow-md)',
                  backgroundColor: 'var(--color-bg-card)'
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="rule-header">
                  <motion.div 
                    className="rule-change"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="original">{correction.original}</span>
                    <motion.svg 
                      className="arrow-icon" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                    <span className="corrected">{correction.corrected}</span>
                  </motion.div>
                </div>
                <p className="rule-explanation">{correction.explanation}</p>
                {correction.rule && (
                  <motion.div 
                    className="rule-box"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, backgroundColor: 'var(--color-bg-base)' }}
                  >
                    <p className="rule-title">📝 语法规则:</p>
                    <p className="rule-content">{correction.rule}</p>
                  </motion.div>
                )}
                {correction.examples && correction.examples.length > 0 && (
                  <motion.div 
                    className="examples-container"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <p className="examples-title">✨ 例句:</p>
                    <ul className="examples-list">
                      {correction.examples.map((example, i) => (
                        <motion.li 
                          key={i} 
                          className="example-item"
                          initial={{ x: -5, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                        >
                          {example}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LearningSection;