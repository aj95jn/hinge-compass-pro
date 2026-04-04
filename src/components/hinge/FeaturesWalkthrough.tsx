import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Heart, Undo2, Crown } from 'lucide-react';
import { BandwidthStatus } from '@/types';

interface FeaturesWalkthroughProps {
  isPaid: boolean;
  bandwidthVisible?: boolean;
  bandwidthStatus?: BandwidthStatus;
  onToggleBandwidthVisible?: (visible: boolean) => void;
  onUpdateBandwidth?: (status: BandwidthStatus) => void;
}

/* Matching the interlocking-circles icon from VibeSync.tsx */
function VibeSyncIcon({ size = 28 }: { size?: number }) {
  const r = size * 0.22;
  const cx1 = size * 0.38;
  const cx2 = size * 0.62;
  const cy = size * 0.5;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={cx1} cy={cy} r={r} stroke="currentColor" strokeWidth={size * 0.08} fill="none" />
      <circle cx={cx2} cy={cy} r={r} stroke="currentColor" strokeWidth={size * 0.08} fill="none" />
    </svg>
  );
}

/* Matching the person-with-signal-waves SVG from BandwidthStatus.tsx */
function BandwidthIcon({ size = 28 }: { size?: number }) {
  const scale = size / 18;
  return (
    <svg width={size} height={size} viewBox="0 0 18 14" fill="none">
      <circle cx="6" cy="5" r={2 * scale * 0.6} fill="currentColor" />
      <path d={`M3 11C3 8.8 4.3 7.5 6 7.5C7.7 7.5 9 8.8 9 11`} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M11 7C12 5.8 12 4.2 11 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M13.5 8.5C15 6.5 15 3.5 13.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35" />
    </svg>
  );
}

