import { useState, useCallback, useEffect } from 'react';
import { AppTab, Like, Match, ChatMessage, GlowResult, Profile } from '@/types';
import {
  discoverProfiles,
  initialLikesReceived,
  initialMatches,
  initialChatMessages,
  userProfile as initialUserProfile,
  likesReceivedProfiles,
  matchProfiles,
  generateGhostText,
} from '@/data/mockData';
import { toast } from 'sonner';

const FREE_LIKE_LIMIT = 8;
const REFUND_TIMEOUT_MS = 10000; // 10 seconds for demo (3-4 days in production)

export function useAppState() {
  const [activeTab, setActiveTab] = useState<AppTab>('discover');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [likesSent, setLikesSent] = useState<Like[]>([]);
  const [likesReceived, setLikesReceived] = useState<Like[]>(initialLikesReceived);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [likesRemaining, setLikesRemaining] = useState(FREE_LIKE_LIMIT);
  const [rosesRemaining, setRosesRemaining] = useState(1);
  const [isPaid] = useState(false);
  
  const [showRefundPopup, setShowRefundPopup] = useState<{ profileName: string; likeTimestamp: number } | null>(null);
  const [activeChatMatchId, setActiveChatMatchId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Profile>(initialUserProfile);
  const [glowProfilesSeen, setGlowProfilesSeen] = useState<Set<string>>(new Set());
  const [freeRefundUsed, setFreeRefundUsed] = useState(false);
  
  const FREE_GLOW_LIMIT = 2;

  // Effort Insurance: refund first unreplied like after timeout (once for free users)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaid && freeRefundUsed) return; // free users only get one refund

      setLikesSent((prev) => {
        const now = Date.now();
        let refundTriggered = false;
        const updated = prev.map((like) => {
          if (
            !refundTriggered &&
            !like.refunded &&
            !like.read &&
            now - like.timestamp > REFUND_TIMEOUT_MS &&
            (!freeRefundUsed || isPaid)
          ) {
            const profile = discoverProfiles.find((p) => p.id === like.toProfileId);
            if (profile) {
              setShowRefundPopup({ profileName: profile.name, likeTimestamp: like.timestamp });
              setLikesRemaining((r) => r + 1);
              if (!isPaid) setFreeRefundUsed(true);
              refundTriggered = true;
            }
            return { ...like, refunded: true };
          }
          return like;
        });
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaid, freeRefundUsed]);

  const sendLike = useCallback(
    (params: {
      profileId: string;
      targetType: 'photo' | 'prompt';
      targetIndex: number;
      message?: string;
      isRose?: boolean;
      isPriority?: boolean;
    }) => {
      if (!isPaid && likesRemaining <= 0) {
        toast.error('No likes remaining. Upgrade to send more!');
        return false;
      }

      const like: Like = {
        id: `like_${Date.now()}`,
        fromProfileId: 'aman',
        toProfileId: params.profileId,
        targetType: params.targetType,
        targetIndex: params.targetIndex,
        message: params.message,
        isRose: params.isRose,
        isPriority: params.isPriority,
        timestamp: Date.now(),
        read: false,
        refunded: false,
      };

      setLikesSent((prev) => [...prev, like]);
      if (!isPaid) setLikesRemaining((r) => r - 1);
      if (params.isRose) setRosesRemaining((r) => r - 1);

      setCurrentProfileIndex((i) => i + 1);

      const profile = discoverProfiles.find((p) => p.id === params.profileId);
      const name = profile?.name || 'Someone';
      const likeType = params.isRose ? '🌹 Rose' : '❤️ Like';
      toast.success(`${name} — ${likeType} sent`);
      return true;
    },
    [isPaid, likesRemaining]
  );

  const skipProfile = useCallback(() => {
    setCurrentProfileIndex((i) => i + 1);
  }, []);

  const goBackProfile = useCallback(() => {
    setCurrentProfileIndex((i) => Math.max(0, i - 1));
  }, []);

  const matchWithLike = useCallback(
    (likeId: string) => {
      const like = likesReceived.find((l) => l.id === likeId);
      if (!like) return;

      const profile = likesReceivedProfiles.find((p) => p.id === like.fromProfileId);
      if (!profile) return;

      const newMatch: Match = {
        id: `match_${Date.now()}`,
        profileId: profile.id,
        lastMessage: like.message,
        lastMessageTimestamp: like.timestamp,
        lastMessageFrom: 'match',
        unread: true,
        isNew: true,
      };

      setMatches((prev) => [newMatch, ...prev]);
      setLikesReceived((prev) => prev.filter((l) => l.id !== likeId));
      toast.success(`It's a match with ${profile.name}! 🎉`);
    },
    [likesReceived]
  );

  const dismissLike = useCallback((likeId: string) => {
    setLikesReceived((prev) => prev.filter((l) => l.id !== likeId));
  }, []);

  const sendMessage = useCallback(
    (matchId: string, text: string) => {
      const msg: ChatMessage = {
        id: `msg_${Date.now()}`,
        matchId,
        from: 'user',
        text,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, msg]);
      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId
            ? { ...m, lastMessage: text, lastMessageTimestamp: Date.now(), lastMessageFrom: 'user', unread: false, isNew: false }
            : m
        )
      );

      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          matchId,
          from: 'match',
          text: getAutoReply(),
          timestamp: Date.now(),
        };
        setChatMessages((prev) => [...prev, replyMsg]);
        setMatches((prev) =>
          prev.map((m) =>
            m.id === matchId
              ? { ...m, lastMessage: replyMsg.text, lastMessageTimestamp: replyMsg.timestamp, lastMessageFrom: 'match', unread: true }
              : m
          )
        );
      }, 3000);
    },
    []
  );

  const currentProfile = discoverProfiles[currentProfileIndex] || null;

  const getVibeSync = useCallback(
    (profileId: string) => {
      const profile = discoverProfiles.find((p) => p.id === profileId);
      if (!profile || !profile.showVibeSync) return { hasSync: false, label: '' };

      const userVibe = userProfile.vibeData;
      const theirVibe = profile.vibeData;

      const replyMatch = userVibe.avgReplyTimeMinutes <= 120 && theirVibe.avgReplyTimeMinutes <= 120;
      const bothLongMessages = userVibe.avgMessageLength >= 3 && theirVibe.avgMessageLength >= 3;
      const bothThoughtful = (userVibe.profileReadTimeSec ?? 0) >= 15 && (theirVibe.profileReadTimeSec ?? 0) >= 15;
      const coreValueOverlap = (profile.coreValues || []).filter((v) => (userProfile.preferences || []).includes(v)).length >= 2;

      if (replyMatch) {
        return { hasSync: true, label: 'Fast-Paced Match' };
      }
      if (bothLongMessages) {
        return { hasSync: true, label: 'Shared Conversation Style' };
      }
      if (bothThoughtful) {
        return { hasSync: true, label: 'Both Thoughtful Sharers' };
      }
      if (coreValueOverlap) {
        return { hasSync: true, label: 'Deep Common Ground' };
      }
      // Fallback: if showVibeSync is on but no specific match, pick best fit
      return { hasSync: true, label: 'Shared Conversation Style' };
    },
    [isPaid, userProfile]
  );

  // Interest-based glow: find the SINGLE best match (most shared interests)
  const getGlowResults = useCallback(
    (profile: Profile): GlowResult => {
      const userInterests = new Set(userProfile.preferences);
      
      // Check if glow should be enabled for this profile (free user limit: 2 profiles)
      const canShowGlow = isPaid || glowProfilesSeen.size < FREE_GLOW_LIMIT || glowProfilesSeen.has(profile.id);

      // Score all prompts and photos, pick the single best
      let bestScore = 0;
      let bestType: 'prompt' | 'photo' = 'prompt';
      let bestId: string = '';

      const promptData: Record<string, { shared: string[]; ghostText: string }> = {};
      profile.prompts.forEach((prompt, idx) => {
        const promptInterests = prompt.interests || [];
        const shared = promptInterests.filter((i) => userInterests.has(i));
        promptData[prompt.id] = {
          shared,
          ghostText: shared.length > 0 ? generateGhostText(shared, prompt.answer) : '',
        };
        if (shared.length > bestScore) {
          bestScore = shared.length;
          bestType = 'prompt';
          bestId = prompt.id;
        }
      });

      const photoData: Record<number, { shared: string[] }> = {};
      profile.photos.forEach((photo, index) => {
        const photoTags = photo.tags || [];
        const shared = photoTags.filter((t) => userInterests.has(t));
        photoData[index] = { shared };
        if (shared.length > bestScore) {
          bestScore = shared.length;
          bestType = 'photo';
          bestId = String(index);
        }
      });

      // Only the best one glows (if allowed)
      const shouldGlow = canShowGlow && bestScore > 0;
      
      // Track this profile if it has a glow
      if (shouldGlow && !glowProfilesSeen.has(profile.id)) {
        setGlowProfilesSeen(prev => new Set(prev).add(profile.id));
      }

      const promptGlows: GlowResult['promptGlows'] = {};
      profile.prompts.forEach((prompt) => {
        const data = promptData[prompt.id];
        promptGlows[prompt.id] = {
          glow: shouldGlow && bestType === 'prompt' && bestId === prompt.id,
          ghostText: data.ghostText,
          sharedInterests: data.shared,
        };
      });

      const photoGlows: GlowResult['photoGlows'] = {};
      profile.photos.forEach((_, index) => {
        const data = photoData[index];
        photoGlows[index] = {
          glow: shouldGlow && bestType === 'photo' && bestId === String(index),
          sharedTags: data.shared,
        };
      });

      return { promptGlows, photoGlows };
    },
    [userProfile, isPaid, glowProfilesSeen]
  );

  const updateUserProfile = useCallback((updates: Partial<Profile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    activeTab,
    setActiveTab,
    currentProfile,
    currentProfileIndex,
    likesSent,
    likesReceived,
    likesReceivedProfiles,
    matches,
    matchProfiles: [...matchProfiles, ...likesReceivedProfiles],
    chatMessages,
    likesRemaining,
    rosesRemaining,
    isPaid,
    userProfile,
    updateUserProfile,
    showRefundPopup,
    setShowRefundPopup,
    activeChatMatchId,
    setActiveChatMatchId,
    sendLike,
    skipProfile,
    goBackProfile,
    matchWithLike,
    dismissLike,
    sendMessage,
    getVibeSync,
    getGlowResults,
    hasMoreProfiles: currentProfileIndex < discoverProfiles.length,
  };
}

function getAutoReply(): string {
  const replies = [
    "That's so sweet of you to say! 😊",
    "I'd love that! When are you free?",
    "Haha you're funny! Tell me more about yourself.",
    "That's exactly what I was thinking!",
    "You seem really interesting. What do you do for fun?",
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}
