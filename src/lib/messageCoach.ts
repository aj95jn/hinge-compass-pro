import { Profile } from '@/types';

export type NudgeType = 'positive' | 'warning' | 'tone';

export interface CoachNudge {
  type: NudgeType;
  text: string;
  explanation: string;
}

// Simulated message coach analysis — deterministic rules based on message content + profile
export function analyzeMessage(message: string, recipientProfile: Profile): CoachNudge | null {
  if (!message.trim() || message.trim().length < 3) return null;

  const lower = message.toLowerCase();
  const words = message.trim().split(/\s+/);
  const promptTexts = recipientProfile.prompts.map(p => p.answer.toLowerCase()).join(' ');
  const recipientInterests = recipientProfile.preferences || [];

  // --- Hard guardrails: flag inappropriate content ---
  const inappropriatePatterns = /\b(sexy|hot body|hookup|hook up|come over|your place|my place|netflix and chill|send pics|nudes)\b/i;
  if (inappropriatePatterns.test(message)) {
    return {
      type: 'warning',
      text: "This reads as too forward — try something more thoughtful",
      explanation: "Messages that are overly forward tend to get fewer replies. Try connecting with something from her profile instead.",
    };
  }

  // --- Warning: too short / generic ---
  if (words.length <= 2 && !message.includes('?')) {
    return {
      type: 'warning',
      text: "Too brief — her profile is specific, match that energy",
      explanation: "Short generic messages get fewer replies. Reference something specific from her profile.",
    };
  }

  if (/^(hey|hi|hello|sup|yo|what's up|how are you|how's it going)[!?.]*$/i.test(lower.trim())) {
    return {
      type: 'warning',
      text: "Too generic — try referencing something she wrote",
      explanation: "Generic greetings rarely get replies. Her profile has great material to work with.",
    };
  }

  // --- Warning: cheesy / flattery ---
  const cheesyPatterns = /\b(angel|goddess|beautiful|stunning|gorgeous|prettiest|most beautiful|dream girl|out of my league|fell from heaven)\b/i;
  if (cheesyPatterns.test(message)) {
    return {
      type: 'warning',
      text: "Reads a bit cheesy — she tends to prefer genuine over flattery",
      explanation: "Compliment-heavy openers underperform. Try connecting over a shared interest or asking about something specific.",
    };
  }

  // --- Warning: too long ---
  if (words.length > 40) {
    return {
      type: 'warning',
      text: "A bit long — shorter messages tend to get more replies",
      explanation: "Keep your opener concise and easy to respond to. Save the longer conversations for after matching.",
    };
  }

  // --- Check for profile references ---
  const referencesProfile = recipientInterests.some(interest => 
    lower.includes(interest.toLowerCase())
  ) || recipientProfile.prompts.some(p => {
    const keywords = p.answer.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    return keywords.some(kw => lower.includes(kw));
  });

  // --- Positive: references profile + has question ---
  const hasQuestion = message.includes('?');
  
  if (referencesProfile && hasQuestion) {
    return {
      type: 'positive',
      text: "Fits her profile and your best style — strong message",
      explanation: "You referenced her profile and asked a question. This combination gets the best response rates.",
    };
  }

  if (referencesProfile) {
    return {
      type: 'positive',
      text: "Connects well to her profile — good angle",
      explanation: "You picked up on something specific from her profile. This shows genuine interest.",
    };
  }

  if (hasQuestion && words.length >= 5) {
    return {
      type: 'positive',
      text: "This tone has worked well for you — keep it",
      explanation: "Thoughtful questions that show curiosity tend to get the best response rates.",
    };
  }

  // --- Tone suggestion: no profile reference, no question ---
  if (!referencesProfile && !hasQuestion && words.length >= 4) {
    return {
      type: 'tone',
      text: "Could be more curious — ask her something specific",
      explanation: "Messages with a question get significantly more replies. Try asking about something from her profile.",
    };
  }

  // --- Tone: flat / could use warmth ---
  if (!hasQuestion && words.length >= 3) {
    return {
      type: 'tone',
      text: "Her profile suggests warmth works well — yours is a little flat",
      explanation: "Try adding a bit more personality or warmth. A question also helps invite a response.",
    };
  }

  return null;
}

// Check if a message is likely to underperform (for pre-send check)
export function shouldShowPreSendWarning(message: string, recipientProfile: Profile): CoachNudge | null {
  const nudge = analyzeMessage(message, recipientProfile);
  if (nudge && nudge.type === 'warning') return nudge;
  return null;
}
