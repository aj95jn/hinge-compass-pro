import { motion } from 'framer-motion';

interface AnimatedAvatarProps {
  name: string;
  gender: 'Female' | 'Male' | 'Non-binary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const gradients: Record<string, string> = {
  Sarah: 'from-rose-400 to-pink-500',
  Maya: 'from-violet-400 to-purple-500',
  Emma: 'from-amber-400 to-orange-500',
  Jessica: 'from-teal-400 to-cyan-500',
  Olivia: 'from-emerald-400 to-green-500',
  Aman: 'from-blue-400 to-indigo-500',
};

const fallbackGradients = [
  'from-rose-400 to-pink-500',
  'from-violet-400 to-purple-500',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-cyan-500',
  'from-emerald-400 to-green-500',
];

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-16 h-16 text-xl',
  lg: 'w-20 h-20 text-2xl',
  xl: 'w-32 h-32 text-4xl',
};

export function AnimatedAvatar({ name, gender, size = 'md' }: AnimatedAvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  const gradient = gradients[name] || fallbackGradients[name.length % fallbackGradients.length];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg overflow-hidden`}
    >
      {/* Animated shimmer overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear', repeatDelay: 2 }}
      />

      {/* Floating particle dots */}
      <motion.div
        className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white/40"
        animate={{ y: [0, -4, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-3 left-2 w-1 h-1 rounded-full bg-white/30"
        animate={{ y: [0, -3, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Initial letter */}
      <motion.span
        className="font-hinge-serif font-bold text-white relative z-10"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      >
        {initial}
      </motion.span>
    </motion.div>
  );
}

/** Full animated profile header for discover cards */
export function AnimatedProfileHeader({
  name,
  gender,
  location,
}: {
  name: string;
  gender: 'Female' | 'Male' | 'Non-binary';
  location: string;
}) {
  const gradient = gradients[name] || fallbackGradients[name.length % fallbackGradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden bg-card border border-border"
    >
      {/* Gradient banner */}
      <div className={`h-24 bg-gradient-to-br ${gradient} relative`}>
        {/* Animated wave pattern */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-8"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, hsl(var(--card)) 70%, transparent 70%)',
          }}
        />
        {/* Floating decorations */}
        <motion.div
          className="absolute top-4 right-6 w-2 h-2 rounded-full bg-white/30"
          animate={{ y: [0, -6, 0], x: [0, 3, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-6 right-16 w-1.5 h-1.5 rounded-full bg-white/20"
          animate={{ y: [0, -4, 0], x: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.8 }}
        />
        <motion.div
          className="absolute top-3 left-8 w-1 h-1 rounded-full bg-white/25"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.3 }}
        />
      </div>

      {/* Avatar overlapping the banner */}
      <div className="relative px-4 -mt-10 pb-4">
        <AnimatedAvatar name={name} gender={gender} size="lg" />
        <div className="mt-3">
          <h1 className="font-hinge-serif text-2xl font-semibold text-foreground">
            {name}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground capitalize">{gender}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
