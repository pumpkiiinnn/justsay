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
            '--tooltip-x': `${x}px`, 
            '--tooltip-y': `${y}px`
          } as React.CSSProperties}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
        >
          <div className="tooltip-content">
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Tooltip;