const FEATURES = [
  {
    id: 'vibe-sync',
    title: 'Vibe Sync',
    icon: (
      <span className="text-purple-300">
        <VibeSyncIcon size={28} />
      </span>
    ),
    freeTag: '',
    paidTag: 'FULL ACCESS',
    visual: (isPaid: boolean) => (
      <div className="flex flex-col items-center gap-3">
        {/* Why Vibe Sync */}
        <p className="text-[11px] text-muted-foreground text-center max-w-[240px] mb-1">
          Vibe Sync analyzes how you and a match communicate — reply speed, message length, and shared values.
        </p>

        {/* Example badges — centered, styled like real purple pills */}
        <div className="flex flex-col items-center gap-5 w-full max-w-[280px]">
          {[
          { label: 'Shared Conversation Style', desc: 'Similar texters' },
            { label: 'Fast-Paced Match', desc: 'Quick replies' },
            { label: 'Both Thoughtful Sharers', desc: 'Deep profile readers' },
            { label: 'Deep Common Ground', desc: 'Shared values' },
          ].map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 * i, type: 'spring' }}
              className="flex flex-col items-center gap-1.5"
            >
              {/* Blinking tooltip box on top */}
              <motion.div
                className="relative bg-foreground rounded-md px-2 py-1 shadow-sm"
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 4, times: [0, 0.1, 0.75, 1], repeat: Infinity, delay: i * 1.5 }}
              >
                <p className="text-[8px] font-medium text-background leading-tight">{badge.desc}</p>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-[3px] w-1.5 h-1.5 bg-foreground rotate-45" />
              </motion.div>
              {/* Badge pill */}
              <div className="inline-flex items-center gap-1.5 bg-purple-900 rounded-full px-3 py-1.5 shadow-[0_2px_8px_-2px_rgba(76,29,149,0.4)]">
                <div className="flex items-center -space-x-0.5">
                  <div className="w-3 h-3 rounded-full border-[1.5px] border-white bg-transparent" />
                  <div className="w-3 h-3 rounded-full border-[1.5px] border-white bg-transparent" />
                </div>
                <span className="text-[10px] font-bold text-white whitespace-nowrap">{badge.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subscribe nudge */}
        {!isPaid && (
          <p className="text-[10px] text-muted-foreground text-center mt-1 italic">
            Subscribe to see more details before swiping.
          </p>
        )}
      </div>
    ),
  },
  {
    id: 'bandwidth',
    title: 'Bandwidth',
    icon: (
      <span className="text-primary">
        <BandwidthIcon size={28} />
      </span>
    ),
    freeTag: '',
    paidTag: '',
    visual: null, // rendered inline with props
  },
  {
    id: 'bridge-builder',
    title: 'Bridge Builder',
    icon: <Sparkles size={28} className="text-hinge-rose" />,
    freeTag: '2 PROFILES',
    paidTag: 'UNLIMITED',
    visual: (isPaid: boolean) => (
      <div className="flex flex-col items-center gap-3">
        {/* Mini prompt with rose glow */}
        <div className="w-full max-w-[220px] relative">
          <motion.div
            initial={{ boxShadow: '0 0 0px 0px hsla(340, 70%, 50%, 0)' }}
            animate={{
              boxShadow: [
                '0 0 10px 2px hsla(340, 70%, 50%, 0.2)',
                '0 0 20px 6px hsla(340, 70%, 50%, 0.4)',
                '0 0 10px 2px hsla(340, 70%, 50%, 0.2)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-card rounded-2xl p-4 border border-border relative overflow-visible"
            style={{ borderColor: 'hsla(340, 70%, 50%, 0.4)' }}
          >
            {/* Shared interest chip */}
            <div className="flex items-center gap-1 mb-2">
              <Sparkles size={11} className="text-hinge-gold" />
              <span className="text-[10px] font-medium text-hinge-orange">You both love: cooking, travel</span>
            </div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              A life goal of mine
            </p>
            <p className="text-foreground font-hinge-serif text-sm leading-relaxed">
              Travel to Japan and learn to cook authentic ramen 🍜
            </p>
            {/* Like button like the real card */}
            <div className="absolute bottom-2.5 right-2.5 bg-muted rounded-full p-1.5">
              <Heart size={14} strokeWidth={2.5} className="text-foreground" />
            </div>
            {/* Floating stars */}
            {['top-1 left-2', 'top-0 right-4', 'bottom-2 left-6', 'bottom-1 right-2', 'top-3 right-1', '-top-1 left-8'].map((pos, i) => (
              <motion.span
                key={i}
                className={`absolute ${pos} text-hinge-rose text-[10px] pointer-events-none`}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.2, 0.7] }}
                transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
              >
                ✦
              </motion.span>
            ))}
          </motion.div>
          {/* Ghost text preview */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-2 bg-muted rounded-xl px-3 py-2"
          >
            <p className="text-[10px] text-muted-foreground italic">
              "I'd love to swap ramen spots — have you tried making it from scratch?"
            </p>
          </motion.div>
        </div>
        <p className="text-[11px] text-muted-foreground text-center max-w-[240px]">
          Prompts glow when you share interests with a profile. The suggested text is a starter idea based on your common interests and preferences.
        </p>
      </div>
    ),
  },
  {
    id: 'effort-insurance',
    title: 'Effort Insurance',
    icon: <Undo2 size={28} className="text-primary" />,
    freeTag: '1 REFUND',
    paidTag: 'UNLIMITED',
    visual: (isPaid: boolean) => (
      <div className="flex flex-col items-center gap-3">
        {/* Refund animation */}
        <div className="w-full max-w-[220px] bg-card rounded-2xl border border-border p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, -20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <Undo2 size={20} className="text-primary" />
            </motion.div>
            <div>
              <p className="text-xs font-semibold text-foreground">Like refunded!</p>
            </div>
          </div>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="h-1 rounded-full bg-primary"
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] text-muted-foreground">Sent</span>
            <span className="text-[9px] text-muted-foreground">3–4 days</span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground text-center max-w-[220px]">
          {isPaid
            ? 'Unlimited refunds. Unread likes are returned automatically after 3–4 days.'
            : 'Get your like back if it goes unread after 3–4 days. Free users get 1 refund per week.'}
        </p>
      </div>
    ),
  },
];

const BANDWIDTH_OPTIONS: { value: BandwidthStatus; label: string; desc: string }[] = [
  { value: 'ready', label: 'Ready to Connect', desc: 'Open & active' },
  { value: 'focusing', label: 'Focusing on Matches', desc: 'Currently busy' },
  { value: 'weekend', label: 'Weekend Spark ✨', desc: 'Weekend only' },
  { value: 'new_vibes', label: 'Open to New Vibes', desc: 'Exploring' },
];

