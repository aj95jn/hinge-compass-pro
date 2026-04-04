import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Edit3, Plus, X, Sparkles, Zap, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { AnimatedAvatar } from './AnimatedAvatar';
import { Profile, BandwidthStatus, VibeSyncLabel } from '@/types';
import { BandwidthStatusPill } from './BandwidthStatus';
import { FeaturesWalkthrough } from './FeaturesWalkthrough';

const ALL_INTERESTS = [
  'travel', 'philosophy', 'cooking', 'hiking', 'music',
  'deep-conversations', 'entrepreneurship', 'food', 'outdoors',
  'books', 'yoga', 'art', 'fitness', 'photography', 'movies',
  'gaming', 'fashion', 'coffee', 'wine', 'dancing', 'writing',
  'volunteering', 'pets', 'sports', 'tech', 'humor', 'nightlife',
];

interface UserProfileScreenProps {
  profile: Profile;
  isPaid?: boolean;
  onUpdateProfile: (updates: Partial<Profile>) => void;
  onUpdateBandwidth: (status: BandwidthStatus) => void;
  onToggleBandwidthVisible: (visible: boolean) => void;
  onViewWhatsNew?: () => void;
}

export function UserProfileScreen({ profile, isPaid = false, onUpdateProfile, onUpdateBandwidth, onToggleBandwidthVisible, onViewWhatsNew }: UserProfileScreenProps) {
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showInterestPicker, setShowInterestPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'features'>('profile');
  const [showBandwidthInfo, setShowBandwidthInfo] = useState(false);
  const [showVibeSyncInfo, setShowVibeSyncInfo] = useState(false);
  const bandwidthInfoRef = useRef<HTMLDivElement>(null);
  const vibeSyncInfoRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss after 8s and click-outside for bandwidth
  useEffect(() => {
    if (!showBandwidthInfo) return;
    const timer = setTimeout(() => setShowBandwidthInfo(false), 8000);
    const handleClickOutside = (e: MouseEvent) => {
      if (bandwidthInfoRef.current && !bandwidthInfoRef.current.contains(e.target as Node)) {
        setShowBandwidthInfo(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClickOutside); };
  }, [showBandwidthInfo]);

  // Auto-dismiss after 8s and click-outside for vibe sync
  useEffect(() => {
    if (!showVibeSyncInfo) return;
    const timer = setTimeout(() => setShowVibeSyncInfo(false), 8000);
    const handleClickOutside = (e: MouseEvent) => {
      if (vibeSyncInfoRef.current && !vibeSyncInfoRef.current.contains(e.target as Node)) {
        setShowVibeSyncInfo(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClickOutside); };
  }, [showVibeSyncInfo]);

  const handleSavePrompt = (promptId: string) => {
    const updatedPrompts = profile.prompts.map((p) =>
      p.id === promptId ? { ...p, answer: editText } : p
    );
    onUpdateProfile({ prompts: updatedPrompts });
    setEditingPrompt(null);
  };

  const toggleInterest = (interest: string) => {
    const current = profile.preferences;
    const updated = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    onUpdateProfile({ preferences: updated });
  };

  const bandwidthOptions: { value: BandwidthStatus; label: string }[] = [
    { value: 'ready', label: 'Ready to Connect' },
    { value: 'focusing', label: 'Focusing on Matches' },
    { value: 'weekend', label: 'Weekend Spark ✨' },
    { value: 'new_vibes', label: 'Open to New Vibes' },
  ];

  return (
    <div className="pb-24">
      {/* Profile Header */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-4 mb-4">
          <AnimatedAvatar name={profile.name} gender={profile.gender} size="lg" />
          <div>
            <h2 className="font-hinge-serif text-2xl font-semibold text-foreground">
              {profile.name}
            </h2>
            <span className="text-sm text-muted-foreground">{profile.gender}</span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <MapPin size={14} />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => { setActiveTab('features'); onViewWhatsNew?.(); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'features'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Zap size={12} />
            What's New
          </button>
        </div>
      </div>

      {activeTab === 'features' ? (
        <FeaturesWalkthrough
          isPaid={isPaid}
          bandwidthVisible={profile.bandwidthVisible ?? false}
          bandwidthStatus={profile.bandwidthStatus}
          onToggleBandwidthVisible={onToggleBandwidthVisible}
          onUpdateBandwidth={onUpdateBandwidth}
        />
      ) : (
        <div className="px-4">
          {/* Bandwidth Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 relative">
                <h3 className="text-sm font-semibold text-foreground">Your Bandwidth Status</h3>
                <button
                  onClick={() => setShowBandwidthInfo(!showBandwidthInfo)}
                  onMouseEnter={() => setShowBandwidthInfo(true)}
                  onMouseLeave={() => setShowBandwidthInfo(false)}
                  className="p-0.5 rounded-full hover:bg-muted transition-colors"
                >
                  <Info size={14} className="text-muted-foreground" />
                </button>

                {/* Info popup */}
                <AnimatePresence>
                  {showBandwidthInfo && (
                    <motion.div
                      ref={bandwidthInfoRef}
                      initial={{ opacity: 0, scale: 0.9, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -4 }}
                      className="absolute bottom-7 left-0 z-50 w-64 bg-card rounded-xl p-3 shadow-lg border border-border"
                    >
                      <button
                        onClick={() => setShowBandwidthInfo(false)}
                        className="absolute top-2 right-2 p-0.5 rounded-full hover:bg-muted transition-colors"
                      >
                        <X size={12} className="text-muted-foreground" />
                      </button>
                      <p className="font-semibold text-foreground text-xs mb-1">What is Bandwidth?</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Bandwidth lets others know how available you are to chat. Choose a status and make it visible on your profile so matches can see when you're most responsive.
                      </p>
                      {/* Arrow pointing up */}
                      <div className="absolute -bottom-[5px] left-[90px] w-2.5 h-2.5 bg-card border-r border-b border-border rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{profile.bandwidthVisible ? 'Public' : 'Private'}</span>
                <Switch
                  checked={profile.bandwidthVisible}
                  onCheckedChange={(checked) => onToggleBandwidthVisible(checked)}
                />
              </div>
            </div>
            {!profile.bandwidthVisible && (
              <p className="text-[11px] text-muted-foreground mb-3">
                Your status is hidden. Toggle to make it visible on your profile.
              </p>
            )}
            <div className={`flex flex-wrap gap-2 ${!profile.bandwidthVisible ? 'opacity-50' : ''}`}>
              {bandwidthOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onUpdateBandwidth(opt.value);
                    
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    profile.bandwidthStatus === opt.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vibe Sync */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 relative">
                <h3 className="text-sm font-semibold text-foreground">Vibe Sync</h3>
                <button
                  onClick={() => setShowVibeSyncInfo(!showVibeSyncInfo)}
                  onMouseEnter={() => setShowVibeSyncInfo(true)}
                  onMouseLeave={() => setShowVibeSyncInfo(false)}
                  className="p-0.5 rounded-full hover:bg-muted transition-colors"
                >
                  <Info size={14} className="text-muted-foreground" />
                </button>

                <AnimatePresence>
                  {showVibeSyncInfo && (
                    <motion.div
                      ref={vibeSyncInfoRef}
                      initial={{ opacity: 0, scale: 0.9, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -4 }}
                      className="absolute bottom-7 left-0 z-50 w-64 bg-card rounded-xl p-3 shadow-lg border border-border"
                    >
                      <button
                        onClick={() => setShowVibeSyncInfo(false)}
                        className="absolute top-2 right-2 p-0.5 rounded-full hover:bg-muted transition-colors"
                      >
                        <X size={12} className="text-muted-foreground" />
                      </button>
                      <p className="font-semibold text-foreground text-xs mb-1">What is Vibe Sync?</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        It signals you share a behavioral rhythm, such as similar message lengths, response speeds, or overlapping core values.
                      </p>
                      <div className="absolute -bottom-[5px] left-[60px] w-2.5 h-2.5 bg-card border-r border-b border-border rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{profile.vibeSyncVisible ? 'Public' : 'Private'}</span>
                <Switch
                  checked={profile.vibeSyncVisible ?? false}
                  onCheckedChange={(checked) => onUpdateProfile({ vibeSyncVisible: checked, showVibeSync: checked })}
                />
              </div>
            </div>
            {!profile.vibeSyncVisible && (
              <p className="text-[11px] text-muted-foreground mb-3">
                Your vibe sync is hidden. Toggle to make it visible on your profile.
              </p>
            )}
            <div className={`flex flex-wrap gap-2 ${!profile.vibeSyncVisible ? 'opacity-50' : ''}`}>
              {([
                { value: 'Shared Conversation Style' as VibeSyncLabel, label: 'Shared Conversation' },
                { value: 'Fast-Paced Match' as VibeSyncLabel, label: 'Fast-Paced Match' },
                { value: 'Both Thoughtful Sharers' as VibeSyncLabel, label: 'Thoughtful Sharers' },
                { value: 'Deep Common Ground' as VibeSyncLabel, label: 'Deep Common Ground' },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdateProfile({ vibeSyncLabel: opt.value })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    profile.vibeSyncLabel === opt.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preferences / Interests */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles size={14} className="text-hinge-gold" />
                Your Interests
              </h3>
              <button
                onClick={() => setShowInterestPicker(!showInterestPicker)}
                className="text-xs text-primary font-medium"
              >
                {showInterestPicker ? 'Done' : 'Edit'}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              These are used to find common ground and highlight matching prompts with a rose glow.
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.preferences.map((interest) => (
                <motion.span
                  key={interest}
                  layout
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                >
                  {interest}
                  {showInterestPicker && (
                    <button onClick={() => toggleInterest(interest)}>
                      <X size={12} className="text-muted-foreground hover:text-destructive" />
                    </button>
                  )}
                </motion.span>
              ))}
            </div>

            {showInterestPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-3 pt-3 border-t border-border"
              >
                <p className="text-xs text-muted-foreground mb-2">Add more interests:</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_INTERESTS.filter((i) => !profile.preferences.includes(i)).map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Plus size={12} />
                      {interest}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Your Prompts */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Your Prompts</h3>
            <div className="space-y-3">
              {profile.prompts.map((prompt) => (
                <div key={prompt.id} className="bg-card rounded-2xl p-4 border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    {prompt.question}
                  </p>

                  {editingPrompt === prompt.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-muted rounded-xl p-3 text-sm text-foreground resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSavePrompt(prompt.id)}
                          className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPrompt(null)}
                          className="px-4 py-1.5 bg-muted text-muted-foreground rounded-full text-xs font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-foreground font-hinge-serif text-base leading-relaxed">
                        {prompt.answer}
                      </p>
                      <button
                        onClick={() => {
                          setEditingPrompt(prompt.id);
                          setEditText(prompt.answer);
                        }}
                        className="p-1.5 rounded-full hover:bg-muted transition-colors flex-shrink-0"
                      >
                        <Edit3 size={14} className="text-muted-foreground" />
                      </button>
                    </div>
                  )}

                  {prompt.interests && prompt.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {prompt.interests.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
