import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { Like, Profile } from '@/types';
import { AnimatedAvatar } from './AnimatedAvatar';
import { MatchCardNudge } from './MatchCardNudge';

interface LikesYouScreenProps {
  likes: Like[];
  profiles: Profile[];
  onMatch: (likeId: string) => void;
  onDismiss: (likeId: string) => void;
}

function getLikeCardNudge(profile: Profile): string | null {
  const interests = profile.preferences || [];
  if (interests.length > 0) {
    return `${profile.name} values ${interests[0]} — a thoughtful reply goes far`;
  }
  return `Reply with something genuine — ${profile.name} took the first step`;
}

export function LikesYouScreen({ likes, profiles, onMatch, onDismiss }: LikesYouScreenProps) {
  if (likes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center">
        <Heart size={48} className="text-muted-foreground/30 mb-4" />
        <h2 className="font-hinge-serif text-xl text-foreground mb-2">No likes yet</h2>
        <p className="text-sm text-muted-foreground">When someone likes you, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <h2 className="font-hinge-serif text-2xl font-semibold mb-4">
        Likes You <span className="text-primary">({likes.length})</span>
      </h2>
      <div className="space-y-4">
        {likes.map((like) => {
          const profile = profiles.find((p) => p.id === like.fromProfileId);
          if (!profile) return null;
          const nudgeText = getLikeCardNudge(profile);

          return (
            <motion.div
              key={like.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-card rounded-2xl overflow-hidden border border-border"
            >
              <div className="flex">
                {profile.photos[0] ? (
                  <img
                    src={profile.photos[0].url}
                    alt={profile.name}
                    className="w-28 h-36 object-cover"
                  />
                ) : (
                  <div className="w-28 h-36 bg-secondary flex items-center justify-center">
                    <AnimatedAvatar name={profile.name} gender={profile.gender} size="md" />
                  </div>
                )}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-hinge-serif text-lg font-semibold">
                      {profile.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">{profile.gender}</span>
                    {like.message && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        "{like.message}"
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => onDismiss(like.id)}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <X size={18} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => onMatch(like.id)}
                      className="flex-1 bg-primary text-primary-foreground rounded-full py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Match ❤️
                    </button>
                  </div>
                </div>
              </div>
              {/* Animated nudge on like card */}
              {nudgeText && (
                <div className="px-1 pb-2">
                  <MatchCardNudge text={nudgeText} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
