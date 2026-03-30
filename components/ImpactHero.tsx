"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ImpactData } from "../lib/types";

interface ImpactHeroProps {
  impact: ImpactData;
}

export default function ImpactHero({ impact }: ImpactHeroProps) {
  const [count, setCount] = useState(0);
  
  // Extract number from impactAmount (e.g. "+₹600–900" -> 900)
  const targetValue = parseInt(impact.impactAmount.match(/\d+/g)?.[0] || "0");

  useEffect(() => {
    let start = 0;
    const duration = 600;
    const interval = 16;
    const steps = duration / interval;
    const increment = targetValue / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [targetValue]);

  const colorClass = impact.impactColor === "red" 
    ? "text-[var(--impact-red)]" 
    : impact.impactColor === "amber" 
    ? "text-[var(--impact-amber)]" 
    : "text-[var(--impact-green)]";

  const borderColorClass = impact.impactColor === "red" 
    ? "border-[var(--impact-red)]" 
    : impact.impactColor === "amber" 
    ? "border-[var(--impact-amber)]" 
    : "border-[var(--impact-green)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="p-6 rounded-2xl bg-[#1F1208] border-1.5 border-[var(--accent-fire)] shadow-[0_0_20px_rgba(200,92,0,0.15)] flex flex-col relative"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[var(--accent-warm)]">
          YOUR WALLET IMPACT
        </span>
        <span className={`px-2 py-1 rounded-full text-[9px] font-sans font-bold uppercase ${borderColorClass} border bg-opacity-10 bg-black ${colorClass}`}>
          {impact.impactSeverity} IMPACT
        </span>
      </div>

      <div className={`text-[48px] lg:text-[56px] leading-tight font-mono font-bold mb-2 ${colorClass}`}>
        {impact.impactAmount.startsWith("+") || impact.impactAmount.startsWith("-") 
          ? impact.impactAmount.charAt(0) 
          : ""}
        {impact.impactAmount.includes("₹") ? "₹" : "$"}
        {count.toLocaleString()}
        {impact.impactAmount.includes("–") ? "–" + impact.impactAmount.split("–")[1] : ""}
      </div>
      
      <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed mb-4">
        {impact.impactAmountSub}
      </p>

      <div className="flex flex-wrap gap-2">
        {impact.affectedCategories.map((cat) => (
          <span
            key={cat}
            className="px-2 py-1 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--accent-warm)] text-[9px] font-sans uppercase tracking-widest rounded-md"
          >
            {cat}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
