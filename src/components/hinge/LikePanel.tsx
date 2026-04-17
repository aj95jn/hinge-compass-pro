import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';
import { Profile } from '@/types';
import { analyzeMessage, generateLikeNudge, CoachNudge } from '@/lib/messageCoach';
import { MessageCoachNudge } from './MessageCoachNudge';

interface LikePanelProps {
  ghostText?: string;
  bridgeExplanation?: string;
  rosesRemaining: number;
  bridgeUsesRemaining: number;
  isPaid: boolean;
  recipientProfile: Profile;
  onSend: (message: string, isRose: boolean, isPriority: boolean) => void;
  onCancel: () => void;
}

export function LikePanel({
  ghostText,
  bridgeExplanation,
  rosesRemaining,
  isPaid,
  recipientProfile,
  onSend,
  onCancel,
}: LikePanelProps) {
  const [message, setMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [coachNudge, setCoachNudge] = useState<CoachNudge | null>(null);
  const [showNudge, setShowNudge] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxWords = 50;

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;

  // Note: no blanket "add a note" banner shown on blank message.
  // Coaching nudges only appear once the user has written content,
  // so feedback is always specific to what they wrote — never generic.

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

  useEffect(() => {
    if (message.length > 0) setShowTooltip(false);
  }, [message]);

  // Message Coach: analyze after typing stops — fires on every prompt
  useEffect(() => {
    setShowNudge(false);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    if (!message.trim()) {
      setCoachNudge(null);
      return;
    }

    typingTimerRef.current = setTimeout(() => {
      const nudge = analyzeMessage(message, recipientProfile);
      if (nudge) {
        setCoachNudge(nudge);
        setShowNudge(true);
      }
    }, 600);

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [message, recipientProfile]);

  const dismissNudge = useCallback(() => setShowNudge(false), []);

  // Fix 3: never block — always allow send
  const handleSend = (isRose: boolean, isPriority: boolean) => {
    onSend(message, isRose, isPriority);
  };

  // Inline nudge: only shown after the user has written something.
  // No generic banner on blank — Send Like remains tappable regardless.
  const inlineNudge: CoachNudge | null = message.trim() && showNudge ? coachNudge : null;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 bg-card border-t border-border rounded-t-3xl p-5 pb-24 z-50 max-w-md mx-auto shadow-xl"
    >
      <div className="space-y-3">
        {/* Inline coaching nudge (pre-send only) */}
        <AnimatePresence>
          {inlineNudge && (
            <MessageCoachNudge
              key={inlineNudge.text}
              nudge={inlineNudge}
              onDismiss={dismissNudge}
            />
          )}
        </AnimatePresence>

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
            placeholder={ghostText || 'Add a comment...'}
            className="w-full bg-muted rounded-xl p-4 pr-10 text-foreground resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50"
          />

          <span className="absolute bottom-2 left-3 text-[10px] text-muted-foreground">
            {wordCount}/{maxWords}
          </span>

          {/* Bridge tooltip icon (when ghost text is present) */}
          {ghostText && (
            <div className="absolute bottom-2 right-3 flex items-center gap-1.5">
              {!message && (
                <button
                  onClick={() => setMessage(ghostText)}
                  className="text-[10px] text-primary/70 hover:text-primary font-medium transition-colors"
                >
                  Use
                </button>
              )}
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
                        <div className="absolute -bottom-[13px] right-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-foreground" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons — always tappable */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSend(true, false)}
            disabled={rosesRemaining <= 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-hinge-rose/10 text-hinge-rose text-sm font-medium disabled:opacity-40 hover:bg-hinge-rose/20 transition-colors"
          >
            <span className="text-base">🌹</span>
            <span>{rosesRemaining}</span>
          </button>

          <button
            onClick={() => handleSend(false, true)}
            className="flex-1 bg-primary text-primary-foreground rounded-full py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Send Like
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
