import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BandwidthStatus as BandwidthType } from '@/types';

const statusConfig: Record<BandwidthType, { label: string; color: string; freeDesc: string; paidDesc: string }> = {
  ready: {
    label: 'Ready to Connect',
    color: 'bg-purple-900 text-white',
    freeDesc: 'Open & active today',
    paidDesc: 'Has <3 active chats and was active today',
  },
  focusing: {
    label: 'Focusing on Matches',
    color: 'bg-purple-900 text-white',
    freeDesc: 'Busy with other chats',
    paidDesc: 'In deep conversations with current matches right now',
  },
  weekend: {
    label: 'Weekend Spark ✨',
    color: 'bg-purple-900 text-white',
    freeDesc: 'More active on weekends',
    paidDesc: 'Active but hasn\'t started a new chat in 48-72 hours',
  },
  new_vibes: {
    label: 'Open to New Vibes',
    color: 'bg-purple-900 text-white',
    freeDesc: 'New & ready to meet',
    paidDesc: 'New user or empty queue — wide open for connections',
  },
};

interface BandwidthStatusProps {
  status: BandwidthType;
  isPaid?: boolean;
}

export function BandwidthStatusPill({ status, isPaid = false }: BandwidthStatusProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = statusConfig[status];

  const dismiss = useCallback(() => setShowTooltip(false), []);

  useEffect(() => {
    if (!showTooltip) return;
    const timer = setTimeout(dismiss, 2000);
    return () => clearTimeout(timer);
  }, [showTooltip, dismiss]);

  const description = isPaid ? config.paidDesc : config.freeDesc;

  return (
    <div className="relative" onClick={dismiss}>
      <button
        onClick={(e) => { e.stopPropagation(); setShowTooltip((v) => !v); }}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${config.color}`}
      >
        {/* Person silhouette with signal waves */}
        <svg width="14" height="12" viewBox="0 0 18 14" fill="none" className="shrink-0">
          {/* Small person dot */}
          <circle cx="6" cy="5" r="2" fill="white" />
          <path d="M3 11C3 8.8 4.3 7.5 6 7.5C7.7 7.5 9 8.8 9 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          {/* Radiating arcs */}
          <path d="M11 7C12 5.8 12 4.2 11 3" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M13.5 8.5C15 6.5 15 3.5 13.5 1.5" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35" />
        </svg>
        {config.label}
      </button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            onClick={dismiss}
            className="absolute top-full left-0 mt-1.5 bg-foreground text-background text-[11px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap z-50 shadow-lg cursor-pointer"
          >
            <span className="text-[9px] uppercase tracking-wider opacity-60 block mb-0.5">Bandwidth</span>
            {description}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-foreground rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
