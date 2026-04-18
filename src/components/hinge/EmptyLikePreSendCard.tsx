import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { EmptyLikeSuggestion } from '@/lib/messageCoach';

interface EmptyLikePreSendCardProps {
  suggestion: EmptyLikeSuggestion;
  onAddMessage: () => void;
  onSkip: () => void;
}

export function EmptyLikePreSendCard({ suggestion, onAddMessage, onSkip }: EmptyLikePreSendCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3"
    >
      <div className="flex items-start gap-2">
        <Sparkles size={16} className="text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug">
            {suggestion.headline}
          </p>
          {suggestion.detail && (
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
              {suggestion.detail}
            </p>
          )}
        </div>
      </div>

      {suggestion.starters.length > 0 && (
        <ul className="space-y-1.5 pl-1">
          {suggestion.starters.map((starter, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] text-foreground/85 leading-snug">
              <ArrowRight size={12} className="text-primary/70 shrink-0 mt-0.5" />
              <span>{starter}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onSkip}
          className="flex-1 py-2 rounded-full border border-border text-foreground text-xs font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-1"
        >
          <X size={12} />
          Skip, send like
        </button>
        <button
          onClick={onAddMessage}
          className="flex-1 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          Add a message
        </button>
      </div>
    </motion.div>
  );
}
