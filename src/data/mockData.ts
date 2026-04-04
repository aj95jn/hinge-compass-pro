import { Profile, Like, Match, ChatMessage } from '@/types';

// Simple profile images
import sarahProfile from '@/assets/sarah-profile-new.jpg';
import sarah2 from '@/assets/sarah-2-simple.jpg';
import sarah3 from '@/assets/sarah-3-simple.jpg';
import mayaProfile from '@/assets/maya-profile-new.jpg';
import maya2 from '@/assets/maya-2-simple.jpg';
import emmaProfile from '@/assets/emma-profile-new.jpg';
import emma2 from '@/assets/emma-2-simple.jpg';
import jessicaProfile from '@/assets/jessica-profile-new.jpg';
import oliviaProfile from '@/assets/olivia-profile-new.jpg';
import sophiaProfile from '@/assets/sophia-profile-new.jpg';
import lilyProfile from '@/assets/lily-profile-new.jpg';
import avaProfile from '@/assets/ava-profile-new.jpg';
import chloeProfile from '@/assets/chloe-profile-new.jpg';
import miaProfile from '@/assets/mia-profile-new.jpg';

export const userProfile: Profile = {
  id: 'aman',
  name: 'Aman',
  gender: 'Male',
  location: 'New York, NY',
  photos: [],
  prompts: [
    { id: 'up1', question: 'A life goal of mine', answer: 'To build something that outlasts me — and travel the world while doing it.', interests: ['travel', 'entrepreneurship'] },
    { id: 'up2', question: 'I get along best with people who', answer: 'Love deep conversations about philosophy, life, and what makes people tick.', interests: ['philosophy', 'deep-conversations'] },
    { id: 'up3', question: 'My simple pleasures', answer: 'Cooking a new recipe from scratch, long hikes, and vinyl records on a Sunday.', interests: ['cooking', 'hiking', 'music'] },
  ],
  preferences: ['travel', 'philosophy', 'cooking', 'hiking', 'music', 'deep-conversations', 'entrepreneurship', 'food', 'outdoors'],
  bandwidthStatus: undefined,
  vibeData: { avgMessageLength: 4, avgReplyTimeMinutes: 0.5, profileReadTimeSec: 20 },
};

