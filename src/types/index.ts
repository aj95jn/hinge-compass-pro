export interface Prompt {
  id: string;
  question: string;
  answer: string;
  interests?: string[]; // tags associated with this prompt
  isBridgeBuilder?: boolean;
  bridgeGhostText?: string;
}

export interface ProfileVitals {
  age?: number;
  gender?: string;
  orientation?: string;
  religion?: string;
  politics?: string;
  ethnicity?: string;
  datingGoals?: string;
  relationshipType?: string;
}

export interface Profile {
  id: string;
  name: string;
  gender: 'Female' | 'Male' | 'Non-binary';
  age?: number;
  location: string;
  verified?: boolean;
  photos: { url: string; tags?: string[] }[];
  prompts: Prompt[];
  preferences: string[]; // user's interests/preferences
  showVibeSync?: boolean; // whether to show vibe sync badge
  vibeSyncVisible?: boolean; // whether vibe sync is public on profile
  vibeSyncLabel?: VibeSyncLabel; // selected vibe sync option
  vibeData: {
    avgMessageLength: number;
    avgReplyTimeMinutes: number;
    profileReadTimeSec?: number; // avg seconds spent reading profiles before liking
  };
  vitals?: ProfileVitals;
  coreValues?: string[]; // core value tags for Deep Common Ground matching
  activityTag?: 'active_now' | 'new_user' | 'active_today';
}

export interface Like {
  id: string;
  fromProfileId: string;
  toProfileId: string;
  targetType: 'photo' | 'prompt';
  targetIndex: number;
  message?: string;
  isRose?: boolean;
  isPriority?: boolean;
  timestamp: number;
  read: boolean;
  refunded: boolean;
}

export interface Match {
  id: string;
  profileId: string;
  lastMessage?: string;
  lastMessageTimestamp?: number;
  lastMessageFrom?: 'user' | 'match';
  unread: boolean;
  isNew: boolean;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  from: 'user' | 'match';
  text: string;
  timestamp: number;
}

export type AppTab = 'discover' | 'standouts' | 'likes' | 'matches' | 'chat' | 'profile';



export type VibeSyncLabel = 'Shared Conversation Style' | 'Fast-Paced Match' | 'Both Thoughtful Sharers' | 'Deep Common Ground';

export interface VibeSyncResult {
  hasSync: boolean;
  label: string;
  detail?: string;
}

export interface GlowResult {
  promptGlows: Record<string, { glow: boolean; ghostText: string; sharedInterests: string[] }>;
  photoGlows: Record<number, { glow: boolean; sharedTags: string[] }>;
}
