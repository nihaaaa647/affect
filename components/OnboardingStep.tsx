"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface OnboardingStepProps {
  step: number;
  totalSteps: number;
  title: string;
  subtext: string;
  onBack?: () => void;
  children: React.ReactNode;
}

export default function OnboardingStep({
  step,
  totalSteps,
  title,
  subtext,
  onBack,
  children,
}: OnboardingStepProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col min-h-screen px-6 pt-12 pb-10"
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-[var(--border)] z-50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="h-full bg-[var(--accent-fire)] shadow-[0_0_8px_var(--accent-fire)]"
        />
      </div>

      <div className="flex items-center justify-between mb-8">
        {onBack ? (
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-10" />
        )}
        <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Step {step} of {totalSteps}
        </span>
        <div className="w-10" />
      </div>

      <div className="mt-4 mb-10">
        <h1 className="text-4xl font-serif text-[var(--text-primary)] mb-3 leading-tight">
          {title}
        </h1>
        <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed">
          {subtext}
        </p>
      </div>

      <div className="flex-1">
        {children}
      </div>
    </motion.div>
  );
}