export const discoverProfiles: Profile[] = [
  {
    id: 'sarah', name: 'Sarah', gender: 'Female', location: 'Brooklyn, NY', verified: true,
    activityTag: 'active_now' as const,
    photos: [
      { url: sarahProfile, tags: ['city', 'travel'] },
      { url: sarah2, tags: ['food', 'cooking'] },
      { url: sarah3, tags: ['hiking', 'outdoors'] },
    ],
    prompts: [
      { id: 'p1', question: 'My biggest travel fail', answer: 'Getting lost in Tokyo without a map and loving it.', interests: ['travel', 'adventure'], isBridgeBuilder: true, bridgeGhostText: 'What\'s your best travel mishap?' },
      { id: 'p2', question: 'The hallmark of a good relationship is', answer: 'Being able to sit in silence together and it feeling like the most interesting conversation.', interests: ['philosophy', 'deep-conversations'] },
      { id: 'p3', question: 'I\'m weirdly attracted to', answer: 'People who can cook a full meal from whatever\'s left in the fridge. That\'s a superpower.', interests: ['cooking', 'food', 'humor'] },
    ],
    preferences: ['travel', 'philosophy', 'cooking', 'adventure'],
    bandwidthStatus: 'focusing', bandwidthVisible: true,
    showVibeSync: true, vibeSyncVisible: true, vibeSyncLabel: 'Shared Conversation Style',
    vibeData: { avgMessageLength: 4, avgReplyTimeMinutes: 0.5, profileReadTimeSec: 25 },
    coreValues: ['travel', 'philosophy', 'deep-conversations'],
    vitals: { age: 27, gender: 'Woman', orientation: 'Straight', religion: 'Hindu', politics: 'Not Political', ethnicity: 'South Asian', datingGoals: 'Figuring out my dating goals', relationshipType: 'Monogamy' },
  },
  {
    id: 'maya', name: 'Maya', gender: 'Female', location: 'Manhattan, NY', activityTag: 'new_user' as const,
    photos: [
      { url: mayaProfile, tags: ['books', 'intellectual'] },
      { url: maya2, tags: ['books', 'deep-conversations'] },
    ],
    prompts: [
      { id: 'p4', question: 'Change my mind about', answer: 'Dog-earing pages. Some of us like our books to look lived-in, not pristine.', interests: ['books', 'humor'] },
      { id: 'p5', question: 'Two truths and a lie', answer: 'I\'ve read War and Peace twice. I once meditated for 10 days straight. I can touch my nose with my tongue.', interests: ['books', 'yoga', 'humor'] },
      { id: 'p6', question: 'A boundary of mine is', answer: 'No phones at dinner. If the food\'s good and the company\'s better, the screen can wait.', interests: ['mindfulness', 'food', 'deep-conversations'] },
    ],
    preferences: ['books', 'yoga', 'art', 'wellness'],
    bandwidthStatus: 'weekend', bandwidthVisible: true,
    showVibeSync: false, vibeSyncVisible: false,
    vibeData: { avgMessageLength: 2, avgReplyTimeMinutes: 30, profileReadTimeSec: 30 },
    vitals: { age: 25, gender: 'Woman', orientation: 'Bisexual' },
  },
  {
    id: 'emma', name: 'Emma', gender: 'Female', location: 'Williamsburg, NY', verified: true,
    photos: [
      { url: emmaProfile, tags: ['music', 'social'] },
      { url: emma2, tags: ['music', 'karaoke'] },
    ],
    prompts: [
      { id: 'p7', question: 'The dorkiest thing about me', answer: 'I have a spreadsheet ranking every pizza place in Brooklyn. Currently at 47 entries.', interests: ['food', 'humor', 'organization'] },
      { id: 'p8', question: 'I bet you can\'t', answer: 'Beat me at Scrabble. I have a winning streak going since 2019. It\'s a whole personality at this point.', interests: ['humor', 'games'] },
      { id: 'p9', question: 'After work you can find me', answer: 'At whatever dive bar has the best jukebox. Bonus points if they serve tater tots.', interests: ['music', 'nightlife', 'food'] },
    ],
    preferences: ['music', 'nightlife', 'fashion', 'humor'],
    bandwidthVisible: false,
    showVibeSync: true, vibeSyncVisible: true, vibeSyncLabel: 'Fast-Paced Match',
    vitals: { age: 26, gender: 'Woman', orientation: 'Straight', ethnicity: 'Mixed', datingGoals: 'Looking for a relationship', relationshipType: 'Monogamy' },
    vibeData: { avgMessageLength: 5, avgReplyTimeMinutes: 0.3, profileReadTimeSec: 18 },
  },
  {
    id: 'sophia', name: 'Sophia', gender: 'Female', location: 'West Village, NY', verified: true, activityTag: 'active_today' as const,
    photos: [
      { url: sophiaProfile, tags: ['art', 'music'] },
    ],
    prompts: [
      { id: 'sp1', question: 'My therapist would say I', answer: 'Use cooking elaborate meals as a coping mechanism. And honestly? It works.', interests: ['cooking', 'food', 'humor'] },
      { id: 'sp2', question: 'One thing I\'d love to know about you', answer: 'What you\'d choose for your last meal. It says everything about a person.', interests: ['food', 'deep-conversations', 'philosophy'] },
      { id: 'sp3', question: 'Dating me is like', answer: 'Getting a personal tour guide to every hidden gem in the city. I know places Google doesn\'t.', interests: ['adventure', 'travel', 'exploration'] },
    ],
    preferences: ['wine', 'art', 'music', 'romance'],
    bandwidthStatus: 'ready', bandwidthVisible: true,
    showVibeSync: true, vibeSyncVisible: true, vibeSyncLabel: 'Deep Common Ground',
    vitals: { age: 29, gender: 'Woman', orientation: 'Straight', religion: 'Spiritual', politics: 'Liberal' },
    vibeData: { avgMessageLength: 5, avgReplyTimeMinutes: 0.8, profileReadTimeSec: 22 },
    coreValues: ['food', 'deep-conversations', 'philosophy', 'adventure'],
  },
  {
    id: 'lily', name: 'Lily', gender: 'Female', location: 'Midtown, NY',
    photos: [
      { url: lilyProfile, tags: ['music', 'food'] },
    ],
    prompts: [
      { id: 'lp1', question: 'My most controversial opinion', answer: 'Breakfast for dinner is superior to dinner for dinner. Every. Single. Time.', interests: ['food', 'humor'] },
      { id: 'lp2', question: 'I want someone who', answer: 'Sends me songs at 2am with "this reminded me of you" and means it.', interests: ['music', 'romance', 'deep-conversations'] },
      { id: 'lp3', question: 'This year I really want to', answer: 'Learn to DJ. I already have strong opinions about transitions, so I\'m halfway there.', interests: ['music', 'creative', 'ambition'] },
    ],
    preferences: ['food', 'music', 'tech', 'humor'],
    vitals: { age: 24, gender: 'Woman', orientation: 'Straight' },
    bandwidthStatus: 'new_vibes', bandwidthVisible: true,
    showVibeSync: false, vibeSyncVisible: false,
    vibeData: { avgMessageLength: 3, avgReplyTimeMinutes: 2 },
  },
  {
    id: 'ava', name: 'Ava', gender: 'Female', location: 'Harlem, NY', verified: true, activityTag: 'active_now' as const,
    photos: [
      { url: avaProfile, tags: ['community', 'outdoors'] },
    ],
    prompts: [
      { id: 'ap1', question: 'I\'m the type of texter who', answer: 'Sends voice notes instead of typing because tone matters and autocorrect is not my friend.', interests: ['humor', 'deep-conversations'] },
      { id: 'ap2', question: 'Together we could', answer: 'Start a supper club where the theme changes every month. This month: West African fusion.', interests: ['food', 'cooking', 'community'] },
      { id: 'ap3', question: 'My real life superpower is', answer: 'Making strangers feel like old friends within 5 minutes. It\'s a gift and sometimes a curse.', interests: ['social', 'community', 'empathy'] },
    ],
    preferences: ['music', 'dancing', 'volunteering', 'food', 'community'],
    vitals: { age: 28, gender: 'Woman', orientation: 'Queer', ethnicity: 'Black', religion: 'Christian', datingGoals: 'Looking for a relationship' },
    showVibeSync: true, vibeSyncVisible: true, vibeSyncLabel: 'Both Thoughtful Sharers',
    bandwidthStatus: 'ready', bandwidthVisible: true,
    vibeData: { avgMessageLength: 4, avgReplyTimeMinutes: 0.4, profileReadTimeSec: 28 },
    coreValues: ['food', 'community', 'deep-conversations'],
  },
  {
    id: 'chloe', name: 'Chloe', gender: 'Female', location: 'Chelsea, NY', activityTag: 'active_today' as const,
    photos: [
      { url: chloeProfile, tags: ['hiking', 'outdoors'] },
    ],
    prompts: [
      { id: 'cp1', question: 'My non-negotiable', answer: 'Weekend mornings are sacred. Coffee, no phone, and at least 30 minutes of doing absolutely nothing.', interests: ['mindfulness', 'outdoors'] },
      { id: 'cp2', question: 'I guarantee you that', answer: 'I will out-hike you. But I\'ll also carry the snacks, so it evens out.', interests: ['hiking', 'outdoors', 'humor'] },
      { id: 'cp3', question: 'Proof I have good taste', answer: 'I\'ve found the best croissant in every neighborhood I\'ve lived in. Currently in Chelsea, it\'s Maman.', interests: ['food', 'adventure', 'exploration'] },
    ],
    vitals: { age: 26, gender: 'Woman', orientation: 'Straight', relationshipType: 'Open to options' },
    preferences: ['fitness', 'hiking', 'climbing', 'adventure', 'outdoors'],
    bandwidthStatus: 'weekend', bandwidthVisible: false,
    showVibeSync: false, vibeSyncVisible: false,
    vibeData: { avgMessageLength: 3, avgReplyTimeMinutes: 5 },
  },
  {
    id: 'mia', name: 'Mia', gender: 'Female', location: 'Greenwich Village, NY', verified: true,
    photos: [
      { url: miaProfile, tags: ['books', 'deep-conversations'] },
    ],
    prompts: [
      { id: 'mp1', question: 'A shower thought I had recently', answer: 'If our pets could talk, they\'d probably be disappointed in how much screen time we have.', interests: ['humor', 'pets', 'philosophy'] },
      { id: 'mp2', question: 'The key to my heart is', answer: 'Remembering the name of a book I mentioned once in passing and actually reading it.', interests: ['books', 'deep-conversations', 'romance'] },
      { id: 'mp3', question: 'I\'ll fall for you if', answer: 'You can make me laugh at a funeral. Too dark? Maybe. But life\'s too short for boring humor.', interests: ['humor', 'deep-conversations'] },
    ],
    preferences: ['books', 'writing', 'pets', 'deep-conversations'],
    showVibeSync: true, vibeSyncVisible: true, vibeSyncLabel: 'Shared Conversation Style',
    bandwidthStatus: 'new_vibes', bandwidthVisible: true,
    vibeData: { avgMessageLength: 6, avgReplyTimeMinutes: 0.2, profileReadTimeSec: 35 },
    coreValues: ['deep-conversations', 'philosophy', 'books'],
    vitals: { age: 25, gender: 'Woman', orientation: 'Bisexual', politics: 'Progressive', datingGoals: 'Something serious', relationshipType: 'Monogamy' },
  },
];

