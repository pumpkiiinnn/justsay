import { FC } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiClock, FiBookmark } from 'react-icons/fi';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  setShowHistory: (show: boolean) => void;
  setShowSavedRules: (show: boolean) => void;
}

const Header: FC<HeaderProps> = ({ theme, toggleTheme, setShowHistory, setShowSavedRules }) => {
  return (
    <motion.header 
      className="app-header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo">
              <span className="logo-text">JustSay</span>
              <span className="badge">Beta</span>
            </div>
            <span className="subtitle">英文语法优化助手</span>
          </div>
          
          <div className="header-actions">
            <motion.button 
              className="header-button"
              onClick={() => setShowHistory(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="历史记录"
            >
              <FiClock />
            </motion.button>
            
            <motion.button 
              className="header-button"
              onClick={() => setShowSavedRules(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="已保存的规则"
            >
              <FiBookmark />
            </motion.button>
            
            <motion.button 
              className="theme-toggle"
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
            >
              {theme === 'light' ? <FiMoon className="moon-icon" /> : <FiSun className="sun-icon" />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;