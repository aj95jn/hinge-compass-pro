import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppState } from '@/hooks/useAppState';
import { BottomNav } from '@/components/hinge/BottomNav';
import { ProfileCard } from '@/components/hinge/ProfileCard';
import { LikesYouScreen } from '@/components/hinge/LikesYouScreen';
import { MessagingScreen } from '@/components/hinge/MessagingScreen';
import { StandoutsScreen } from '@/components/hinge/StandoutsScreen';
import { standoutProfiles } from '@/data/standoutsData';
import { UserProfileScreen } from '@/components/hinge/UserProfileScreen';
import { RefundPopup } from '@/components/hinge/RefundPopup';
import { Heart, SlidersHorizontal, ChevronDown, X, Zap } from 'lucide-react';

// Filter options
const AGE_OPTIONS = Array.from({ length: 43 }, (_, i) => i + 18); // 18-60
const HEIGHT_OPTIONS = [
  "4'10\" (147 cm)", "4'11\" (150 cm)", "5'0\" (152 cm)", "5'1\" (155 cm)",
  "5'2\" (157 cm)", "5'3\" (160 cm)", "5'4\" (163 cm)", "5'5\" (165 cm)",
  "5'6\" (168 cm)", "5'7\" (170 cm)", "5'8\" (173 cm)", "5'9\" (175 cm)",
  "5'10\" (178 cm)", "5'11\" (180 cm)", "6'0\" (183 cm)", "6'1\" (185 cm)",
  "6'2\" (188 cm)", "6'3\" (191 cm)", "6'4\" (193 cm)", "6'5\" (196 cm)",
  "6'6\" (198 cm)",
];
const DATING_INTENTIONS = [
  'Long-term relationship',
  'Short-term relationship',
  'Life partner',
  'Figuring out my dating goals',
  'Open to anything',
  'Marriage',
  'Casual dating',
];

type FilterKey = 'age' | 'height' | 'intentions';

