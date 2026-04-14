import { motion } from 'framer-motion';

interface LikeWithoutMessageSheetProps {
  onAddNote: () => void;
  onSkip: () => void;
}

export function LikeWithoutMessageSheet({ onAddNote, onSkip }: LikeWithoutMessageSheetProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onSkip}
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
        <h3 className="font-hinge-serif text-lg font-semibold text-foreground mb-2">Add a note?</h3>
        <p className="text-sm text-muted-foreground mb-5">
          Likes with a message get more replies.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors"
          >
            Skip
          </button>
          <button
            onClick={onAddNote}
            className="flex-1 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Add Note
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
