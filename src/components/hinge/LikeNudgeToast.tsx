import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LikeNudgeToastProps {
  text: string;
  onDismiss: () => void;
}

export function LikeNudgeToast({ text, onDismiss }: LikeNudgeToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-20 inset-x-0 z-50 max-w-md mx-auto px-4"
    >
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg">
        <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}
