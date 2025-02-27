import { FC } from 'react';
import { motion } from 'framer-motion';
import { FiGlobe } from 'react-icons/fi';

const Footer: FC = () => {
  return (
    <motion.footer 
      className="app-footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="container">
        <div className="footer-content">
          <motion.div 
            className="footer-logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <FiGlobe className="globe-icon" />
            <span>2025 JustSay - 英文语法优化助手</span>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;