const Index = () => {
  const state = useAppState();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [filters, setFilters] = useState<{
    age: { min: number; max: number } | null;
    height: { min: string; max: string } | null;
    intentions: string[];
  }>({ age: null, height: null, intentions: [] });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [hasSeenWhatsNew, setHasSeenWhatsNew] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const whatsNewIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const likesSincePopupRef = useRef(0);
  const hasSeenRef = useRef(false);

  // Stop popup forever once user views "What's New" tab in profile
  const markWhatsNewSeen = useCallback(() => {
    hasSeenRef.current = true;
    setHasSeenWhatsNew(true);
    setShowWhatsNew(false);
    if (whatsNewIntervalRef.current) {
      clearInterval(whatsNewIntervalRef.current);
      whatsNewIntervalRef.current = null;
    }
  }, []);

  // Show popup immediately + every 10s on any tab (except profile)
  useEffect(() => {
    if (hasSeenWhatsNew) return;
    if (state.activeTab === 'profile') {
      setShowWhatsNew(false);
      return;
    }

    // Show immediately
    setShowWhatsNew(true);
    const dismissTimer = setTimeout(() => setShowWhatsNew(false), 3000);

    // Then repeat every 10s
    const interval = setInterval(() => {
      if (hasSeenRef.current) return;
      setShowWhatsNew(true);
      setTimeout(() => setShowWhatsNew(false), 3000);
    }, 10000);
    whatsNewIntervalRef.current = interval;

    return () => {
      clearTimeout(dismissTimer);
      clearInterval(interval);
      whatsNewIntervalRef.current = null;
    };
  }, [state.activeTab, hasSeenWhatsNew]);

  // Track likes — show popup every 3 likes
  const handleLikeWithPopup = useCallback((params: {
    targetType: 'photo' | 'prompt';
    targetIndex: number;
    message?: string;
    isRose?: boolean;
    isPriority?: boolean;
  }) => {
    const result = state.sendLike({
      profileId: state.currentProfile!.id,
      ...params,
    });
    if (!hasSeenWhatsNew) {
      likesSincePopupRef.current += 1;
      if (likesSincePopupRef.current >= 3) {
        likesSincePopupRef.current = 0;
        setShowWhatsNew(true);
        setTimeout(() => setShowWhatsNew(false), 3000);
      }
    }
    return result;
  }, [state, hasSeenWhatsNew]);

  const matchesUnread = state.matches.filter((m) => m.unread).length;

  // Close dropdown on outside click
  useEffect(() => {
    if (!openFilter) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openFilter]);

  const handleFilterClick = (key: FilterKey) => {
    if (!state.isPaid) {
      setShowUpgradeModal(true);
      return;
    }
    setOpenFilter((prev) => (prev === key ? null : key));
  };

  const getFilterLabel = (key: FilterKey) => {
    switch (key) {
      case 'age':
        return filters.age ? `${filters.age.min}-${filters.age.max}` : 'Age';
      case 'height':
        return filters.height ? `${filters.height.min} – ${filters.height.max}` : 'Height';
      case 'intentions':
        return filters.intentions.length > 0
          ? filters.intentions.length === 1
            ? filters.intentions[0]
            : `${filters.intentions.length} selected`
          : 'Dating Intentions';
    }
  };

  const isFilterActive = (key: FilterKey) => {
    switch (key) {
      case 'age': return !!filters.age;
      case 'height': return !!filters.height;
      case 'intentions': return filters.intentions.length > 0;
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      {/* Top bar */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3 overflow-hidden relative z-40">
        <SlidersHorizontal size={20} className="text-foreground shrink-0" />
        <div className="flex items-center gap-2 min-w-0" ref={dropdownRef}>
          {/* Age Filter */}
          <div className="relative">
            <FilterPill
              label={getFilterLabel('age')}
              filled={isFilterActive('age')}
              onClick={() => handleFilterClick('age')}
            />
            <AnimatePresence>
              {openFilter === 'age' && (
                <FilterDropdown onClose={() => setOpenFilter(null)}>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Age Range</p>
                    <div className="flex items-center gap-2 mb-3">
                      <select
                        value={filters.age?.min ?? 18}
                        onChange={(e) => setFilters((f) => ({
                          ...f,
                          age: { min: Number(e.target.value), max: f.age?.max ?? 60 },
                        }))}
                        className="flex-1 bg-muted text-foreground rounded-lg px-3 py-2 text-sm border border-border"
                      >
                        {AGE_OPTIONS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                      <span className="text-muted-foreground text-sm">to</span>
                      <select
                        value={filters.age?.max ?? 60}
                        onChange={(e) => setFilters((f) => ({
                          ...f,
                          age: { min: f.age?.min ?? 18, max: Number(e.target.value) },
                        }))}
                        className="flex-1 bg-muted text-foreground rounded-lg px-3 py-2 text-sm border border-border"
                      >
                        {AGE_OPTIONS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setFilters((f) => ({ ...f, age: null })); setOpenFilter(null); }}
                        className="flex-1 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setOpenFilter(null)}
                        className="flex-1 py-2 text-sm font-semibold bg-foreground text-background rounded-lg"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </FilterDropdown>
              )}
            </AnimatePresence>
          </div>

          {/* Height Filter */}
          <div className="relative">
            <FilterPill
              label={getFilterLabel('height')}
              filled={isFilterActive('height')}
              onClick={() => handleFilterClick('height')}
            />
            <AnimatePresence>
              {openFilter === 'height' && (
                <FilterDropdown onClose={() => setOpenFilter(null)}>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Height Range</p>
                    <div className="flex items-center gap-2 mb-3">
                      <select
                        value={filters.height?.min ?? HEIGHT_OPTIONS[0]}
                        onChange={(e) => setFilters((f) => ({
                          ...f,
                          height: { min: e.target.value, max: f.height?.max ?? HEIGHT_OPTIONS[HEIGHT_OPTIONS.length - 1] },
                        }))}
                        className="flex-1 bg-muted text-foreground rounded-lg px-3 py-2 text-sm border border-border"
                      >
                        {HEIGHT_OPTIONS.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      <span className="text-muted-foreground text-sm">to</span>
                      <select
                        value={filters.height?.max ?? HEIGHT_OPTIONS[HEIGHT_OPTIONS.length - 1]}
                        onChange={(e) => setFilters((f) => ({
                          ...f,
                          height: { min: f.height?.min ?? HEIGHT_OPTIONS[0], max: e.target.value },
                        }))}
                        className="flex-1 bg-muted text-foreground rounded-lg px-3 py-2 text-sm border border-border"
                      >
                        {HEIGHT_OPTIONS.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setFilters((f) => ({ ...f, height: null })); setOpenFilter(null); }}
                        className="flex-1 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setOpenFilter(null)}
                        className="flex-1 py-2 text-sm font-semibold bg-foreground text-background rounded-lg"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </FilterDropdown>
              )}
            </AnimatePresence>
          </div>

          {/* Dating Intentions Filter */}
          <div className="relative">
            <FilterPill
              label={getFilterLabel('intentions')}
              filled={isFilterActive('intentions')}
              onClick={() => handleFilterClick('intentions')}
            />
            <AnimatePresence>
              {openFilter === 'intentions' && (
                <FilterDropdown onClose={() => setOpenFilter(null)}>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Dating Intentions</p>
                    <div className="flex flex-col gap-1 mb-3 max-h-48 overflow-y-auto">
                      {DATING_INTENTIONS.map((intent) => (
                        <button
                          key={intent}
                          onClick={() => setFilters((f) => ({
                            ...f,
                            intentions: f.intentions.includes(intent)
                              ? f.intentions.filter((i) => i !== intent)
                              : [...f.intentions, intent],
                          }))}
                          className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            filters.intentions.includes(intent)
                              ? 'bg-foreground text-background'
                              : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          {intent}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setFilters((f) => ({ ...f, intentions: [] })); setOpenFilter(null); }}
                        className="flex-1 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setOpenFilter(null)}
                        className="flex-1 py-2 text-sm font-semibold bg-foreground text-background rounded-lg"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </FilterDropdown>
              )}
            </AnimatePresence>
          </div>

          {/* Active Now - partially visible, unclickable */}
          <div className="shrink-0 opacity-50 pointer-events-none" style={{ clipPath: 'inset(0 40% 0 0)' }}>
            <FilterPill label="Active Now" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[calc(100vh-120px)] overflow-y-auto">
        {state.activeTab === 'discover' && (
          <>
            {state.hasMoreProfiles && state.currentProfile ? (
              <ProfileCard
                profile={state.currentProfile}
                vibeSync={state.getVibeSync(state.currentProfile.id)}
                glowResults={state.getGlowResults(state.currentProfile)}
                likesRemaining={state.likesRemaining}
                rosesRemaining={state.rosesRemaining}
                isPaid={state.isPaid}
                onLike={handleLikeWithPopup}
                onSkip={state.skipProfile}
                onGoBack={state.goBackProfile}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center">
                <Heart size={48} className="text-muted-foreground/30 mb-4" />
                <h2 className="font-hinge-serif text-xl text-foreground mb-2">
                  You're all caught up!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Check back later for new profiles.
                </p>
              </div>
            )}
          </>
        )}

        {state.activeTab === 'standouts' && (
          <StandoutsScreen
            profiles={standoutProfiles}
            rosesRemaining={state.rosesRemaining}
            onSendRose={(profileId, promptIndex, message) => {
              // Uses rose from state
            }}
          />
        )}

        {state.activeTab === 'likes' && (
          <LikesYouScreen
            likes={state.likesReceived}
            profiles={state.likesReceivedProfiles}
            onMatch={state.matchWithLike}
            onDismiss={state.dismissLike}
          />
        )}

        {state.activeTab === 'matches' && (
          <LikesYouScreen
            likes={state.likesReceived}
            profiles={state.likesReceivedProfiles}
            onMatch={state.matchWithLike}
            onDismiss={state.dismissLike}
          />
        )}

        {state.activeTab === 'chat' && (
          <MessagingScreen
            matches={state.matches}
            profiles={state.matchProfiles}
            chatMessages={state.chatMessages}
            activeChatMatchId={state.activeChatMatchId}
            onOpenChat={state.setActiveChatMatchId}
            onCloseChat={() => state.setActiveChatMatchId(null)}
            onSendMessage={state.sendMessage}
          />
        )}

        {state.activeTab === 'profile' && (
          <UserProfileScreen
            profile={state.userProfile}
            isPaid={state.isPaid}
            onUpdateProfile={state.updateUserProfile}
            onUpdateBandwidth={(status) => {
              state.updateUserProfile({ bandwidthStatus: status });
              state.setUserBandwidth(status);
            }}
            onToggleBandwidthVisible={(visible) => {
              state.updateUserProfile({ bandwidthVisible: visible });
            }}
            onViewWhatsNew={markWhatsNewSeen}
          />
        )}
      </div>

      {/* Bottom Nav */}
      <BottomNav
        activeTab={state.activeTab}
        onTabChange={state.setActiveTab}
        likesCount={state.likesReceived.length}
        matchesUnread={matchesUnread}
      />

      {/* What's New Popup */}
      <AnimatePresence>
        {showWhatsNew && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[68px] right-[calc(50%-224px+12px)] z-50"
            style={{ maxWidth: 'calc(100vw - 24px)' }}
          >
            <div
              onClick={() => {
                setShowWhatsNew(false);
                state.setActiveTab('profile');
              }}
              className="flex items-center gap-1.5 bg-foreground text-background pl-2.5 pr-1.5 py-1.5 rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Zap size={11} />
              <span className="text-[10px] font-semibold">Explore what's new on Hinge</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWhatsNew(false);
                }}
                className="p-0.5 rounded-full hover:bg-background/20 transition-colors ml-0.5"
              >
                <X size={10} />
              </button>
            </div>
            {/* Arrow pointing down to profile tab */}
            <div className="absolute -bottom-1 right-5 w-2 h-2 bg-foreground rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.showRefundPopup && (
          <RefundPopup
            profileName={state.showRefundPopup.profileName}
            likeTimestamp={state.showRefundPopup.likeTimestamp}
            onClose={() => state.setShowRefundPopup(null)}
          />
        )}
      </AnimatePresence>

      {/* Free User Upgrade Modal */}
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
              <h2 className="font-hinge-serif text-xl font-semibold text-foreground mb-2">Unlock Filters</h2>
              <p className="text-sm text-muted-foreground mb-5">Upgrade to filter by age, height, dating intentions, and more.</p>
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
};

function FilterPill({ label, filled, onClick }: { label: string; filled?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
        filled
          ? 'bg-foreground text-background'
          : 'bg-transparent border border-border text-foreground'
      }`}
    >
      {label}
      <ChevronDown size={14} />
    </button>
  );
}

function FilterDropdown({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 min-w-[260px]"
    >
      {children}
    </motion.div>
  );
}

export default Index;
