import { Heart, MessageSquare, Star, User } from 'lucide-react';
import { AppTab } from '@/types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  likesCount: number;
  matchesUnread: number;
}

function HingeLogo({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      className={active ? 'text-white' : 'text-white/40'}
    >
      <path d="M4 4v16" />
      <path d="M4 12h8" />
      <path d="M20 4v16" />
    </svg>
  );
}

export function BottomNav({ activeTab, onTabChange, likesCount, matchesUnread }: BottomNavProps) {
  const tabs: AppTab[] = ['discover', 'standouts', 'matches', 'chat', 'profile'];

  const hasNotification = (key: AppTab) => {
    return (key === 'likes' && likesCount > 0) || (key === 'chat' && matchesUnread > 0);
  };

  const renderIcon = (key: AppTab, active: boolean) => {
    const cls = active ? 'text-white' : hasNotification(key) ? 'text-white/60' : 'text-white/40';
    switch (key) {
      case 'discover':
        return <HingeLogo active={active} />;
      case 'standouts':
        return <Star size={24} className={cls} fill={active ? 'currentColor' : 'none'} />;
      case 'likes':
        return <Star size={24} className={cls} fill={active ? 'currentColor' : 'none'} />;
      case 'matches':
        return <Heart size={24} className={cls} fill={active ? 'currentColor' : 'none'} />;
      case 'chat':
        return <MessageSquare size={24} className={cls} fill={active ? 'currentColor' : 'none'} />;
      case 'profile':
        return <User size={24} className={cls} fill={active ? 'currentColor' : 'none'} />;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
      <div className="bg-[hsl(0,0%,15%)] rounded-t-2xl flex items-center justify-around py-4 px-2">
        {tabs.map((key) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className="relative flex items-center justify-center w-10 h-8"
          >
            {renderIcon(key, activeTab === key)}
            {key === 'likes' && likesCount > 0 && (
              <span className="absolute -top-1 -right-0.5 bg-purple-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {likesCount}
              </span>
            )}
            {key === 'chat' && matchesUnread > 0 && (
              <span className="absolute -top-1 -right-0.5 bg-purple-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {matchesUnread}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
