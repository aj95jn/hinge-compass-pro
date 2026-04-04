import { motion } from "framer-motion";
import { Lightbulb, Heart, X, Star, Zap, Shield } from "lucide-react";

const tips = [
  {
    icon: Heart,
    title: "Like with Intent",
    description:
      "Comment on something specific in their profile. 'Great smile!' is invisible. 'Is that shakshuka recipe from Ottolenghi?' gets replies.",
  },
  {
    icon: X,
    title: "Dealbreaker Clarity",
    description:
      "Know your non-negotiables before you open the app. Decision fatigue leads to bad matches.",
  },
  {
    icon: Star,
    title: "The 72-Hour Rule",
    description:
      "Ask for a date within 72 hours of matching. Momentum is everything — pen pals don't become partners.",
  },
  {
    icon: Zap,
    title: "Roses are Strategic",
    description:
      "Use your weekly rose on someone whose prompt genuinely resonated, not just the most attractive person in Standouts.",
  },
  {
    icon: Shield,
    title: "Protect Your Energy",
    description:
      "Set a daily time limit. 15 minutes of focused swiping beats an hour of mindless scrolling.",
  },
  {
    icon: Lightbulb,
    title: "Refresh Weekly",
    description:
      "Rotate one photo and one prompt every week. The algorithm rewards active profiles with better visibility.",
  },
];

const TipsSection = () => {
  return (
    <section id="tips" className="py-24 md:py-32 px-6 bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium tracking-[0.15em] uppercase text-sm mb-4">
            Quick Wins
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Pro Moves
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, i) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-background rounded-xl p-6 border border-border"
            >
              <tip.icon className="w-5 h-5 text-accent mb-4" />
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                {tip.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tip.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TipsSection;
