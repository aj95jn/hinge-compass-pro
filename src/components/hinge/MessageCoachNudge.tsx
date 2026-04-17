import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Lock, ShieldAlert } from 'lucide-react';
import { CoachNudge, NudgeType } from '@/lib/messageCoach';

interface MessageCoachNudgeProps {
  nudge: CoachNudge;
  isLocked?: boolean;
  onDismiss: () => void;
}

const accentColors: Record<NudgeType, { bg: string; border: string; icon: string }> = {
  positive: { bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800', icon: 'text-green-600 dark:text-green-400' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', icon: 'text-amber-600 dark:text-amber-400' },
  tone: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', icon: 'text-blue-600 dark:text-blue-400' },
  block: { bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', icon: 'text-red-600 dark:text-red-400' },
};

export function MessageCoachNudge({ nudge, isLocked, onDismiss }: MessageCoachNudgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const colors = accentColors[nudge.type];

  // Post-write nudges persist until the user edits the message.
  // Dismissal happens via the X button or when the parent detects message edits.

  // Close tooltip on outside click
  useEffect(() => {
    if (!showTooltip) return;
    const handler = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showTooltip]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl border px-3 py-2 flex items-start gap-2 ${colors.bg} ${colors.border}`}
    >
      {nudge.type === 'block' && (
        <ShieldAlert size={14} className={`${colors.icon} shrink-0 mt-0.5`} />
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium leading-snug ${isLocked ? 'line-clamp-1' : ''}`}>
          {isLocked ? (
            <span className="flex items-center gap-1.5 text-muted-foreground/60">
              <Lock size={11} className="shrink-0" />
              <span className="truncate">{nudge.text.slice(0, 28)}...</span>
            </span>
          ) : (
            nudge.text
          )}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {/* Info icon */}
        {!isLocked && nudge.type !== 'block' && (
          <div className="relative" ref={tooltipRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowTooltip(v => !v); }}
              className="p-0.5 rounded-full hover:bg-accent transition-colors"
            >
              <Info size={13} className={colors.icon} />
            </button>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-7 right-0 w-52 bg-foreground text-background text-[11px] leading-relaxed rounded-lg px-3 py-2.5 shadow-lg z-20"
                >
                  {nudge.explanation}
                  <div className="absolute -bottom-[6px] right-2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Locked: upgrade CTA */}
        {isLocked && (
          <button className="text-[9px] text-primary font-semibold hover:underline whitespace-nowrap">
            Upgrade
          </button>
        )}

        {/* Dismiss (not for blocks) */}
        {nudge.type !== 'block' && (
          <button onClick={onDismiss} className="p-0.5 rounded-full hover:bg-accent transition-colors">
            <X size={13} className="text-muted-foreground" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
