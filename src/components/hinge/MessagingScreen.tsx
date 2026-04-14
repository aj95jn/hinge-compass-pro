import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { AnimatedAvatar } from './AnimatedAvatar';
import { Match, Profile, ChatMessage } from '@/types';
import { ChatThread } from './ChatThread';

interface MessagingScreenProps {
  matches: Match[];
  profiles: Profile[];
  chatMessages: ChatMessage[];
  activeChatMatchId: string | null;
  onOpenChat: (matchId: string) => void;
  onCloseChat: () => void;
  onSendMessage: (matchId: string, text: string) => void;
}

// Demo: treat matches older than 10s as "unmessaged for 24h" 
const UNMESSAGED_THRESHOLD_MS = 10_000;

export function MessagingScreen({
  matches,
  profiles,
  chatMessages,
  activeChatMatchId,
  onOpenChat,
  onCloseChat,
  onSendMessage,
}: MessagingScreenProps) {
  const [yourTurnOpen, setYourTurnOpen] = useState(true);
  const [theirTurnOpen, setTheirTurnOpen] = useState(true);

  const yourTurn = matches.filter((m) => m.lastMessageFrom === 'match');
  const theirTurn = matches.filter((m) => m.lastMessageFrom === 'user');
  const newMatches = matches.filter((m) => m.isNew);

  // Check if a match is unmessaged (no user messages sent)
  const isUnmessaged = (match: Match) => {
    const msgs = chatMessages.filter(m => m.matchId === match.id && m.from === 'user');
    if (msgs.length > 0) return false;
    // Check if match is old enough (simulated 24h with short threshold for demo)
    const matchAge = Date.now() - (match.lastMessageTimestamp || Date.now());
    return matchAge > UNMESSAGED_THRESHOLD_MS;
  };

  if (activeChatMatchId) {
    const match = matches.find((m) => m.id === activeChatMatchId);
    const profile = match ? profiles.find((p) => p.id === match.profileId) : null;
    const messages = chatMessages.filter((m) => m.matchId === activeChatMatchId);

    return (
      <ChatThread
        matchName={profile?.name || 'Unknown'}
        matchPhoto={profile?.photos[0]?.url || ''}
        messages={messages}
        onSend={(text) => onSendMessage(activeChatMatchId, text)}
        onBack={onCloseChat}
      />
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-hinge-serif text-2xl font-semibold mb-4">Messages</h2>

      {/* New matches */}
      {newMatches.length > 0 && (
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {newMatches.map((match) => {
              const profile = profiles.find((p) => p.id === match.profileId);
              if (!profile) return null;
              return (
                <motion.button
                  key={match.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => onOpenChat(match.id)}
                  className="flex flex-col items-center gap-1 min-w-[72px]"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2 ring-offset-background flex items-center justify-center">
                    {profile.photos[0] ? (
                      <img src={profile.photos[0].url} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <AnimatedAvatar name={profile.name} gender={profile.gender} size="md" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-foreground">{profile.name}</span>
                  <span className="text-[10px] text-primary font-medium">Tap to chat</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Your Turn */}
      <CollapsibleSection title="Your Turn" count={yourTurn.length} isOpen={yourTurnOpen} onToggle={() => setYourTurnOpen(!yourTurnOpen)}>
        {yourTurn.map((match) => (
          <MatchRow
            key={match.id}
            match={match}
            profile={profiles.find((p) => p.id === match.profileId)}
            onClick={() => onOpenChat(match.id)}
            showUnmessagedNudge={isUnmessaged(match)}
          />
        ))}
      </CollapsibleSection>

      {/* Their Turn */}
      <CollapsibleSection title="Their Turn" count={theirTurn.length} isOpen={theirTurnOpen} onToggle={() => setTheirTurnOpen(!theirTurnOpen)}>
        {theirTurn.map((match) => (
          <MatchRow
            key={match.id}
            match={match}
            profile={profiles.find((p) => p.id === match.profileId)}
            onClick={() => onOpenChat(match.id)}
            showUnmessagedNudge={isUnmessaged(match)}
          />
        ))}
      </CollapsibleSection>

      {matches.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center">
          <MessageCircle size={48} className="text-muted-foreground/30 mb-4" />
          <h3 className="font-hinge-serif text-lg text-foreground mb-2">No matches yet</h3>
          <p className="text-sm text-muted-foreground">Start liking profiles to get matched!</p>
        </div>
      )}
    </div>
  );
}

function CollapsibleSection({
  title, count, isOpen, onToggle, children,
}: {
  title: string; count: number; isOpen: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <div className="mb-4">
      <button onClick={onToggle} className="flex items-center gap-2 w-full py-2 text-left">
        <span className="text-sm font-semibold text-foreground">{title} ({count})</span>
        {isOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-1">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MatchRow({
  match, profile, onClick, showUnmessagedNudge,
}: {
  match: Match; profile?: Profile; onClick: () => void; showUnmessagedNudge?: boolean;
}) {
  if (!profile) return null;

  return (
    <div>
      <button onClick={onClick} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-muted transition-colors text-left">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
          {profile.photos[0] ? (
            <img src={profile.photos[0].url} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <AnimatedAvatar name={profile.name} gender={profile.gender} size="sm" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{profile.name}</p>
          <p className="text-xs text-muted-foreground truncate">{match.lastMessage}</p>
        </div>
        {match.unread && <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />}
      </button>
      {/* Unmessaged match nudge */}
      {showUnmessagedNudge && (
        <motion.button
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onClick={onClick}
          className="w-full px-3 pb-2 -mt-1"
        >
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 text-xs text-blue-700 dark:text-blue-300 font-medium">
            Say hi — matches who hear from you early are more likely to reply
          </div>
        </motion.button>
      )}
    </div>
  );
}
