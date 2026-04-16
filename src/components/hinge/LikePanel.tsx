import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Lock } from 'lucide-react';
import { Profile } from '@/types';
import { analyzeMessage, shouldShowPreSendWarning, CoachNudge } from '@/lib/messageCoach';
import { MessageCoachNudge } from './MessageCoachNudge';
import { PreSendSheet } from './PreSendSheet';

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
  bridgeUsesRemaining,
  isPaid,
  recipientProfile,
  onSend,
  onCancel,
}: LikePanelProps) {
  const [message, setMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [coachNudge, setCoachNudge] = useState<CoachNudge | null>(null);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgeFiredCount, setNudgeFiredCount] = useState(0);
  const [showPreSend, setShowPreSend] = useState(false);
  const [pendingSend, setPendingSend] = useState<{ isRose: boolean; isPriority: boolean } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stuckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxWords = 50;

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;

  const hasBridge = !!ghostText;
  const isLocked = hasBridge && bridgeUsesRemaining <= 0 && !isPaid;
  const isCoachLocked = bridgeUsesRemaining <= 0 && !isPaid;

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

  // Message Coach: analyze after typing stops — fires on ALL prompts
  const dismissNudge = useCallback(() => setShowNudge(false), []);

  useEffect(() => {
    // Hide nudge while typing
    setShowNudge(false);

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (stuckTimerRef.current) clearTimeout(stuckTimerRef.current);

    if (!message.trim()) {
      setCoachNudge(null);
      return;
    }

    // Fire after user stops typing (800ms debounce)
    typingTimerRef.current = setTimeout(() => {
      if (nudgeFiredCount >= 2) return;

      const nudge = analyzeMessage(message, recipientProfile);
      if (nudge) {
        // Block nudges always show regardless of count
        if (nudge.type === 'block') {
          setCoachNudge(nudge);
          setShowNudge(true);
          return;
        }
        setCoachNudge(nudge);
        setShowNudge(true);
        setNudgeFiredCount(prev => Math.min(prev + 1, 2));

        // Stuck timer: if no typing for 6s after nudge, re-surface once
        stuckTimerRef.current = setTimeout(() => {
          if (nudgeFiredCount < 1) {
            setShowNudge(true);
            setNudgeFiredCount(2);
          }
        }, 6000);
      }
    }, 800);

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (stuckTimerRef.current) clearTimeout(stuckTimerRef.current);
    };
  }, [message, recipientProfile, nudgeFiredCount]);

  const handleAdoptSuggestion = () => {
    if (ghostText && !isLocked) {
      setMessage(ghostText);
    }
  };

  const handleSendAttempt = (isRose: boolean, isPriority: boolean) => {
    // Block nudges cannot be sent
    if (coachNudge && coachNudge.type === 'block' && message.trim()) {
      setShowNudge(true);
      return;
    }
    // Pre-send check: if warning nudge active, show confirmation
    const warning = message.trim() ? shouldShowPreSendWarning(message, recipientProfile) : null;
    if (warning) {
      setPendingSend({ isRose, isPriority });
      setShowPreSend(true);
      return;
    }
    onSend(message, isRose, isPriority);
  };

  const confirmSend = () => {
    if (pendingSend) {
      onSend(message, pendingSend.isRose, pendingSend.isPriority);
    }
    setShowPreSend(false);
    setPendingSend(null);
  };

  return (
    <>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 bg-card border-t border-border rounded-t-3xl p-5 pb-24 z-50 max-w-md mx-auto shadow-xl"
      >
        <div className="space-y-3">
          {/* Message Coach Nudge */}
          <AnimatePresence>
            {showNudge && coachNudge && (
              <MessageCoachNudge
                nudge={coachNudge}
                isLocked={isCoachLocked && coachNudge.type !== 'block'}
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
                  {!message && (
                    <button
                      onClick={handleAdoptSuggestion}
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
                </>
              )}

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
                        <p className="mb-1.5">You've used your 2 free suggestions today.</p>
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
            <button
              onClick={() => handleSendAttempt(true, false)}
              disabled={rosesRemaining <= 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-hinge-rose/10 text-hinge-rose text-sm font-medium disabled:opacity-40 hover:bg-hinge-rose/20 transition-colors"
            >
              <span className="text-base">🌹</span>
              <span>{rosesRemaining}</span>
            </button>

            <button
              onClick={() => handleSendAttempt(false, true)}
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

      {/* Pre-send confirmation sheet */}
      <AnimatePresence>
        {showPreSend && (
          <PreSendSheet
            message={message}
            nudge={coachNudge}
            onConfirm={confirmSend}
            onChange={() => { setShowPreSend(false); setPendingSend(null); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
