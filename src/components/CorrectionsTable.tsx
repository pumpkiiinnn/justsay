import { FC } from 'react';
import { motion } from 'framer-motion';
import { FiInfo } from 'react-icons/fi';

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  rule?: string;
  examples?: string[];
}

interface CorrectionsTableProps {
  corrections: Correction[];
}

const CorrectionsTable: FC<CorrectionsTableProps> = ({ corrections }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="corrections-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="card corrections-card"
        whileHover={{ boxShadow: 'var(--shadow-lg)' }}
        transition={{ duration: 0.3 }}
      >
        <div className="card-header">
          <h2 className="card-title">
            <FiInfo className="section-icon info-icon" />
            详细修正说明
          </h2>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="corrections-table">
              <thead>
                <tr>
                  <th>原文</th>
                  <th>修正</th>
                  <th>解释</th>
                </tr>
              </thead>
              <tbody>
                {corrections.map((correction, index) => (
                  <motion.tr 
                    key={index}
                    variants={rowVariants}
                    whileHover={{ backgroundColor: 'var(--color-bg-base)', scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td className="original-text">{correction.original}</td>
                    <td className="corrected-text">{correction.corrected}</td>
                    <td className="explanation-text">{correction.explanation}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CorrectionsTable;