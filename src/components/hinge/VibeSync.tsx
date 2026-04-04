import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VibeSyncResult } from '@/types';
import vibeSyncIcon from '@/assets/vibe-sync-icon.png';

const labelDescriptions: Record<string, { free: string; paid: string }> = {
  'Shared Conversation Style': {
    free: 'You both write longer texts',
    paid: 'You both typically send 3+ sentences per message',
  },
  'Fast-Paced Match': {
    free: 'You both reply fast',
    paid: 'You both typically reply within 2 hours',
  },
  'Both Thoughtful Sharers': {
    free: 'You both read profiles carefully',
    paid: 'You both spend time reading profiles before liking',
  },
  'Deep Common Ground': {
    free: 'You share core values',
    paid: 'High overlap in your core value prompt answers',
  },
};

interface VibeSyncProps {
  result: VibeSyncResult;
  isPaid?: boolean;
}

export function VibeSync({ result, isPaid = false }: VibeSyncProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const descriptions = labelDescriptions[result.label];
  const description = descriptions
    ? (isPaid ? descriptions.paid : descriptions.free)
    : result.label;
  const dismiss = useCallback(() => setShowTooltip(false), []);

  useEffect(() => {
    if (!showTooltip) return;
    const timer = setTimeout(dismiss, 2000);
    return () => clearTimeout(timer);
  }, [showTooltip, dismiss]);

  if (!result.hasSync) return null;

  return (
    <div className="relative" onClick={dismiss}>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => { e.stopPropagation(); setShowTooltip((v) => !v); }}
        className="inline-flex items-center gap-1 bg-purple-900 rounded-full px-2 py-0.5"
      >
        <div className="flex items-center -space-x-0.5">
          <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-white bg-transparent" />
          <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-white bg-transparent" />
        </div>
        <span className="text-[10px] font-bold text-white">{result.label}</span>
        {result.detail && (
          <span className="text-[10px] text-muted-foreground">· {result.detail}</span>
        )}
      </motion.button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            onClick={dismiss}
            className="absolute top-full left-0 mt-1.5 bg-foreground text-background text-[11px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap z-50 shadow-lg cursor-pointer"
          >
            <span className="text-[9px] uppercase tracking-wider opacity-60 block mb-0.5">Vibe Sync</span>
            {description}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-foreground rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
