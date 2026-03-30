"use client";

import { motion } from "framer-motion";
import { ArticleWithImpact } from "../lib/types";

interface FeaturedCardProps {
  article: ArticleWithImpact;
  impactData?: ArticleWithImpact["impact"];
  onClick: () => void;
}

export default function FeaturedCard({ article, impactData: passedImpact, onClick }: FeaturedCardProps) {
  const impactData = passedImpact || article.impact;

  const colorClass = impactData?.impactColor === "red" 
    ? "text-[var(--impact-red)]" 
    : impactData?.impactColor === "amber" 
    ? "text-[var(--impact-amber)]" 
    : "text-[var(--impact-green)]";

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative p-6 rounded-2xl bg-[#120E0A] border border-[var(--border)] cursor-pointer touch-manipulation overflow-hidden transition-all duration-300 lg:hover:border-[var(--accent-fire)] lg:hover:scale-[1.01] lg:hover:shadow-[0_0_30px_rgba(200,92,0,0.1)] flex flex-col h-full"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-fire)] blur-[80px] opacity-[0.05] group-hover:opacity-10 transition-opacity" />

      {/* 1. Top label row */}
      <div className="mb-4">
        <span className="text-[10px] uppercase tracking-[0.1em] font-sans text-[var(--accent-warm)]">
          TOP IMPACT FOR YOU
        </span>
      </div>

      {/* GUARD AGAINST EMPTY STATES */}
      {!impactData ? (
        <div className="animate-pulse flex flex-col gap-3 mb-6">
          <div className="h-[24px] bg-[var(--bg-elevated)] rounded-[4px] w-3/4"></div>
          <div className="h-[40px] bg-[var(--bg-elevated)] rounded-[4px] w-1/2"></div>
          <div className="h-[12px] bg-[var(--bg-elevated)] rounded-[4px] w-5/6"></div>
        </div>
      ) : (
        <>
          {/* 2. Impact line */}
          <h2 className={`text-[24px] font-serif leading-[1.3] mb-4 ${colorClass}`}>
            {impactData.impactLine}
          </h2>

          {/* 3. Amount + subtext block */}
          <div className="mb-6">
            <div 
              className={`text-[40px] font-mono font-bold leading-none ${
                impactData.impactAmount === 'Unclear impact' 
                  ? 'text-[var(--text-secondary)]'
                  : colorClass
              }`}
            >
              {impactData.impactAmount}
            </div>
            <p className="text-[12px] font-sans text-[var(--text-secondary)] mt-[4px]">
              {impactData.impactAmountSub}
            </p>
          </div>

          {/* 4. Chips row */}
          {impactData.affectedCategories && impactData.affectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 text-[11px] font-sans text-[var(--accent-warm)] mb-2">
              {impactData.affectedCategories.map((cat) => (
                <span
                  key={cat}
                  className="bg-[var(--bg-surface)] border-[0.5px] border-[var(--border)] rounded-[20px] px-[10px] py-[4px]"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {/* 5. Thin divider */}
      <div className="w-full h-[0.5px] bg-[var(--border)] my-[12px]" />

      {/* 6. Bottom row */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[12px] font-sans text-[var(--text-muted)] line-clamp-2">
           {article.title}
        </h3>
        <span className="shrink-0 bg-[var(--bg-surface)] text-[var(--text-secondary)] text-[11px] font-sans px-[8px] py-[2px] rounded-[8px]">
           {article.source.name}
        </span>
      </div>
    </motion.div>
  );
}
