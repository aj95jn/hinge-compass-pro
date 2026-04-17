import { Profile } from '@/types';

export type NudgeType = 'positive' | 'warning' | 'tone' | 'block';

export interface CoachNudge {
  type: NudgeType;
  text: string;
  explanation: string;
}

// Severity-ordered analysis. NOTE: 'block' type is retained for visual styling
// (red accent for harmful/explicit content) but the app NEVER prevents sending.
// Sending is always allowed — coaching is advisory only.
export function analyzeMessage(message: string, recipientProfile: Profile): CoachNudge | null {
  if (!message.trim()) return null;

  const lower = message.toLowerCase().trim();
  const words = message.trim().split(/\s+/);
  const wordCount = words.length;
  const recipientInterests = recipientProfile.preferences || [];
  const recipientName = recipientProfile.name;

  // ===== HIGH-SEVERITY WARNINGS (red accent) =====

  const harmfulPatterns = /\b(kill|murder|hurt|stalk|die|threat|attack|punch|hit you|beat you|destroy you|harm)\b/i;
  if (harmfulPatterns.test(message)) {
    return {
      type: 'block',
      text: `This sounds harsh — try something warmer about ${recipientName}'s profile`,
      explanation: "Strong or threatening words land badly in openers. Lead with curiosity about something she wrote.",
    };
  }

  const explicitPatterns = /\b(sexy|hot body|hookup|hook up|come over|your place|my place|netflix and chill|send pics|nudes|send me photos|what are you wearing|in bed|sleep with|have sex|wanna fuck|bang|horny|turn me on|get naked|undress)\b/i;
  if (explicitPatterns.test(message)) {
    return {
      type: 'block',
      text: `Too forward for an opener — connect with something from her profile`,
      explanation: "Sexual openers rarely get replies. Try referencing a prompt or shared interest instead.",
    };
  }

  const manipulativePatterns = /\b(you owe me|give me a chance|why won't you|you'll regret|don't ignore|answer me|you're missing out|last chance|now or never)\b/i;
  if (manipulativePatterns.test(message)) {
    return {
      type: 'block',
      text: `This reads as pressuring — try a lighter angle on her profile`,
      explanation: "Pressure-based language puts people off. A genuine question about something she shared works better.",
    };
  }

  const disrespectfulPatterns = /\b(stupid|dumb|ugly|fat|skinny|crazy|psycho|b[i!]tch|wh[o0]re|sl[u!]t|trash|pathetic|worthless|desperate)\b/i;
  if (disrespectfulPatterns.test(message)) {
    return {
      type: 'block',
      text: `That word will land wrong — try referencing something she wrote instead`,
      explanation: "Words like that rarely come across as intended. Lead with warmth about her profile.",
    };
  }

  const selfHarmPatterns = /\b(kill myself|end it all|suicide|self.harm|cut myself|don't want to live)\b/i;
  if (selfHarmPatterns.test(message)) {
    return {
      type: 'block',
      text: "If you're struggling, please reach out — 988 is there 24/7",
      explanation: "If you or someone you know needs support, contact the 988 Suicide & Crisis Lifeline by calling or texting 988.",
    };
  }

  // ===== FIRM REDIRECTS (warnings) =====

  const contactPatterns = /\b(my number|your number|insta|instagram|snapchat|whatsapp|phone number|text me at|call me|add me|follow me|dm me|give me your)\b/i;
  if (contactPatterns.test(message)) {
    return {
      type: 'warning',
      text: `Too early for contact info — get to know ${recipientName} here first`,
      explanation: "Asking for personal contact in an opener feels rushed. Build a connection through the app first.",
    };
  }

  const prematurePatterns = /\b(girlfriend|boyfriend|wife|husband|marry|wedding|our kids|move in|meet my parents|exclusive|relationship status|be mine|be my)\b/i;
  if (prematurePatterns.test(message)) {
    return {
      type: 'warning',
      text: "Way too early for that — start with her interests instead",
      explanation: "Jumping to relationship talk in an opener can feel overwhelming. Keep it light and connect over shared interests first.",
    };
  }

  const arrogancePatterns = /\b(i'm the best|you're lucky|luckiest girl|you won't find|better than anyone|no one else|i'm a catch|you should be|grateful|privileged)\b/i;
  if (arrogancePatterns.test(message)) {
    return {
      type: 'warning',
      text: "Reads a bit overconfident — curiosity works better than certainty",
      explanation: `Try showing genuine interest in ${recipientName}'s profile. Curiosity is more attractive in an opener.`,
    };
  }

  const desperationPatterns = /\b(please respond|i'm so lonely|no one likes me|you're my only|give me a shot|i'll do anything|please talk to me|been single for|nobody wants|please just)\b/i;
  if (desperationPatterns.test(message)) {
    return {
      type: 'warning',
      text: "Lead with confidence — focus on what caught your eye in her profile",
      explanation: "Focus on what genuinely interests you about her profile — that confidence comes through naturally.",
    };
  }

  const passiveAggressivePatterns = /\b(probably won't reply|you'll ignore|girls never|women always|bet you get|must be nice|i guess|whatever|if you even care|not like you)\b/i;
  if (passiveAggressivePatterns.test(message)) {
    return {
      type: 'warning',
      text: "Negative energy reads through text — try a warmer angle",
      explanation: "Even subtle negativity can put someone off. Start with genuine curiosity about something from her profile instead.",
    };
  }

  const appearancePatterns = /\b(angel|goddess|beautiful|stunning|gorgeous|prettiest|most beautiful|dream girl|out of my league|fell from heaven|so hot|perfect face|perfect body|your eyes|your smile|your lips|your hair|your legs|so pretty|so cute|cutie|babe|baby girl|hottie|smokeshow)\b/i;
  if (appearancePatterns.test(message)) {
    return {
      type: 'warning',
      text: `Focus on who she is, not how she looks — try referencing her profile`,
      explanation: `${recipientName}'s profile has great material — connect with her interests or what she wrote.`,
    };
  }

  const insensitivePatterns = /\b(where are you really from|you don't look|for a [a-z]+ girl|exotic|you speak good english|is that your real|your people|your kind|in your country|in your culture)\b/i;
  if (insensitivePatterns.test(message)) {
    return {
      type: 'warning',
      text: "This could come across as assumptive — connect over shared interests instead",
      explanation: "Questions about someone's background can feel othering in an opener. Focus on what you have in common from her profile.",
    };
  }

  if (wordCount > 40) {
    return {
      type: 'warning',
      text: "A bit long for an opener — keep it easy to respond to",
      explanation: "Shorter messages get more replies. Save the deeper conversation for after you match. Aim for 10-25 words.",
    };
  }

  const sarcasmPatterns = /\b(yeah right|sure you do|oh really|must be hard|poor you|how original|never heard that|very unique|so special)\b/i;
  if (sarcasmPatterns.test(message)) {
    return {
      type: 'warning',
      text: "Sarcasm can land wrong without context — try sincerity instead",
      explanation: `Tone doesn't always come through in text. ${recipientName} might read this differently than you intend.`,
    };
  }

  // ===== BLAND / WEAK / GENERIC — caught with same attention as anything else =====

  // Filler-only or near-gibberish (bla, blah, lol, lmao, etc.)
  if (/^(b+l+a+h*|l+o+l+|l+m+a+o+|h+a+h+a+|hehe+|h+m+|u+h+|o+k+|k+|m+e+h+)[!?.\s]*$/i.test(lower)) {
    return {
      type: 'warning',
      text: `That won't land — try something specific from ${recipientName}'s profile`,
      explanation: "Filler messages don't show interest. Reference something she wrote — a prompt, an interest, anything specific.",
    };
  }

  // Bland low-effort reactions ("oh nice", "haha same", "cool", "nice profile", etc.)
  const blandPatterns = /^(oh nice|nice|cool|sweet|haha same|same|lol same|interesting|wow|nice profile|nice pic|nice pics|love it|love this|cute|awesome|dope|great|fire|amazing)[!?.\s]*$/i;
  if (blandPatterns.test(lower)) {
    return {
      type: 'warning',
      text: `Too bland — pick something specific from ${recipientName}'s profile to react to`,
      explanation: "One-word reactions don't invite a reply. Tie it to a specific prompt or detail she shared.",
    };
  }

  // Generic greetings
  if (/^(hey|hi|hello|sup|yo|what's up|how are you|how's it going|hey there|hi there|hello there|hey beautiful|hey gorgeous|hey cutie)[!?.]*$/i.test(lower)) {
    return {
      type: 'warning',
      text: `Too generic — ${recipientName}'s profile has great material to work with`,
      explanation: "Generic greetings rarely get replies. Pick something specific from her profile — a prompt answer, a shared interest, a detail that caught your eye.",
    };
  }

  // Too short / low effort (<= 3 words, no question)
  if (wordCount <= 3 && !message.includes('?')) {
    return {
      type: 'warning',
      text: `Too brief — ${recipientName}'s profile is specific, match that energy`,
      explanation: "Short messages don't show enough interest. Reference something specific from her profile to stand out.",
    };
  }

  // Self-centred message detection
  const selfWords = (lower.match(/\b(i |i'm|i've|i'd|i'll|my |mine|myself)\b/g) || []).length;
  const youWords = (lower.match(/\b(you|your|you're|you've|you'd)\b/g) || []).length;
  if (wordCount >= 8 && selfWords >= 4 && youWords === 0) {
    return {
      type: 'tone',
      text: `Make it about her — ask ${recipientName} something from her profile`,
      explanation: "This opener focuses too much on you. The best messages connect your interests to hers.",
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
      text: "Thoughtful question — this style gets replies",
      explanation: "Thoughtful questions that show curiosity tend to get the best response rates.",
    };
  }

  // ===== TONE SUGGESTIONS — encouraging redirects =====

  if (!referencesProfile && !hasQuestion && wordCount >= 4) {
    return {
      type: 'tone',
      text: `Try asking ${recipientName} something about her profile`,
      explanation: `Messages with a question get significantly more replies. Her prompts and interests have great material.`,
    };
  }

  if (!hasQuestion && wordCount >= 4) {
    return {
      type: 'tone',
      text: `Add a question — invites ${recipientName} to reply`,
      explanation: "A question helps invite a response and keeps the conversation moving.",
    };
  }

  return null;
}

// Generate a brief encouraging nudge based on a profile (for Add-a-Note pre-send prompt)
export function generateLikeNudge(recipientProfile: Profile): string {
  const name = recipientProfile.name;
  const prompts = recipientProfile.prompts;
  const interests = recipientProfile.preferences || [];

  const richPrompt = prompts.find(p => p.interests && p.interests.length > 0);

  if (richPrompt && richPrompt.interests) {
    const topic = richPrompt.interests[0];
    const nudges = [
      `${name} values ${topic} — a note about that could go far`,
      `${name} mentioned ${topic} — likes with a note get more replies`,
      `${name} seems to love ${topic} — a quick note referencing that stands out`,
    ];
    return nudges[Math.floor(Math.random() * nudges.length)];
  }

  if (interests.length > 0) {
    const interest = interests[Math.floor(Math.random() * interests.length)];
    return `${name} is into ${interest} — a note about that could spark a great conversation`;
  }

  return `Likes with a message get 3x more replies — ${name}'s profile has great material`;
}
