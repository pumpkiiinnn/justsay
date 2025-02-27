import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiCheckCircle, FiX, FiInfo } from 'react-icons/fi';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  isLoading: boolean;
  handleOptimize: () => void;
  useExampleText: () => void;
}

const InputSection: FC<InputSectionProps> = ({
  inputText,
  setInputText,
  isLoading,
  handleOptimize,
  useExampleText
}) => {
  const [charCount, setCharCount] = useState(0);
  const [showTip, setShowTip] = useState(false);
  
  // 更新字符计数
  useEffect(() => {
    setCharCount(inputText.length);
  }, [inputText]);

  // 清空输入
  const clearInput = () => {
    setInputText('');
  };

  // 键盘快捷键处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter 或 Cmd+Enter 提交
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && inputText.trim() && !isLoading) {
      e.preventDefault();
      handleOptimize();
    }
  };

  // 显示/隐藏提示
  const toggleTip = () => {
    setShowTip(!showTip);
  };

  return (
    <motion.div 
      className="input-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="card input-card"
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="card-header">
          <h2 className="card-title">
            <FiFileText className="section-icon" />
            输入您想要优化的英文句子
          </h2>
          <motion.button
            className="tip-button"
            onClick={toggleTip}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="显示提示"
          >
            <FiInfo />
          </motion.button>
        </div>
        
        <AnimatePresence>
          {showTip && (
            <motion.div 
              className="tip-box"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p>提示：输入含有语法错误的英文句子，点击"优化语法"按钮获取修正和学习建议。您也可以使用快捷键 <kbd>Ctrl</kbd>+<kbd>Enter</kbd> 快速提交。</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="card-body">
          <div className="input-wrapper">
            <div className="textarea-container">
              <motion.textarea 
                className="text-input" 
                placeholder="例如: I go to school yesterday. She have a cat. They is happy..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                whileFocus={{ boxShadow: '0 0 0 3px rgba(82, 119, 247, 0.2)' }}
                transition={{ duration: 0.2 }}
              />
              {inputText && (
                <motion.button 
                  className="clear-button"
                  onClick={clearInput}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX />
                </motion.button>
              )}
            </div>
            
            <div className="input-footer">
              <div className="input-meta">
                <motion.span 
                  className="char-count"
                  animate={{
                    color: charCount > 500 ? 'var(--color-error)' : 'var(--color-text-muted)'
                  }}
                >
                  {charCount} 字符
                </motion.span>
                <span className="keyboard-hint">提示: Ctrl+Enter 快速提交</span>
              </div>
              
              <div className="button-group">
                <motion.button 
                  className="sample-btn"
                  onClick={useExampleText}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiFileText className="sample-icon" />
                  使用示例文本
                </motion.button>
                <motion.button 
                  className={`optimize-btn ${isLoading ? 'loading' : ''}`}
                  onClick={handleOptimize}
                  disabled={isLoading || !inputText.trim()}
                  whileHover={!isLoading && inputText.trim() ? { scale: 1.05, backgroundColor: 'var(--color-bg-button-hover)' } : {}}
                  whileTap={!isLoading && inputText.trim() ? { scale: 0.95 } : {}}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      优化中...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="optimize-icon" />
                      优化语法
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InputSection;