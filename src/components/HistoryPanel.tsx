import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiX, FiArrowLeft, FiBookmark } from 'react-icons/fi';

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  rule?: string;
  examples?: string[];
}

interface HistoryPanelProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  showSavedRules: boolean;
  setShowSavedRules: (show: boolean) => void;
  history: { text: string; date: string }[];
  savedRules: Correction[];
  loadFromHistory: (text: string) => void;
  removeRule: (index: number) => void;
}

const HistoryPanel: FC<HistoryPanelProps> = ({
  showHistory,
  setShowHistory,
  showSavedRules,
  setShowSavedRules,
  history,
  savedRules,
  loadFromHistory,
  removeRule
}) => {
  // 动画变体
  const panelVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '100%' }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {(showHistory || showSavedRules) && (
        <motion.div
          className="history-panel-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setShowHistory(false);
            setShowSavedRules(false);
          }}
        >
          <motion.div
            className="history-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="panel-header">
              <h2 className="panel-title">
                {showHistory && (
                  <>
                    <FiClock className="panel-icon" />
                    历史记录
                  </>
                )}
                {showSavedRules && (
                  <>
                    <FiBookmark className="panel-icon" />
                    已保存的规则
                  </>
                )}
              </h2>
              <div className="panel-actions">
                <motion.button
                  className="panel-close-btn"
                  onClick={() => {
                    setShowHistory(false);
                    setShowSavedRules(false);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX />
                </motion.button>
              </div>
            </div>

            <div className="panel-content">
              {showHistory && (
                <motion.div
                  className="history-list"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                >
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <motion.div
                        key={index}
                        className="history-item"
                        variants={itemVariants}
                        whileHover={{ backgroundColor: 'var(--color-bg-base)' }}
                        onClick={() => loadFromHistory(item.text)}
                      >
                        <div className="history-item-content">
                          <p className="history-text">{item.text.length > 50 ? `${item.text.substring(0, 50)}...` : item.text}</p>
                          <p className="history-date">{item.date}</p>
                        </div>
                        <motion.button
                          className="history-load-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiArrowLeft /> 加载
                        </motion.button>
                      </motion.div>
                    ))
                  ) : (
                    <p className="empty-message">暂无历史记录</p>
                  )}
                </motion.div>
              )}

              {showSavedRules && (
                <motion.div
                  className="saved-rules-list"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                >
                  {savedRules.length > 0 ? (
                    savedRules.map((rule, index) => (
                      <motion.div
                        key={index}
                        className="saved-rule-item"
                        variants={itemVariants}
                      >
                        <div className="rule-content">
                          <div className="rule-change">
                            <span className="original">{rule.original}</span>
                            <span className="arrow">→</span>
                            <span className="corrected">{rule.corrected}</span>
                          </div>
                          <p className="rule-explanation">{rule.explanation}</p>
                          {rule.rule && <p className="rule-grammar">📝 {rule.rule}</p>}
                        </div>
                        <motion.button
                          className="rule-delete-btn"
                          onClick={() => removeRule(index)}
                          whileHover={{ scale: 1.1, color: 'var(--color-error)' }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiX />
                        </motion.button>
                      </motion.div>
                    ))
                  ) : (
                    <p className="empty-message">暂无保存的规则</p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HistoryPanel;