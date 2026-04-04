import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface LikePanelProps {
  ghostText?: string;
  rosesRemaining: number;
  onSend: (message: string, isRose: boolean, isPriority: boolean) => void;
  onCancel: () => void;
}

export function LikePanel({ ghostText, rosesRemaining, onSend, onCancel }: LikePanelProps) {
  const [message, setMessage] = useState('');
  const maxWords = 50;

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0;

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
            placeholder={ghostText || 'Add a comment...'}
            className="w-full bg-muted rounded-xl p-4 text-foreground placeholder:text-muted-foreground/50 resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground">
            {wordCount}/{maxWords}
          </span>
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
