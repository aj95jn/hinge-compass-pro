import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';

interface RefundPopupProps {
  profileName: string;
  likeTimestamp: number;
  onClose: () => void;
}

export function RefundPopup({ profileName, likeTimestamp, onClose }: RefundPopupProps) {
  const [held, setHeld] = useState(false);
  const y = useMotionValue(-120);
  const opacity = useTransform(y, [-120, 0], [0, 1]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startDismissTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!held) {
        animate(y, -120, { duration: 0.3 }).then(onClose);
      }
    }, 3000);
  };

  useEffect(() => {
    // Slide in
    animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
    startDismissTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y < -30) {
      // Swiped up — dismiss
      animate(y, -120, { duration: 0.2 }).then(onClose);
    } else if (info.offset.y > 20) {
      // Pulled down — keep visible, mark as held
      setHeld(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
    } else {
      // Snap back
      animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
      if (!held) startDismissTimer();
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pt-3 pointer-events-none max-w-md mx-auto"
      style={{ y, opacity }}
    >
      <motion.div
        drag="y"
        dragConstraints={{ top: -10, bottom: 20 }}
        dragElastic={0.3}
        onDragEnd={handleDragEnd}
        className="pointer-events-auto bg-muted rounded-2xl px-5 py-4 shadow-lg w-full cursor-grab active:cursor-grabbing"
      >
        <div className="w-8 h-1 bg-border rounded-full mx-auto mb-3" />
        <p className="text-sm text-muted-foreground leading-relaxed text-center">
          {profileName} stayed busy, so we've returned your Like
          <span className="block text-xs text-muted-foreground/70 mt-1">
            sent {new Date(likeTimestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(likeTimestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}
