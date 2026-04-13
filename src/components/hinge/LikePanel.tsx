import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Lock } from 'lucide-react';

interface LikePanelProps {
  ghostText?: string;
  bridgeExplanation?: string;
  rosesRemaining: number;
  bridgeUsesRemaining: number;
  isPaid: boolean;
  onSend: (message: string, isRose: boolean, isPriority: boolean) => void;
  onCancel: () => void;
}

export function LikePanel({
  ghostText,
  bridgeExplanation,
  rosesRemaining,
  bridgeUsesRemaining,
  isPaid,
  onSend,
  onCancel,
}: LikePanelProps) {
  const [message, setMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const maxWords = 50;

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;

  const hasBridge = !!ghostText;
  const isLocked = hasBridge && bridgeUsesRemaining <= 0 && !isPaid;

  // Truncate ghost text for locked state
  const displayPlaceholder = (() => {
    if (!ghostText) return 'Add a comment...';
    if (isLocked) {
      const truncated = ghostText.length > 24 ? ghostText.slice(0, 24) + '...' : ghostText;
      return truncated;
    }
    return ghostText;
  })();

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

  // Hide tooltip when user starts typing
  useEffect(() => {
    if (message.length > 0) setShowTooltip(false);
  }, [message]);

  const handleAdoptSuggestion = () => {
    if (ghostText && !isLocked) {
      setMessage(ghostText);
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 bg-card border-t border-border rounded-t-3xl p-5 pb-24 z-50 max-w-md mx-auto shadow-xl"
    >
      <div className="space-y-4">
        {/* Message Input */}
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => {
              const words = e.target.value.trim().split(/\s+/);
              if (words.length <= maxWords || e.target.value.length < message.length) {
                setMessage(e.target.value);
              }
            }}
            placeholder={displayPlaceholder}
            className={`w-full bg-muted rounded-xl p-4 pr-10 text-foreground resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              isLocked
                ? 'placeholder:text-muted-foreground/30'
                : 'placeholder:text-muted-foreground/50'
            }`}
          />

          {/* Word count */}
          <span className="absolute bottom-2 left-3 text-[10px] text-muted-foreground">
            {wordCount}/{maxWords}
          </span>

          {/* Bottom-right icon area */}
          <div className="absolute bottom-2 right-3 flex items-center gap-1.5">
            {hasBridge && !isLocked && (
              <>
                {/* Adopt suggestion button — only when textarea is empty */}
                {!message && (
                  <button
                    onClick={handleAdoptSuggestion}
                    className="text-[10px] text-primary/70 hover:text-primary font-medium transition-colors"
                  >
                    Use
                  </button>
                )}
                {/* Info icon */}
                <div className="relative" ref={tooltipRef}>
                  <button
                    onClick={() => setShowTooltip((v) => !v)}
                    onMouseEnter={() => setShowTooltip(true)}
                    className="p-0.5 rounded-full hover:bg-accent transition-colors"
                  >
                    <Info size={14} className="text-muted-foreground/60" />
                  </button>
                  <AnimatePresence>
                    {showTooltip && bridgeExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-7 right-0 w-56 bg-foreground text-background text-[11px] leading-relaxed rounded-lg px-3 py-2.5 shadow-lg z-10"
                      >
                        <div className="relative">
                          {bridgeExplanation}
                          {/* Arrow */}
                          <div className="absolute -bottom-[13px] right-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-foreground" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* Locked state */}
            {isLocked && (
              <div className="relative" ref={tooltipRef}>
                <button
                  onClick={() => setShowTooltip((v) => !v)}
                  className="p-0.5 rounded-full"
                >
                  <Lock size={14} className="text-muted-foreground/40" />
                </button>
                <AnimatePresence>
                  {showTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-7 right-0 w-52 bg-foreground text-background text-[11px] leading-relaxed rounded-lg px-3 py-2.5 shadow-lg z-10"
                    >
                      <p className="mb-1.5">You've used your 2 free Bridge Builder suggestions today.</p>
                      <button className="text-primary-foreground bg-primary/90 rounded-md px-2 py-1 text-[10px] font-semibold hover:bg-primary transition-colors">
                        Upgrade for unlimited
                      </button>
                      <div className="absolute -bottom-[13px] right-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {/* Rose button */}
          <button
            onClick={() => onSend(message, true, false)}
            disabled={rosesRemaining <= 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-hinge-rose/10 text-hinge-rose text-sm font-medium disabled:opacity-40 hover:bg-hinge-rose/20 transition-colors"
          >
            <span className="text-base">🌹</span>
            <span>{rosesRemaining}</span>
          </button>

          {/* Send Priority Like */}
          <button
            onClick={() => onSend(message, false, true)}
            className="flex-1 bg-primary text-primary-foreground rounded-full py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Send Priority Like ⚡
          </button>
        </div>

        {/* Cancel */}
        <div className="flex justify-center">
          <button
            onClick={onCancel}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
