import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Tooltip.css';

interface TooltipProps {
  visible: boolean;
  text: string;
  x: number;
  y: number;
}

const Tooltip: FC<TooltipProps> = ({ visible, text, x, y }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="custom-tooltip"
          style={{ 
            left: `${x}px`, 
            top: `${y}px`
          }}
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {text}
          <motion.div 
            className="tooltip-arrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Tooltip;