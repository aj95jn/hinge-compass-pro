import { motion } from "framer-motion";
import compassHero from "@/assets/compass-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={compassHero}
          alt="Compass rose in burgundy and rose gold tones"
          className="w-full h-full object-cover opacity-20"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-accent font-medium tracking-[0.2em] uppercase text-sm mb-6"
        >
          Navigate Dating with Intention
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground leading-[0.95] mb-8"
        >
          The Hinge
          <br />
          <span className="text-primary italic">Compass</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 font-sans"
        >
          Stop swiping aimlessly. Master your profile, prompts, and photos to
          attract meaningful connections.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#pillars"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-sans font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Find Your Direction
          </a>
          <a
            href="#tips"
            className="inline-flex items-center justify-center px-8 py-4 border border-border text-foreground font-sans font-semibold rounded-lg hover:bg-secondary transition-colors"
          >
            Quick Tips
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
