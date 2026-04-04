import { Profile } from '@/types';

import jessica2 from '@/assets/jessica-2-new.jpg';
import jessica3 from '@/assets/jessica-3-new.jpg';
import olivia2 from '@/assets/olivia-2-new.jpg';
import olivia3 from '@/assets/olivia-3-new.jpg';
import sarah4 from '@/assets/sarah-4-new.jpg';
import maya3 from '@/assets/maya-3-new.jpg';
import emma3 from '@/assets/emma-3-new.jpg';

export const standoutProfiles: Profile[] = [
  {
    id: 'standout-nina',
    name: 'Nina',
    gender: 'Female',
    location: 'East Village, NY',
    verified: true,
    photos: [{ url: jessica2, tags: ['fashion', 'city'] }],
    prompts: [
      { id: 'sn1', question: 'A perfect Sunday looks like', answer: "Farmers market at 10, cooking something new by noon, nap by 2. No negotiation on the nap.", interests: ['food', 'relaxation'] },
      { id: 'sn2', question: 'A perfect Sunday looks like', answer: "Farmers market at 10, cooking something new by noon, nap by 2. No negotiation on the nap.", interests: ['food', 'relaxation'] },
    ],
    preferences: ['fashion', 'art', 'coffee'],
    vibeData: { avgMessageLength: 4, avgReplyTimeMinutes: 1 },
    vitals: { age: 26, gender: 'Woman', orientation: 'Straight' },
  },
  {
    id: 'standout-priya',
    name: 'Priya',
    gender: 'Female',
    location: 'Tribeca, NY',
    verified: false,
    photos: [{ url: olivia2, tags: ['travel', 'adventure'] }],
    prompts: [
      { id: 'sp1', question: 'The key to my heart is', answer: "A spontaneous road trip with zero planning and a really good playlist.", interests: ['travel', 'music'] },
      { id: 'sp2', question: 'My comfort movie is', answer: "The Grand Budapest Hotel. I've seen it 14 times and I notice something new every single time.", interests: ['film', 'art'] },
    ],
    preferences: ['travel', 'film', 'yoga'],
    vibeData: { avgMessageLength: 5, avgReplyTimeMinutes: 0.5 },
    vitals: { age: 27, gender: 'Woman', orientation: 'Straight' },
  },
  {
    id: 'standout-zara',
    name: 'Zara',
    gender: 'Female',
    location: 'Bushwick, NY',
    verified: true,
    photos: [{ url: sarah4, tags: ['music', 'creative'] }],
    prompts: [
      { id: 'sz1', question: 'I go crazy for', answer: "Hole-in-the-wall restaurants where the menu is handwritten and the portions are enormous.", interests: ['food', 'adventure'] },
      { id: 'sz2', question: 'I go crazy for', answer: "Hole-in-the-wall restaurants where the menu is handwritten and the portions are enormous.", interests: ['food', 'adventure'] },
    ],
    preferences: ['music', 'art', 'nightlife'],
    vibeData: { avgMessageLength: 3, avgReplyTimeMinutes: 2 },
    vitals: { age: 25, gender: 'Woman', orientation: 'Bisexual' },
  },
  {
    id: 'standout-luna',
    name: 'Luna',
    gender: 'Female',
    location: 'Park Slope, NY',
    verified: true,
    photos: [{ url: maya3, tags: ['outdoors', 'wellness'] }],
    prompts: [
      { id: 'sl1', question: 'My simple pleasures', answer: "Morning yoga with the windows open, a homemade latte, and absolutely zero notifications.", interests: ['wellness', 'mindfulness'] },
      { id: 'sl2', question: 'The way to win me over is', answer: "Remember something small I said three weeks ago. That's the real flex.", interests: ['romance', 'deep-conversations'] },
    ],
    preferences: ['wellness', 'hiking', 'pets'],
    vibeData: { avgMessageLength: 4, avgReplyTimeMinutes: 1.5 },
    vitals: { age: 28, gender: 'Woman', orientation: 'Straight' },
  },
  {
    id: 'standout-isla',
    name: 'Isla',
    gender: 'Female',
    location: 'Nolita, NY',
    verified: false,
    photos: [{ url: emma3, tags: ['fashion', 'social'] }],
    prompts: [
      { id: 'si1', question: "I'll fall for you if", answer: "You remember my coffee order after hearing it once. That's basically a proposal.", interests: ['romance', 'coffee'] },
      { id: 'si2', question: 'My biggest green flag is', answer: "I'll drive 40 minutes for the right croissant. That's dedication, not obsession.", interests: ['food', 'adventure'] },
    ],
    preferences: ['fashion', 'coffee', 'travel'],
    vibeData: { avgMessageLength: 3, avgReplyTimeMinutes: 3 },
    vitals: { age: 24, gender: 'Woman', orientation: 'Straight' },
  },
];
