import { Profile } from '@/types';

export type NudgeType = 'positive' | 'warning' | 'tone' | 'block';

export interface CoachNudge {
  type: NudgeType;
  text: string;
  explanation: string;
}

export interface UserHistorySignals {
  // Tone patterns observed in past conversations
  repliesWhenAskingQuestions?: number; // 0-1 reply rate when user opens with a question
  repliesWhenGeneric?: number; // 0-1 reply rate on generic openers
  repliesWhenReferencingProfile?: number; // 0-1 when referencing recipient's profile
  unmatchedAfterForward?: number; // count of unmatches after forward openers
  silenceAfterCheesy?: number; // count of no-replies after cheesy openers
  bestPerformingStyle?: 'question-led' | 'observation-led' | 'humor-led' | 'shared-interest';
  avgRepliedMessageLength?: number; // avg word count of openers that got replies
}

// Default signals derived from the demo user's vibe profile.
// In production this would come from the user's actual messaging history.
const DEFAULT_USER_HISTORY: UserHistorySignals = {
  repliesWhenAskingQuestions: 0.62,
  repliesWhenGeneric: 0.08,
  repliesWhenReferencingProfile: 0.71,
  unmatchedAfterForward: 3,
  silenceAfterCheesy: 5,
  bestPerformingStyle: 'question-led',
  avgRepliedMessageLength: 18,
};

// Helper: identify recipient's "profile signature" — depth, playfulness, intellect, etc.
type ProfileSignature = 'depth-seeker' | 'playful' | 'intellectual' | 'adventurous' | 'creative' | 'grounded';

function getProfileSignature(profile: Profile): ProfileSignature {
  const allText = profile.prompts.map(p => p.answer.toLowerCase()).join(' ');
  const interests = (profile.preferences || []).map(i => i.toLowerCase());
  const values = (profile.coreValues || []).map(v => v.toLowerCase());
  const combined = [...interests, ...values, allText].join(' ');

  if (/philosophy|deep|meaning|values|silence|boundary|mindful|therap/.test(combined)) return 'depth-seeker';
  if (/book|read|art|museum|intellectual|writing|literature/.test(combined)) return 'intellectual';
  if (/travel|hiking|adventure|outdoor|explore|climb|surf/.test(combined)) return 'adventurous';
  if (/music|art|create|design|paint|photograph|film/.test(combined)) return 'creative';
  if (/humor|funny|dorky|weirdly|joke|laugh|silly|tot|pizza|karaoke/.test(combined)) return 'playful';
  return 'grounded';
}

function getSignatureDescriptor(sig: ProfileSignature): string {
  const map: Record<ProfileSignature, string> = {
    'depth-seeker': 'depth and intentionality',
    'playful': 'wit and lightness',
    'intellectual': 'curiosity and ideas',
    'adventurous': 'experiences and stories',
    'creative': 'craft and expression',
    'grounded': 'authenticity and warmth',
  };
  return map[sig];
}