export function FeaturesWalkthrough({ isPaid, bandwidthVisible = false, bandwidthStatus, onToggleBandwidthVisible, onUpdateBandwidth }: FeaturesWalkthroughProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const feature = FEATURES[currentIndex];

  const goTo = (next: number) => {
    setDirection(next > currentIndex ? 1 : -1);
    setCurrentIndex(next);
  };

  const prev = () => goTo((currentIndex - 1 + FEATURES.length) % FEATURES.length);
  const next = () => goTo((currentIndex + 1) % FEATURES.length);

  const renderBandwidthVisual = () => (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Explanation */}
      <p className="text-[11px] text-muted-foreground text-center max-w-[240px] mb-1">
        Shows how available someone is to chat — set yours and see others' at a glance.
      </p>

      {/* Example badges with tooltips — same style as Vibe Sync */}
      <div className="flex flex-col items-center gap-5 w-full max-w-[280px]">
        {[
          { label: 'Ready to Connect', desc: 'Open & active today' },
          { label: 'Focusing on Matches', desc: 'Busy with other chats' },
          { label: 'Weekend Spark ✨', desc: 'More active on weekends' },
          { label: 'Open to New Vibes', desc: 'New & ready to meet' },
        ].map((badge, i) => (
          <motion.div
            key={badge.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 * i, type: 'spring' }}
            className="flex flex-col items-center gap-1.5"
          >
            {/* Blinking tooltip box on top */}
            <motion.div
              className="relative bg-foreground rounded-md px-2 py-1 shadow-sm"
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 4, times: [0, 0.1, 0.75, 1], repeat: Infinity, delay: i * 1.5 }}
            >
              <p className="text-[8px] font-medium text-background leading-tight">{badge.desc}</p>
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-[3px] w-1.5 h-1.5 bg-foreground rotate-45" />
            </motion.div>
            {/* Badge pill */}
            <div className="inline-flex items-center gap-1.5 bg-purple-900 rounded-full px-3 py-1.5 shadow-[0_2px_8px_-2px_rgba(76,29,149,0.4)]">
              <svg width="14" height="12" viewBox="0 0 18 14" fill="none" className="shrink-0">
                <circle cx="6" cy="5" r="2" fill="white" />
                <path d="M3 11C3 8.8 4.3 7.5 6 7.5C7.7 7.5 9 8.8 9 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <path d="M11 7C12 5.8 12 4.2 11 3" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
                <path d="M13.5 8.5C15 6.5 15 3.5 13.5 1.5" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35" />
              </svg>
              <span className="text-[10px] font-bold text-white whitespace-nowrap">{badge.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nudge to set in profile */}
      <p className="text-[10px] text-muted-foreground text-center mt-1 italic">
        Set your bandwidth status in your Profile tab.
      </p>

    </div>
  );

  return (
    <div className="px-4 pt-2 pb-24">
      {/* Carousel */}
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border min-h-[380px] shadow-[0_4px_20px_-4px_rgba(76,29,149,0.12)]" style={{ background: 'linear-gradient(180deg, hsl(var(--card)) 0%, hsla(270, 30%, 96%, 0.5) 100%)' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={feature.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex flex-col items-center px-6 pt-6 pb-4"
          >
            {/* Icon + Title */}
            <div className="mb-1">{feature.icon}</div>
            <h3 className="font-hinge-serif text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
            {(isPaid ? feature.paidTag : feature.freeTag) && (
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full mb-4 ${
                  isPaid
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isPaid ? feature.paidTag : feature.freeTag}
              </span>
            )}

            {/* Visual Demo */}
            {feature.id === 'bandwidth' ? renderBandwidthVisual() : feature.visual?.(isPaid)}

            {/* Upgrade CTA for free */}
            {!isPaid && feature.id !== 'bandwidth' && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <Crown size={13} />
                {feature.id === 'effort-insurance' ? 'Upgrade for unlimited likes' : feature.id === 'bridge-builder' ? 'Upgrade to get more' : 'Upgrade to unlock'}
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft size={16} className="text-foreground" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight size={16} className="text-foreground" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {FEATURES.map((f, i) => (
          <button
            key={f.id}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex ? 'bg-primary w-5' : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>

      {/* Hinge+/HingeX Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 mx-6 max-w-sm w-full shadow-xl border border-border"
            >
              <h3 className="font-hinge-serif text-xl font-semibold text-foreground text-center mb-2">
                Unlock Premium Features
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-5">
                Get unlimited likes, advanced filters, and more with a subscription.
              </p>
              <div className="flex flex-col gap-2.5">
                <button className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity">
                  Get HingeX
                </button>
                <button className="w-full py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors">
                  Get Hinge+
                </button>
                <button onClick={() => setShowUpgradeModal(false)} className="text-sm text-muted-foreground mt-1">
                  Not now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
