import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, List, Bell, ChevronRight } from "lucide-react";

const slides = [
  {
    icon: MapPin,
    color: "#6366F1",
    bg: "#EEF2FF",
    title: "Compare Prices Nearby",
    subtitle: "Instantly see the best prices across stores near you and never overpay again.",
    image: "https://images.unsplash.com/photo-1760463921652-78b38572da45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc2hvcHBpbmclMjBzdXBlcm1hcmtldCUyMG1vZGVybnxlbnwxfHx8fDE3NzMwODg3NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    icon: List,
    color: "#10B981",
    bg: "#ECFDF5",
    title: "Smart Shopping Lists",
    subtitle: "Create intelligent lists that organize items by store aisle and track your spending.",
    image: "https://images.unsplash.com/photo-1552825896-8059df63a1fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0cyUyMHZlZ2V0YWJsZXMlMjBtYXJrZXQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzMwODg3NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    icon: Bell,
    color: "#F59E0B",
    bg: "#FFFBEB",
    title: "Real-Time Price Alerts",
    subtitle: "Get notified instantly when prices drop on your favorite products and deals.",
    image: "https://images.unsplash.com/photo-1730817403595-d78d929eb856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHBob25lJTIwYXBwJTIwc2hvcHBpbmclMjBsaXN0fGVufDF8fHx8MTc3MzA4ODc2NXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (current < slides.length - 1) {
      setDirection(1);
      setCurrent(current + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Image area */}
      <div className="relative h-[48%] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={current}
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            custom={direction}
            initial={{ x: direction * 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -direction * 300, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </AnimatePresence>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-white" />
        {/* Skip button */}
        {current < slides.length - 1 && (
          <button
            onClick={onComplete}
            className="absolute top-5 right-5 px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-sm"
            style={{ color: "white", fontSize: 13, fontWeight: 500 }}
          >
            Skip
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-8 pt-2 pb-10">
        {/* Icon badge */}
        <motion.div
          key={`icon-${current}`}
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 -mt-7 shadow-lg"
          style={{ backgroundColor: slide.color }}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12 }}
        >
          <Icon className="w-7 h-7 text-white" strokeWidth={2} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            className="flex flex-col items-center gap-3 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-gray-900" style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.3 }}>
              {slide.title}
            </h2>
            <p className="text-gray-500 leading-relaxed max-w-[260px]" style={{ fontSize: 14, fontWeight: 400 }}>
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2 mt-7">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className="h-2 rounded-full"
              animate={{
                width: i === current ? 24 : 8,
                backgroundColor: i === current ? slide.color : "#E5E7EB",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          className="mt-auto w-full py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
          style={{ backgroundColor: slide.color }}
          onClick={goNext}
          whileTap={{ scale: 0.97 }}
        >
          <span className="text-white" style={{ fontSize: 16, fontWeight: 600 }}>
            {current === slides.length - 1 ? "Get Started" : "Continue"}
          </span>
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </div>
  );
}