// Severity-ordered analysis. Cross-references recipient profile signature + user history.
// 'block' type is retained for visual styling (red accent for harmful/explicit content)
// but the app NEVER prevents sending. Sending is always allowed — coaching is advisory only.
export function analyzeMessage(
  message: string,
  recipientProfile: Profile,
  userProfile?: Profile,
  history: UserHistorySignals = DEFAULT_USER_HISTORY,
): CoachNudge | null {
  if (!message.trim()) return null;

  const lower = message.toLowerCase().trim();
  const words = message.trim().split(/\s+/);
  const wordCount = words.length;
  const recipientInterests = recipientProfile.preferences || [];
  const recipientName = recipientProfile.name;
  const signature = getProfileSignature(recipientProfile);
  const signatureDesc = getSignatureDescriptor(signature);

  // Pull a specific concrete reference point from her profile to cite in nudges
  const richPrompt = recipientProfile.prompts.find(p => p.interests && p.interests.length > 0) || recipientProfile.prompts[0];
  const promptKeyword = richPrompt
    ? richPrompt.answer.split(/\s+/).find(w => w.length > 5)?.replace(/[.,!?]/g, '').toLowerCase()
    : null;
  const sharedInterests = userProfile
    ? recipientInterests.filter(i => (userProfile.preferences || []).includes(i))
    : [];
  const concreteHook = sharedInterests[0]
    || (richPrompt?.interests?.[0])
    || promptKeyword
    || recipientInterests[0]
    || 'her prompt';

  // ===== HIGH-SEVERITY WARNINGS (red accent) =====

  const harmfulPatterns = /\b(kill|murder|hurt|stalk|die|threat|attack|punch|hit you|beat you|destroy you|harm)\b/i;
  if (harmfulPatterns.test(message)) {
    return {
      type: 'block',
      text: `Aggressive language — ${recipientName} won't read past this`,
      explanation: `Threatening or harsh words shut down a conversation instantly. Try opening on her ${richPrompt?.question.toLowerCase() || 'prompt'} instead.`,
    };
  }

  const explicitPatterns = /\b(sexy|hot body|hookup|hook up|come over|your place|my place|netflix and chill|send pics|nudes|send me photos|what are you wearing|in bed|sleep with|have sex|wanna fuck|bang|horny|turn me on|get naked|undress)\b/i;
  if (explicitPatterns.test(message)) {
    return {
      type: 'block',
      text: `Way too forward — her profile signals ${signatureDesc}, not this`,
      explanation: `Sexual openers almost never convert, especially with profiles like ${recipientName}'s. You've had ${history.unmatchedAfterForward ?? 0} unmatches after openers like this. Lead with her prompt about ${concreteHook} instead.`,
    };
  }

  const manipulativePatterns = /\b(you owe me|give me a chance|why won't you|you'll regret|don't ignore|answer me|you're missing out|last chance|now or never)\b/i;
  if (manipulativePatterns.test(message)) {
    return {
      type: 'block',
      text: `This reads as pressure — kills connection instantly`,
      explanation: `Coercive phrasing makes people pull back. ${recipientName}'s profile suggests she values ${signatureDesc}. A genuine question about ${concreteHook} works far better.`,
    };
  }

  const disrespectfulPatterns = /\b(stupid|dumb|ugly|fat|skinny|crazy|psycho|b[i!]tch|wh[o0]re|sl[u!]t|trash|pathetic|worthless|desperate)\b/i;
  if (disrespectfulPatterns.test(message)) {
    return {
      type: 'block',
      text: `Demeaning language — never lands the way it's meant to`,
      explanation: `Words like that shut things down before they start. Open on something specific from ${recipientName}'s profile — her ${richPrompt?.question.toLowerCase() || 'prompt'} is rich material.`,
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

  // ===== FIRM REDIRECTS (warnings) — each names the actual issue =====

  const contactPatterns = /\b(my number|your number|insta|instagram|snapchat|whatsapp|phone number|text me at|call me|add me|follow me|dm me|give me your)\b/i;
  if (contactPatterns.test(message)) {
    return {
      type: 'warning',
      text: `Pushing for contact in opener one — too fast for ${recipientName}`,
      explanation: `Asking for off-app contact before any real exchange feels rushed and signals you're not investing here. Get a real conversation going about ${concreteHook} first.`,
    };
  }

  const prematurePatterns = /\b(girlfriend|boyfriend|wife|husband|marry|wedding|our kids|move in|meet my parents|exclusive|relationship status|be mine|be my)\b/i;
  if (prematurePatterns.test(message)) {
    return {
      type: 'warning',
      text: `Skipping straight to relationship talk — too much, too soon`,
      explanation: `${recipientName} hasn't met you yet. Long-term framing in an opener reads as intense rather than intentional. Start with her ${richPrompt?.question.toLowerCase() || 'prompt'}.`,
    };
  }

  const arrogancePatterns = /\b(i'm the best|you're lucky|luckiest girl|you won't find|better than anyone|no one else|i'm a catch|you should be|grateful|privileged)\b/i;
  if (arrogancePatterns.test(message)) {
    return {
      type: 'warning',
      text: `Reads as overconfident — and ${recipientName}'s profile rewards curiosity`,
      explanation: `Self-promotion in opener one usually backfires. Profiles with ${signatureDesc} respond to genuine interest, not pitches. Ask about ${concreteHook}.`,
    };
  }

  const desperationPatterns = /\b(please respond|i'm so lonely|no one likes me|you're my only|give me a shot|i'll do anything|please talk to me|been single for|nobody wants|please just)\b/i;
  if (desperationPatterns.test(message)) {
    return {
      type: 'warning',
      text: `Reads as needy — undersells you completely`,
      explanation: `Lead with what genuinely caught your eye in ${recipientName}'s profile — confidence comes through when you focus outward. Try ${concreteHook}.`,
    };
  }

  const passiveAggressivePatterns = /\b(probably won't reply|you'll ignore|girls never|women always|bet you get|must be nice|i guess|whatever|if you even care|not like you)\b/i;
  if (passiveAggressivePatterns.test(message)) {
    return {
      type: 'warning',
      text: `Subtle negativity will read loud and clear`,
      explanation: `Even mild bitterness comes through text. ${recipientName}'s profile has plenty to genuinely engage with — her ${richPrompt?.question.toLowerCase() || 'prompt'} is a great starting point.`,
    };
  }

  const appearancePatterns = /\b(angel|goddess|beautiful|stunning|gorgeous|prettiest|most beautiful|dream girl|out of my league|fell from heaven|so hot|perfect face|perfect body|your eyes|your smile|your lips|your hair|your legs|so pretty|so cute|cutie|babe|baby girl|hottie|smokeshow)\b/i;
  if (appearancePatterns.test(message)) {
    return {
      type: 'warning',
      text: `Surface-level looks compliment — ${recipientName} hears these constantly`,
      explanation: `Her profile shows ${signatureDesc} — she wrote about ${richPrompt?.question.toLowerCase() || 'her interests'} for a reason. Engaging with that stands out.`,
    };
  }

  const insensitivePatterns = /\b(where are you really from|you don't look|for a [a-z]+ girl|exotic|you speak good english|is that your real|your people|your kind|in your country|in your culture)\b/i;
  if (insensitivePatterns.test(message)) {
    return {
      type: 'warning',
      text: `Could land as othering — pivot to common ground`,
      explanation: `Background-based assumptions feel reductive in an opener. Connect over what you share — ${concreteHook} is a stronger angle.`,
    };
  }

  // ===== CHEESY / TRYING TOO HARD =====
  const cheesyPatterns = /\b(did it hurt when you fell|are you tired because|do you have a map|i'm lost in your eyes|must be a thief|stole my heart|magician|every time i look|ravishing|enchanting|breathtaking|love at first sight)\b/i;
  if (cheesyPatterns.test(message)) {
    return {
      type: 'warning',
      text: `Cheesy openers like this rarely land — especially with profiles like hers`,
      explanation: `${recipientName}'s profile reads ${signatureDesc}. You've had ${history.silenceAfterCheesy ?? 0} silent threads after openers in this style. Authenticity wins — try her ${richPrompt?.question.toLowerCase() || 'prompt'}.`,
    };
  }

  // ===== LENGTH WARNINGS =====
  if (wordCount > 40) {
    return {
      type: 'warning',
      text: `Too long for an opener — overwhelming before she knows you`,
      explanation: `Your replied openers average ${history.avgRepliedMessageLength ?? 18} words. Trim to one clear thought + one question about ${concreteHook}.`,
    };
  }

  const sarcasmPatterns = /\b(yeah right|sure you do|oh really|must be hard|poor you|how original|never heard that|very unique|so special)\b/i;
  if (sarcasmPatterns.test(message)) {
    return {
      type: 'warning',
      text: `Sarcasm without context tends to read as cold`,
      explanation: `${recipientName} can't hear your tone. Sincere curiosity about ${concreteHook} reads warmer and gets replies.`,
    };
  }

  // ===== BLAND / WEAK / GENERIC — caught with the same attention =====

  // Filler-only or near-gibberish
  if (/^(b+l+a+h*|l+o+l+|l+m+a+o+|h+a+h+a+|hehe+|h+m+|u+h+|o+k+|k+|m+e+h+)[!?.\s]*$/i.test(lower)) {
    return {
      type: 'warning',
      text: `Filler text — signals zero effort to ${recipientName}`,
      explanation: `This reads like you didn't even read her profile. Her ${richPrompt?.question.toLowerCase() || 'prompt'} mentions ${concreteHook} — react to that specifically.`,
    };
  }

  // Bland low-effort reactions
  const blandPatterns = /^(oh nice|nice|cool|sweet|haha same|same|lol same|interesting|wow|nice profile|nice pic|nice pics|love it|love this|cute|awesome|dope|great|fire|amazing)[!?.\s]*$/i;
  if (blandPatterns.test(lower)) {
    return {
      type: 'warning',
      text: `Too generic — she gave you specific things to work with`,
      explanation: `One-word reactions don't invite a reply. Pick something concrete from her profile — her ${richPrompt?.question.toLowerCase() || 'prompt'} about ${concreteHook} is right there.`,
    };
  }

  // Generic greetings
  if (/^(hey|hi|hello|sup|yo|what's up|how are you|how's it going|hey there|hi there|hello there|hey beautiful|hey gorgeous|hey cutie)[!?.]*$/i.test(lower)) {
    const genericRate = Math.round((history.repliesWhenGeneric ?? 0.08) * 100);
    const profileRate = Math.round((history.repliesWhenReferencingProfile ?? 0.71) * 100);
    return {
      type: 'warning',
      text: `Generic greeting — your reply rate on these is ~${genericRate}%`,
      explanation: `When you reference a profile, your reply rate jumps to ~${profileRate}%. ${recipientName}'s ${richPrompt?.question.toLowerCase() || 'prompt'} mentions ${concreteHook} — start there.`,
    };
  }

  // Too short / low effort
  if (wordCount <= 3 && !message.includes('?')) {
    return {
      type: 'warning',
      text: `Too brief to show real interest — match her profile's specificity`,
      explanation: `${recipientName} wrote detailed prompts. Matching that energy — even one sentence about ${concreteHook} — shows you actually read it.`,
    };
  }

  // Self-centred message
  const selfWords = (lower.match(/\b(i |i'm|i've|i'd|i'll|my |mine|myself)\b/g) || []).length;
  const youWords = (lower.match(/\b(you|your|you're|you've|you'd)\b/g) || []).length;
  if (wordCount >= 8 && selfWords >= 4 && youWords === 0) {
    return {
      type: 'tone',
      text: `All about you — turn the camera toward ${recipientName}`,
      explanation: `Strongest openers spend more time on her than on you. Ask about ${concreteHook} or react to her ${richPrompt?.question.toLowerCase() || 'prompt'}.`,
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

  // ===== POSITIVE REINFORCEMENT — specific praise =====

  if (referencesProfile && hasQuestion && wordCount >= 5) {
    const profileRate = Math.round((history.repliesWhenReferencingProfile ?? 0.71) * 100);
    return {
      type: 'positive',
      text: `Strong — references her profile + question. Your style at ${profileRate}% reply rate`,
      explanation: `This matches what works for you: tied to her actual profile and an easy entry point for her to reply. Send it.`,
    };
  }

  if (referencesProfile && wordCount >= 5) {
    return {
      type: 'positive',
      text: `Good angle — connects directly to what ${recipientName} wrote`,
      explanation: `You picked something specific from her profile. Adding a light question would push this from good to your best-performing style.`,
    };
  }

  if (hasQuestion && wordCount >= 5) {
    const qRate = Math.round((history.repliesWhenAskingQuestions ?? 0.62) * 100);
    return {
      type: 'positive',
      text: `Question-led opener — your strongest pattern (~${qRate}% reply rate)`,
      explanation: `This invites a reply. Tying it to ${concreteHook} would make it even stronger.`,
    };
  }

  // ===== TONE SUGGESTIONS — encouraging redirects =====

  if (!referencesProfile && !hasQuestion && wordCount >= 4) {
    return {
      type: 'tone',
      text: `Doesn't tie to her profile — and your data shows that costs replies`,
      explanation: `Your reply rate on profile-referencing openers is ~${Math.round((history.repliesWhenReferencingProfile ?? 0.71) * 100)}%. Hook into ${concreteHook} and add a question.`,
    };
  }

  if (!hasQuestion && wordCount >= 4) {
    return {
      type: 'tone',
      text: `Add a question — your question-led openers reply best`,
      explanation: `Even one question about ${concreteHook} gives ${recipientName} something easy to bounce off.`,
    };
  }

  return null;
}

// Generate a deeply specific pre-send suggestion when the user tries to send a like with no message.
// Cross-references her profile signature, prompts, interests, and shared common ground.
export interface EmptyLikeSuggestion {
  headline: string; // short, specific call to action
  detail: string; // why this works for THIS profile
  starters: string[]; // 1-3 concrete opener directions
}

export function generateEmptyLikeSuggestion(
  recipientProfile: Profile,
  userProfile?: Profile,
  history: UserHistorySignals = DEFAULT_USER_HISTORY,
): EmptyLikeSuggestion {
  const name = recipientProfile.name;
  const signature = getProfileSignature(recipientProfile);
  const signatureDesc = getSignatureDescriptor(signature);
  const interests = recipientProfile.preferences || [];
  const sharedInterests = userProfile
    ? interests.filter(i => (userProfile.preferences || []).includes(i))
    : [];

  // Find the richest prompt to anchor on
  const richPrompt = recipientProfile.prompts.find(p => p.interests && p.interests.length > 0)
    || recipientProfile.prompts[0];

  const profileRate = Math.round((history.repliesWhenReferencingProfile ?? 0.71) * 100);

  const starters: string[] = [];

  if (richPrompt) {
    const topic = richPrompt.interests?.[0] || sharedInterests[0] || interests[0];
    if (topic) {
      starters.push(`Ask about her "${richPrompt.question.toLowerCase()}" — specifically the ${topic} angle`);
    } else {
      starters.push(`React to her "${richPrompt.question.toLowerCase()}" with a follow-up question`);
    }
  }

  if (sharedInterests.length > 0) {
    starters.push(`Lead with your shared ${sharedInterests[0]} — common ground unlocks faster replies`);
  } else if (interests.length > 0) {
    starters.push(`Ask what got her into ${interests[0]}`);
  }

  if (signature === 'depth-seeker' || signature === 'intellectual') {
    starters.push(`Match her depth — a thoughtful question lands better than a compliment`);
  } else if (signature === 'playful') {
    starters.push(`Match her humor — a witty callback to her prompt works`);
  } else if (signature === 'adventurous') {
    starters.push(`Trade a story — adventurous profiles open up to specific experiences`);
  }

  return {
    headline: `Add a note — ${name}'s profile rewards ${signatureDesc}`,
    detail: `Likes with messages get ~3× more replies. Yours go to ${profileRate}% when you reference the profile.`,
    starters: starters.slice(0, 3),
  };
}