export const initialLikesReceived: Like[] = [
  {
    id: 'like1', fromProfileId: 'jessica', toProfileId: 'aman',
    targetType: 'prompt', targetIndex: 0,
    message: 'Your travel stories sound amazing! Where\'s next on the list?',
    timestamp: Date.now() - 3600000, read: false, refunded: false,
  },
];

export const likesReceivedProfiles: Profile[] = [
  {
    id: 'jessica', name: 'Jessica', gender: 'Female', location: 'SoHo, NY',
    photos: [
      { url: jessicaProfile, tags: ['coffee', 'social'] },
    ],
    prompts: [
      { id: 'jp1', question: 'My simple pleasures', answer: 'Coffee shop hopping and people watching.', interests: ['coffee', 'social'] },
    ],
    preferences: ['coffee', 'travel', 'social'],
    bandwidthStatus: 'ready',
    vibeData: { avgMessageLength: 3, avgReplyTimeMinutes: 1 },
  },
];

export const initialMatches: Match[] = [
  {
    id: 'match1', profileId: 'olivia',
    lastMessage: 'That hiking trail sounds incredible!',
    lastMessageTimestamp: Date.now() - 7200000,
    lastMessageFrom: 'match', unread: true, isNew: false,
  },
];

export const matchProfiles: Profile[] = [
  {
    id: 'olivia', name: 'Olivia', gender: 'Female', location: 'Upper East Side, NY',
    photos: [
      { url: oliviaProfile, tags: ['outdoors', 'city'] },
    ],
    prompts: [],
    preferences: ['hiking', 'outdoors', 'travel'],
    bandwidthStatus: 'ready',
    vibeData: { avgMessageLength: 3, avgReplyTimeMinutes: 5 },
  },
];

