import { motion } from 'framer-motion';
import { CoachNudge } from '@/lib/messageCoach';
import { MessageCoachNudge } from './MessageCoachNudge';

interface PreSendSheetProps {
  message: string;
  nudge: CoachNudge | null;
  onConfirm: () => void;
  onChange: () => void;
}

export function PreSendSheet({ message, nudge, onConfirm, onChange }: PreSendSheetProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onChange}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="w-full max-w-md bg-card rounded-t-3xl p-6 pb-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-muted-foreground/20 rounded-full mx-auto mb-5" />
        <h3 className="font-hinge-serif text-lg font-semibold text-foreground mb-3">Review your message</h3>
        
        {/* Message preview */}
        <div className="bg-muted rounded-xl p-4 mb-4">
          <p className="text-sm text-foreground leading-relaxed">{message}</p>
        </div>

        {/* Active nudge */}
        {nudge && (
          <div className="mb-4">
            <MessageCoachNudge nudge={nudge} onDismiss={() => {}} />
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onConfirm}
            className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Confirm and Send
          </button>
          <button
            onClick={onChange}
            className="w-full py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors"
          >
            Make a Change
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
