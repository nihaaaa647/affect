"use client";

import { motion } from "framer-motion";
import { ArticleWithImpact } from "../lib/types";

interface CompactCardProps {
  article: ArticleWithImpact;
  onClick: () => void;
}

export default function CompactCard({ article, onClick }: CompactCardProps) {
  const { impact } = article;
  
  const dotColor = impact.impactColor === "red" 
    ? "bg-[var(--impact-red)]" 
    : impact.impactColor === "amber" 
    ? "bg-[var(--impact-amber)]" 
    : "bg-[var(--impact-green)]";

  const textColor = impact.impactColor === "red" 
    ? "text-[var(--impact-red)]" 
    : impact.impactColor === "amber" 
    ? "text-[var(--impact-amber)]" 
    : "text-[var(--impact-green)]";

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] cursor-pointer touch-manipulation flex items-center gap-4 transition-all duration-300 lg:hover:border-[var(--accent-fire)] lg:hover:scale-[1.01]"
    >
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor} mt-1.5`} />
      
      <div className="flex-1 flex flex-col gap-1">
        <h3 className="text-[12px] md:text-[13px] lg:text-[14px] font-sans font-medium text-[var(--text-primary)] leading-snug line-clamp-2 lg:group-hover:text-[var(--accent-warm)] transition-colors">
          {article.title}
        </h3>
        <p className={`text-[10px] font-sans uppercase tracking-widest font-bold ${textColor}`}>
          {impact.impactLine}
        </p>
      </div>

      <div className="shrink-0 ml-auto">
        <span className="px-1.5 py-0.5 bg-[var(--bg-elevated)] text-[var(--text-muted)] text-[8px] font-sans uppercase tracking-widest rounded border border-[var(--border)]">
          {article.source.name.split(" ")[0]}
        </span>
      </div>
    </motion.div>
  );
}
