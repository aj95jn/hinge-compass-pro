import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchCardNudgeProps {
  text: string;
}

export function MatchCardNudge({ text }: MatchCardNudgeProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Loop: show 2s, hide 3.5s, repeat
    const cycle = () => {
      setVisible(true);
      const showTimer = setTimeout(() => {
        setVisible(false);
        const hideTimer = setTimeout(() => cycle(), 3500);
        return () => clearTimeout(hideTimer);
      }, 2000);
      return () => clearTimeout(showTimer);
    };
    const cleanup = cycle();
    return cleanup;
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 2 }}
          transition={{ duration: 0.3 }}
          className="px-3 pb-1.5 -mt-0.5"
        >
          <p className="text-[10px] text-primary font-medium leading-tight">
            {text}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
