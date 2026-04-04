import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Profile } from '@/types';
import { toast } from 'sonner';

interface StandoutsScreenProps {
  profiles: Profile[];
  rosesRemaining: number;
  onSendRose: (profileId: string, promptIndex: number, message?: string) => void;
}

export function StandoutsScreen({ profiles, rosesRemaining, onSendRose }: StandoutsScreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [roses, setRoses] = useState(rosesRemaining);

  const handleSendRose = (profileId: string, promptIndex: number) => {
    if (roses <= 0) {
      toast.error("You're out of roses!", { description: 'Get more roses with HingeX' });
      return;
    }
    setRoses((r) => r - 1);
    onSendRose(profileId, promptIndex);
    const profile = profiles.find((p) => p.id === profileId);
    toast.success(`🌹 Rose sent to ${profile?.name ?? 'someone special'}!`);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold text-foreground">Standouts</h1>
        <div className="flex items-center gap-1.5 bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 rounded-full">
          <span className="text-base">🌹</span>
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
            Roses ({roses})
          </span>
        </div>
      </div>

      {/* Horizontal scrollable cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-4 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {profiles.map((profile) => (
          <StandoutCard
            key={profile.id}
            profile={profile}
            rosesLeft={roses}
            onSendRose={handleSendRose}
          />
        ))}
      </div>
    </div>
  );
}

function StandoutCard({
  profile,
  rosesLeft,
  onSendRose,
}: {
  profile: Profile;
  rosesLeft: number;
  onSendRose: (profileId: string, promptIndex: number) => void;
}) {
  const photo = profile.photos[0]?.url;
  const prompt1 = profile.prompts[0];
  const prompt2 = profile.prompts[1];

  return (
    <div className="snap-start shrink-0 w-[280px] rounded-2xl overflow-hidden shadow-lg border border-border bg-card">
      {/* Photo pane */}
      <div className="relative h-[420px]">
        <img
          src={photo}
          alt={profile.name}
          className="w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Name + verified badge — top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-white font-bold text-lg drop-shadow-md">
            {profile.name}
          </span>
          {profile.verified && (
            <span className="w-5 h-5 rounded-full bg-purple-800 flex items-center justify-center">
              <Check size={13} className="text-white" strokeWidth={3.5} />
            </span>
          )}
        </div>

        {/* Prompt boxes inside the photo pane — lower area */}
        <div className="absolute bottom-2 left-2 right-2">
          {prompt1 && (
            <PromptOverlay
              prompt={prompt1}
              index={0}
              profileId={profile.id}
              rosesLeft={rosesLeft}
              onSendRose={onSendRose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PromptOverlay({
  prompt,
  index,
  profileId,
  rosesLeft,
  onSendRose,
}: {
  prompt: { question: string; answer: string };
  index: number;
  profileId: string;
  rosesLeft: number;
  onSendRose: (profileId: string, promptIndex: number) => void;
}) {
  return (
    <div className="relative bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-sm">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide leading-tight mb-0.5">
        {prompt.question}
      </p>
      <p className="text-xs text-foreground font-medium leading-snug pr-8">
        {prompt.answer}
      </p>

      {/* Rose button — bottom right of prompt */}
      <button
        onClick={() => onSendRose(profileId, index)}
        className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white shadow-md border border-border flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Send rose"
      >
        <span className="text-sm">🌹</span>
      </button>
    </div>
  );
}
