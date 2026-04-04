import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Sparkles, MoreHorizontal, Undo2, CheckCircle } from 'lucide-react';
import { Profile, VibeSyncResult, GlowResult } from '@/types';
import { VibeSync } from './VibeSync';
import { BandwidthStatusPill } from './BandwidthStatus';
import { LikePanel } from './LikePanel';
import { ProfileInfoPane } from './ProfileInfoPane';

interface ProfileCardProps {
  profile: Profile;
  vibeSync: VibeSyncResult;
  glowResults: GlowResult;
  likesRemaining: number;
  rosesRemaining: number;
  isPaid: boolean;
  onLike: (params: {
    targetType: 'photo' | 'prompt';
    targetIndex: number;
    message?: string;
    isRose?: boolean;
    isPriority?: boolean;
  }) => boolean;
  onSkip: () => void;
  onGoBack: () => void;
}

export function ProfileCard({
  profile,
  vibeSync,
  glowResults,
  likesRemaining,
  rosesRemaining,
  isPaid,
  onLike,
  onSkip,
  onGoBack,
}: ProfileCardProps) {
  const [selectedTarget, setSelectedTarget] = useState<{
    type: 'photo' | 'prompt';
    index: number;
  } | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const isPromptGlowing = (promptId: string) => {
    return glowResults.promptGlows[promptId]?.glow ?? false;
  };

  const isPhotoGlowing = (index: number) => {
    return glowResults.photoGlows[index]?.glow ?? false;
  };

  const getGhostText = () => {
    if (!selectedTarget || selectedTarget.type !== 'prompt') return undefined;
    const prompt = profile.prompts[selectedTarget.index];
    if (!prompt) return undefined;
    if (isPromptGlowing(prompt.id)) {
      return glowResults.promptGlows[prompt.id]?.ghostText || prompt.bridgeGhostText;
    }
    return undefined;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={profile.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="pb-24 relative"
      >
        {/* Name, gender, badges, and actions — above the image */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between gap-2">
            {/* Left: name + gender */}
            <div className="min-w-0 flex-shrink-0">
              <div className="flex items-center gap-2">
                <h1 className="font-hinge-serif text-2xl font-semibold text-foreground">{profile.name}</h1>
                {profile.activityTag && <ActivityTag tag={profile.activityTag} />}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">
                  {profile.gender?.toLowerCase() === 'female' ? 'she/her' : profile.gender?.toLowerCase() === 'male' ? 'he/him' : profile.gender}
                </span>
                {profile.verified && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold" style={{ color: '#4C1D95' }}>
                    <CheckCircle size={12} fill="#4C1D95" stroke="white" strokeWidth={3} />
                    Verified
                  </span>
                )}
              </div>
            </div>
            {/* Center: badges */}
            <div className="flex flex-col items-center gap-1 flex-1">
              {profile.bandwidthStatus && profile.bandwidthVisible && <BandwidthStatusPill status={profile.bandwidthStatus} isPaid={isPaid} />}
              {profile.showVibeSync && profile.vibeSyncVisible && vibeSync.hasSync && <VibeSync result={vibeSync} isPaid={isPaid} />}
            </div>
            {/* Right: back arrow + dots */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  if (isPaid) {
                    onGoBack();
                  } else {
                    setShowUpgradeModal(true);
                  }
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Undo2 size={20} className="text-muted-foreground" />
              </button>
              <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                <MoreHorizontal size={20} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Upgrade Modal */}
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
                className="bg-card rounded-2xl p-6 mx-6 max-w-sm w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="font-hinge-serif text-xl font-semibold text-foreground mb-2">Go back to a profile?</h2>
                <p className="text-sm text-muted-foreground mb-5">Upgrade to revisit profiles you've already seen.</p>
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

        {/* Profile Photo - Hero */}
        {profile.photos.length > 0 && (
          <div className="px-4 pb-2">
            <div className={isPhotoGlowing(0) ? 'rose-glow-shimmer' : ''}>
              <div className="relative rounded-2xl overflow-hidden">
                <img src={profile.photos[0].url} alt={profile.name} className="w-full aspect-[3/4] object-cover" loading="lazy" />
                {isPhotoGlowing(0) && glowResults.photoGlows[0]?.sharedTags.length > 0 && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <Sparkles size={14} className="text-hinge-gold" />
                    <span className="text-[11px] font-medium text-hinge-orange">You both love: {glowResults.photoGlows[0]?.sharedTags.join(', ')}</span>
                  </div>
                )}
                <button onClick={(e) => { e.stopPropagation(); setSelectedTarget({ type: 'photo', index: 0 }); }}
                  className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-card transition-colors">
                  <Heart size={20} strokeWidth={2.5} className="text-foreground" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Interleaved photos, prompts, and info pane */}
        <div className="space-y-3 px-4">
          {(() => {
            const items: React.ReactNode[] = [];
            const remainingPhotos = profile.photos.slice(1);
            const prompts = profile.prompts;
            let photoIdx = 0;
            let promptIdx = 0;
            let infoPaneInserted = false;
            const insertInfoPaneAfterIndex = Math.min(1, prompts.length);

            while (promptIdx < prompts.length || photoIdx < remainingPhotos.length) {
              if (promptIdx < prompts.length) {
                const prompt = prompts[promptIdx];
                const pi = promptIdx;
                items.push(
                  <PromptCard key={prompt.id} prompt={prompt}
                    isGlowing={isPromptGlowing(prompt.id)}
                    sharedInterests={glowResults.promptGlows[prompt.id]?.sharedInterests || []}
                    onLike={() => setSelectedTarget({ type: 'prompt', index: pi })}
                  />
                );
                promptIdx++;
                
                // Insert info pane after specified prompt
                if (!infoPaneInserted && promptIdx > insertInfoPaneAfterIndex && profile.vitals) {
                  items.push(
                    <div key="info-pane" className="mt-3">
                      <ProfileInfoPane vitals={profile.vitals} />
                    </div>
                  );
                  infoPaneInserted = true;
                }
              }
              if (photoIdx < remainingPhotos.length) {
                const actualPhotoIndex = photoIdx + 1;
                const pi = actualPhotoIndex;
                items.push(
                  <div key={`photo-${pi}`}
                    className={`mt-3 ${isPhotoGlowing(pi) ? 'rose-glow-shimmer' : ''}`}
                  >
                    <div className="relative rounded-2xl overflow-hidden">
                      <img src={remainingPhotos[photoIdx].url} alt={`${profile.name} photo ${pi + 1}`}
                        className="w-full aspect-[3/4] object-cover" loading="lazy" />
                      {isPhotoGlowing(pi) && glowResults.photoGlows[pi]?.sharedTags.length > 0 && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                          <Sparkles size={14} className="text-hinge-gold" />
                          <span className="text-[11px] font-medium text-hinge-orange">You both love: {glowResults.photoGlows[pi]?.sharedTags.join(', ')}</span>
                        </div>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); setSelectedTarget({ type: 'photo', index: pi }); }}
                        className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-card transition-colors">
                        <Heart size={20} strokeWidth={2.5} className="text-foreground" />
                      </button>
                    </div>
                  </div>
                );
                photoIdx++;
              }
            }
            return items;
          })()}
        </div>

        {/* Skip button - fixed left, just above bottom nav */}
        <div className="fixed bottom-[72px] left-0 z-30 max-w-md mx-auto w-full pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          <div className="pointer-events-auto pl-3">
            <button
              onClick={onSkip}
              className="w-11 h-11 rounded-full border-2 border-border bg-background shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X size={22} strokeWidth={3} className="text-foreground" />
            </button>
          </div>
        </div>

        {/* Like Panel */}
        <AnimatePresence>
          {selectedTarget && (
            <LikePanel
              ghostText={getGhostText()}
              rosesRemaining={rosesRemaining}
              onSend={(message, isRose, isPriority) => {
                const success = onLike({
                  targetType: selectedTarget.type,
                  targetIndex: selectedTarget.index,
                  message: message || undefined,
                  isRose,
                  isPriority,
                });
                if (success) setSelectedTarget(null);
              }}
              onCancel={() => setSelectedTarget(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

function PromptCard({
  prompt,
  isGlowing,
  sharedInterests,
  onLike,
}: {
  prompt: { id: string; question: string; answer: string };
  isGlowing: boolean;
  sharedInterests: string[];
  onLike: () => void;
}) {
  return (
    <div className="mt-3 relative">
      <div className={`bg-card rounded-2xl p-5 relative border border-border shadow-sm ${isGlowing ? 'rose-glow-prompt' : ''}`}>
        {isGlowing && (
          <>
            <span className="rose-glow-star">✦</span>
            <span className="rose-glow-star">✦</span>
            <span className="rose-glow-star">✦</span>
            <span className="rose-glow-star">✦</span>
            <span className="rose-glow-star">✦</span>
            <span className="rose-glow-star">✦</span>
          </>
        )}
        {isGlowing && sharedInterests.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={14} className="text-hinge-gold" />
            <span className="text-[11px] font-medium text-hinge-orange">
              You both love: {sharedInterests.join(', ')}
            </span>
          </div>
        )}
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          {prompt.question}
        </p>
        <p className="text-foreground font-hinge-serif text-lg leading-relaxed">{prompt.answer}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="absolute bottom-3 right-3 bg-muted rounded-full p-2 hover:bg-accent transition-colors"
        >
          <Heart size={18} strokeWidth={2.5} className="text-foreground" />
        </button>
      </div>
    </div>
  );
}

function ActivityTag({ tag }: { tag: 'active_now' | 'new_user' | 'active_today' }) {
  if (tag === 'active_now') {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-muted-foreground">
        <span className="w-1 h-1 rounded-full bg-green-500" />
        Active Now
      </span>
    );
  }
  const label = tag === 'new_user' ? 'New User' : 'Active Today';
  return (
    <span className="inline-flex items-center bg-purple-900 text-white rounded-full px-1.5 py-px text-[8px] font-bold">
      {label}
    </span>
  );
}