export const initialChatMessages: ChatMessage[] = [
  { id: 'msg1', matchId: 'match1', from: 'user', text: 'Hey Olivia! I noticed you love hiking too. Have you tried the Breakneck Ridge trail?', timestamp: Date.now() - 14400000 },
  { id: 'msg2', matchId: 'match1', from: 'match', text: 'That hiking trail sounds incredible! I\'ve been meaning to try it. Want to go sometime?', timestamp: Date.now() - 7200000 },
];

// Simple string hash for deterministic selection
function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateGhostText(sharedInterests: string[], promptAnswer: string): string {
  const lower = promptAnswer.toLowerCase();
  const hash = stableHash(lower);

  const contextPatterns: { keywords: string[]; ghosts: string[] }[] = [
    { keywords: ['silence', 'quiet', 'comfortable'], ghosts: ['What\'s your idea of a perfect quiet evening?', 'I love that — what else feels effortless to you?'] },
    { keywords: ['travel', 'trip', 'lost', 'tokyo', 'abroad', 'explore'], ghosts: ['That sounds amazing — what\'s your next destination?', 'I have a similar story! Where else have you wandered?'] },
    { keywords: ['cook', 'fridge', 'recipe', 'meal', 'kitchen', 'food'], ghosts: ['What\'s the best thing you\'ve ever made?', 'I do the same! What\'s your go-to fridge raid dish?'] },
    { keywords: ['hike', 'trail', 'mountain', 'outdoor', 'nature'], ghosts: ['What\'s your favorite trail so far?', 'I love hiking too — sunrise or sunset hikes?'] },
    { keywords: ['music', 'jukebox', 'playlist', 'song', 'dj', 'vinyl'], ghosts: ['What song is on repeat for you right now?', 'What genre gets you moving?'] },
    { keywords: ['book', 'read', 'page', 'novel', 'war and peace'], ghosts: ['What are you reading right now?', 'What book changed how you think?'] },
    { keywords: ['philosophy', 'deep', 'conversation', 'meaning', 'life', 'tick'], ghosts: ['What\'s a question you always come back to?', 'I love deep talks too — what\'s on your mind lately?'] },
    { keywords: ['laugh', 'funny', 'humor', 'joke', 'dark'], ghosts: ['Ha! What\'s the funniest thing that happened to you recently?', 'Love the humor — what makes you laugh the hardest?'] },
    { keywords: ['pizza', 'restaurant', 'bar', 'dive', 'tater'], ghosts: ['Ok I need your top 3 — share the list!', 'What\'s your #1 spot right now?'] },
    { keywords: ['game', 'scrabble', 'winning', 'streak', 'board'], ghosts: ['Challenge accepted — when and where?', 'What other games are you unbeatable at?'] },
    { keywords: ['spreadsheet', 'ranking', 'list', 'entries'], ghosts: ['I respect the dedication! What\'s #1 on the list?', 'Can I see this spreadsheet? For research purposes.'] },
    { keywords: ['yoga', 'meditat', 'mindful', 'phone', 'boundary'], ghosts: ['I respect that! What helps you stay present?', 'That\'s a great boundary — what inspired it?'] },
    { keywords: ['art', 'gallery', 'museum', 'paint'], ghosts: ['What artist are you into right now?', 'What\'s the last exhibit that moved you?'] },
    { keywords: ['wine', 'drink', 'cocktail'], ghosts: ['Red or white — what\'s your go-to?', 'What\'s the best wine you\'ve had recently?'] },
    { keywords: ['dog', 'cat', 'pet', 'animal'], ghosts: ['What kind of pet do you have?', 'Tell me everything about your pet!'] },
    { keywords: ['voice note', 'text', 'type', 'autocorrect'], ghosts: ['Ha, I\'m the same! What\'s your worst autocorrect moment?', 'Voice notes are underrated — what do you rant about most?'] },
    { keywords: ['supper club', 'dinner', 'theme', 'fusion'], ghosts: ['I\'d be a regular! What theme would you start with?', 'That sounds incredible — what cuisine inspires you most?'] },
    { keywords: ['stranger', 'friend', 'social', 'people'], ghosts: ['That\'s a superpower! What\'s your secret?', 'I love that energy — where do your best convos happen?'] },
    { keywords: ['last meal', 'choose', 'everything about'], ghosts: ['Ok — mine would be... actually, you first!', 'Great question! What would yours be?'] },
    { keywords: ['hidden gem', 'tour guide', 'places', 'city'], ghosts: ['I\'m intrigued — what\'s one spot I need to try?', 'Show me your favorite hidden gem!'] },
    { keywords: ['coping', 'therapist', 'mechanism'], ghosts: ['Honestly, same — what\'s your best comfort recipe?', 'That\'s the best kind of therapy! What did you make last?'] },
    { keywords: ['croissant', 'bakery', 'pastry', 'maman'], ghosts: ['A fellow croissant connoisseur! What makes a perfect one?', 'I have opinions on this too — compare notes?'] },
    { keywords: ['shower thought', 'screen time', 'pet'], ghosts: ['Ha! What other shower thoughts keep you up?', 'So true — what would your pet say about you?'] },
    { keywords: ['remember', 'book i mentioned', 'key to my heart'], ghosts: ['Ok noted — what should I read first?', 'What book has stayed with you the longest?'] },
    { keywords: ['funeral', 'too dark', 'life\'s too short'], ghosts: ['I appreciate the honesty! What\'s your go-to dark joke?', 'Life IS too short — what else do you not take seriously?'] },
  ];

  for (const pattern of contextPatterns) {
    if (pattern.keywords.some((kw) => lower.includes(kw))) {
      return pattern.ghosts[hash % pattern.ghosts.length];
    }
  }

  if (sharedInterests.length > 0) {
    return `I'm into ${sharedInterests[0]} too — tell me more!`;
  }

  return 'You have something in common — say hi!';
}
