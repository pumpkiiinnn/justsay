import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiX, FiArrowLeft, FiBookmark, FiTrash2 } from 'react-icons/fi';

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  rule?: string;
  examples?: string[];
}

interface HistoryPanelProps {
  history: { text: string; date: string }[];
  loadFromHistory: (text: string) => void;
  clearHistory: () => void;
  onClose: () => void;
}

const HistoryPanel = ({ history, loadFromHistory, clearHistory, onClose }: HistoryPanelProps) => {
  // 动画变体
  const panelVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, x: '100%', transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md h-full bg-base-100 shadow-xl overflow-hidden flex flex-col"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiClock className="text-primary" />
            历史记录
          </h2>
          <div className="flex gap-2">
            {history.length > 0 && (
              <motion.button
                className="btn btn-sm btn-ghost text-error"
                onClick={clearHistory}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiTrash2 size={16} />
                <span className="ml-1">清空</span>
              </motion.button>
            )}
            <motion.button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX size={20} />
            </motion.button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            className="space-y-3"
          >
            {history.length > 0 ? (
              history.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-base-200/50 rounded-lg border border-base-300 overflow-hidden"
                  variants={itemVariants}
                  whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}
                >
                  <div className="p-3">
                    <p className="text-sm text-base-content-light mb-1">{item.date}</p>
                    <p className="text-base font-medium text-base-content line-clamp-2">
                      {item.text}
                    </p>
                  </div>
                  <div className="bg-base-300/30 p-2 flex justify-end">
                    <motion.button
                      className="btn btn-sm btn-primary btn-outline"
                      onClick={() => loadFromHistory(item.text)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiArrowLeft className="mr-1" /> 加载此文本
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-lg text-base-content-light">暂无历史记录</p>
                <p className="text-sm text-base-content-light mt-2">您的优化历史将显示在这里</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HistoryPanel;