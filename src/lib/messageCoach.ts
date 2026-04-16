import { Profile } from '@/types';

export type NudgeType = 'positive' | 'warning' | 'tone' | 'block';

export interface CoachNudge {
  type: NudgeType;
  text: string;
  explanation: string;
}

// Severity-ordered analysis: block > warning > tone > positive
export function analyzeMessage(message: string, recipientProfile: Profile): CoachNudge | null {
  if (!message.trim()) return null;

  const lower = message.toLowerCase().trim();
  const words = message.trim().split(/\s+/);
  const wordCount = words.length;
  const recipientInterests = recipientProfile.preferences || [];
  const recipientName = recipientProfile.name;

  // ===== HARD BLOCKS — immediate, no ambiguity =====

  // Harmful, threatening, violent
  const harmfulPatterns = /\b(kill|murder|hurt|stalk|die|threat|attack|punch|hit you|beat you|destroy you|harm)\b/i;
  if (harmfulPatterns.test(message)) {
    return {
      type: 'block',
      text: "This message can't be sent — it contains harmful language",
      explanation: "Messages with threatening or violent language are never sent. This protects everyone on the platform.",
    };
  }

  // Sexually explicit or physically forward
  const explicitPatterns = /\b(sexy|hot body|hookup|hook up|come over|your place|my place|netflix and chill|send pics|nudes|send me photos|what are you wearing|in bed|sleep with|have sex|wanna fuck|bang|horny|turn me on|get naked|undress)\b/i;
  if (explicitPatterns.test(message)) {
    return {
      type: 'block',
      text: "This message can't be sent — keep it respectful",
      explanation: "Sexually forward messages aren't allowed. Try connecting with something meaningful from her profile instead.",
    };
  }

  // Manipulative, coercive, pressure-based
  const manipulativePatterns = /\b(you owe me|give me a chance|why won't you|you'll regret|don't ignore|answer me|respond|you're missing out|last chance|now or never)\b/i;
  if (manipulativePatterns.test(message)) {
    return {
      type: 'block',
      text: "This message can't be sent — it reads as pressuring",
      explanation: "Coercive or pressure-based language isn't allowed. Good connections happen naturally — try a lighter approach.",
    };
  }

  // Disrespectful, demeaning, objectifying
  const disrespectfulPatterns = /\b(stupid|dumb|ugly|fat|skinny|crazy|psycho|b[i!]tch|wh[o0]re|sl[u!]t|trash|pathetic|worthless|desperate)\b/i;
  if (disrespectfulPatterns.test(message)) {
    return {
      type: 'block',
      text: "This message can't be sent — keep things respectful",
      explanation: "Demeaning or disrespectful language is never allowed on the platform.",
    };
  }

  // Self-harm or harm to others
  const selfHarmPatterns = /\b(kill myself|end it all|suicide|self.harm|cut myself|don't want to live)\b/i;
  if (selfHarmPatterns.test(message)) {
    return {
      type: 'block',
      text: "If you're struggling, please reach out to a helpline",
      explanation: "If you or someone you know needs support, contact the 988 Suicide & Crisis Lifeline by calling or texting 988.",
    };
  }

  // ===== FIRM REDIRECTS (warnings) =====

  // Pushing for personal contact too early
  const contactPatterns = /\b(my number|your number|insta|instagram|snapchat|whatsapp|phone number|text me at|call me|add me|follow me|dm me|give me your)\b/i;
  if (contactPatterns.test(message)) {
    return {
      type: 'warning',
      text: `Too early for contact info — get to know ${recipientName} here first`,
      explanation: "Asking for personal contact in an opener feels rushed. Build a connection through the app first — it shows patience and respect.",
    };
  }

  // Premature relationship/future references
  const prematurePatterns = /\b(girlfriend|boyfriend|wife|husband|marry|wedding|our kids|move in|meet my parents|exclusive|relationship status|be mine|be my)\b/i;
  if (prematurePatterns.test(message)) {
    return {
      type: 'warning',
      text: "Way too early for that — start with her interests instead",
      explanation: "Jumping to relationship talk in an opener can feel overwhelming. Keep it light and connect over shared interests first.",
    };
  }

  // Overconfidence / arrogance
  const arrogancePatterns = /\b(i'm the best|you're lucky|luckiest girl|you won't find|better than anyone|no one else|i'm a catch|you should be|grateful|privileged)\b/i;
  if (arrogancePatterns.test(message)) {
    return {
      type: 'warning',
      text: "Reads a bit overconfident — curiosity works better than certainty",
      explanation: `Try showing genuine interest in ${recipientName}'s profile. Confidence is great, but curiosity is more attractive in an opener.`,
    };
  }

  // Desperation / neediness signals
  const desperationPatterns = /\b(please respond|i'm so lonely|no one likes me|you're my only|give me a shot|i'll do anything|please talk to me|been single for|nobody wants|please just)\b/i;
  if (desperationPatterns.test(message)) {
    return {
      type: 'warning',
      text: "This reads as insecure — lead with confidence and curiosity",
      explanation: "You have plenty to offer. Focus on what genuinely interests you about her profile — that confidence comes through naturally.",
    };
  }

  // Passive aggression / subtle negativity
  const passiveAggressivePatterns = /\b(probably won't reply|you'll ignore|girls never|women always|bet you get|must be nice|i guess|whatever|if you even care|not like you)\b/i;
  if (passiveAggressivePatterns.test(message)) {
    return {
      type: 'warning',
      text: "Negative energy reads through text — try a warmer angle",
      explanation: "Even subtle negativity can put someone off. Start with genuine curiosity about something from her profile instead.",
    };
  }

  // Appearance-focused / surface-level objectifying
  const appearancePatterns = /\b(angel|goddess|beautiful|stunning|gorgeous|prettiest|most beautiful|dream girl|out of my league|fell from heaven|so hot|perfect face|perfect body|your eyes|your smile|your lips|your hair|your legs|so pretty|so cute|cutie|babe|baby girl|hottie|smokeshow)\b/i;
  if (appearancePatterns.test(message)) {
    return {
      type: 'warning',
      text: `Focus on who she is, not how she looks — try referencing her profile`,
      explanation: `Appearance-based openers feel surface-level. ${recipientName}'s profile has great material — connect with her interests or what she wrote.`,
    };
  }

  // Culturally insensitive / assumptive
  const insensitivePatterns = /\b(where are you really from|you don't look|for a [a-z]+ girl|exotic|you speak good english|is that your real|your people|your kind|in your country|in your culture)\b/i;
  if (insensitivePatterns.test(message)) {
    return {
      type: 'warning',
      text: "This could come across as assumptive — connect over shared interests instead",
      explanation: "Questions about someone's background can feel othering in an opener. Focus on what you have in common from her profile.",
    };
  }

  // Too long — overwhelming for opener
  if (wordCount > 40) {
    return {
      type: 'warning',
      text: "A bit long for an opener — keep it easy to respond to",
      explanation: "Shorter messages get more replies. Save the deeper conversation for after you match. Aim for 10-25 words.",
    };
  }

  // Sarcasm that could land wrong
  const sarcasmPatterns = /\b(yeah right|sure you do|oh really|must be hard|poor you|how original|never heard that|very unique|so special)\b/i;
  if (sarcasmPatterns.test(message)) {
    return {
      type: 'warning',
      text: "Sarcasm can land wrong without context — try sincerity instead",
      explanation: `Tone doesn't always come through in text. ${recipientName} might read this differently than you intend. Try a more direct, warm approach.`,
    };
  }

  // Generic / copy-paste feeling
  if (/^(hey|hi|hello|sup|yo|what's up|how are you|how's it going|hey there|hi there|hello there|hey beautiful|hey gorgeous|hey cutie)[!?.]*$/i.test(lower)) {
    return {
      type: 'warning',
      text: `Too generic — ${recipientName}'s profile has great material to work with`,
      explanation: "Generic greetings rarely get replies. Pick something specific from her profile — a prompt answer, a shared interest, a detail that caught your eye.",
    };
  }

  // Too short / low effort (but not a greeting)
  if (wordCount <= 2 && !message.includes('?')) {
    return {
      type: 'warning',
      text: `Too brief — ${recipientName}'s profile is specific, match that energy`,
      explanation: "Short messages don't show enough interest. Reference something specific from her profile to stand out.",
    };
  }

  // Self-centred message detection (talks only about sender)
  const selfWords = (lower.match(/\b(i |i'm|i've|i'd|i'll|my |mine|myself)\b/g) || []).length;
  const youWords = (lower.match(/\b(you|your|you're|you've|you'd)\b/g) || []).length;
  if (wordCount >= 8 && selfWords >= 4 && youWords === 0) {
    return {
      type: 'tone',
      text: `Make it about her — ask ${recipientName} something from her profile`,
      explanation: "This opener focuses too much on you. The best messages connect your interests to hers. Try asking about something she wrote.",
    };
  }

  // ===== CHECK PROFILE REFERENCES =====
  const referencesProfile = recipientInterests.some(interest =>
    lower.includes(interest.toLowerCase())
  ) || recipientProfile.prompts.some(p => {
    const keywords = p.answer.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    return keywords.some(kw => lower.includes(kw));
  });

  const hasQuestion = message.includes('?');

  // ===== POSITIVE REINFORCEMENT =====

  if (referencesProfile && hasQuestion && wordCount >= 5) {
    return {
      type: 'positive',
      text: `Fits ${recipientName}'s profile and your best style — strong message`,
      explanation: `You referenced her profile and asked a question. This combination gets the best response rates.`,
    };
  }

  if (referencesProfile && wordCount >= 5) {
    return {
      type: 'positive',
      text: `Connects well to ${recipientName}'s profile — good angle`,
      explanation: "You picked up on something specific from her profile. This shows genuine interest.",
    };
  }

  if (hasQuestion && wordCount >= 5) {
    return {
      type: 'positive',
      text: "This tone has worked well for you — keep it",
      explanation: "Thoughtful questions that show curiosity tend to get the best response rates.",
    };
  }

  // ===== TONE SUGGESTIONS — encouraging redirects =====

  if (!referencesProfile && !hasQuestion && wordCount >= 4) {
    return {
      type: 'tone',
      text: `Try asking ${recipientName} something about her profile`,
      explanation: `Messages with a question get significantly more replies. Her prompts and interests have great material to work with.`,
    };
  }

  if (!hasQuestion && wordCount >= 3) {
    return {
      type: 'tone',
      text: `${recipientName}'s profile suggests warmth works well — add a question`,
      explanation: "Try adding a bit more personality or warmth. A question also helps invite a response.",
    };
  }

  // Short but not terrible
  if (wordCount >= 1 && wordCount <= 3 && hasQuestion) {
    return {
      type: 'tone',
      text: `Good instinct with the question — add a bit more to show you read her profile`,
      explanation: "Questions are great, but a few more words referencing her profile will make it feel personal.",
    };
  }

  return null;
}

// Pre-send: block or warning messages get a confirmation sheet
export function shouldShowPreSendWarning(message: string, recipientProfile: Profile): CoachNudge | null {
  const nudge = analyzeMessage(message, recipientProfile);
  if (nudge && (nudge.type === 'warning' || nudge.type === 'block')) return nudge;
  return null;
}

// Generate a brief encouraging nudge based on a profile (for post-like nudges)
export function generateLikeNudge(recipientProfile: Profile): string {
  const name = recipientProfile.name;
  const prompts = recipientProfile.prompts;
  const interests = recipientProfile.preferences || [];
  
  // Pick the first prompt with interests for a specific nudge
  const richPrompt = prompts.find(p => p.interests && p.interests.length > 0);
  
  if (richPrompt && richPrompt.interests) {
    const topic = richPrompt.interests[0];
    const nudges = [
      `${name} values ${topic} — a message about that could go far`,
      `${name} mentioned ${topic} — likes with a note about shared interests get more replies`,
      `Tip: ${name} seems to love ${topic} — a quick note referencing that stands out`,
    ];
    return nudges[Math.floor(Math.random() * nudges.length)];
  }

  if (interests.length > 0) {
    const interest = interests[Math.floor(Math.random() * interests.length)];
    return `${name} is into ${interest} — next time, a note about that could spark a great conversation`;
  }

  return `Likes with a message get 3x more replies — ${name}'s profile has great material to work with`;
}
