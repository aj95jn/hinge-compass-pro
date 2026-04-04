import { motion } from "framer-motion";
import { Camera, MessageCircle, User } from "lucide-react";

const pillars = [
  {
    icon: User,
    title: "Profile Strategy",
    subtitle: "Who you are at a glance",
    tips: [
      "Lead with your most authentic photo — not your best-looking one",
      "Your bio should spark curiosity, not list credentials",
      "Show range: adventure + cozy, social + solo",
    ],
  },
  {
    icon: MessageCircle,
    title: "Prompt Mastery",
    subtitle: "Words that start conversations",
    tips: [
      "Be specific — 'Sunday mornings making shakshuka' beats 'I love food'",
      "Use prompts as conversation starters, not autobiography",
      "Vulnerability > wit, but both together is unstoppable",
    ],
  },
  {
    icon: Camera,
    title: "Photo Science",
    subtitle: "Images that magnetize",
    tips: [
      "Natural light, real smile, eyes visible — the holy trinity",
      "Include one full-body and one activity shot minimum",
      "No sunglasses in your first photo. Ever.",
    ],
  },
];

const PillarsSection = () => {
  return (
    <section id="pillars" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium tracking-[0.15em] uppercase text-sm mb-4">
            The Three Pillars
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Your Dating Blueprint
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-card rounded-2xl p-8 border border-border hover:border-accent/40 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <pillar.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-1">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {pillar.subtitle}
              </p>
              <ul className="space-y-4">
                {pillar.tips.map((tip) => (
                  <li
                    key={tip}
                    className="flex gap-3 text-sm text-muted-foreground leading-relaxed"
                  >
                    <span className="text-accent mt-1 shrink-0">◆</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
