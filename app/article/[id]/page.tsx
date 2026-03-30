"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { articleCache } from "../../feed/page";
import ImpactHero from "@/components/ImpactHero";
import { useDevice } from "@/components/DeviceProvider";
import BottomNav from "@/components/BottomNav";

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const mode = useDevice();
  const { id } = use(params);
  const [article, setArticle] = useState(articleCache[id]);

  useEffect(() => {
    if (!article) {
       // If no article in cache, we should redirect back to feed
       router.replace("/feed");
    }
  }, [article, router]);

  if (!article) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-[var(--bg-primary)] min-h-screen pb-32 w-full flex flex-col items-center"
    >
      <div className="w-full max-w-[680px] mx-auto">
        {/* 1. Back button */}
        <div className="px-6 py-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm font-sans"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </div>

      <div className="px-6">
         {/* 2. Source + timestamp */}
         <div className="mb-3">
            <p className="text-[12px] font-sans text-[var(--text-muted)] uppercase tracking-widest">
              {article.source.name} · {new Date(article.publishedAt).toLocaleDateString()}
            </p>
         </div>

         {/* 3. Headline */}
         <h1 className="text-4xl font-serif text-[var(--text-primary)] leading-[1.2] mb-6">
           {article.title}
         </h1>

         {/* Original Link */}
         <div className="mb-10">
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent-fire)] text-[var(--accent-fire)] text-[10px] font-sans uppercase tracking-[0.2em] hover:bg-[rgba(200,92,0,0.05)] transition-all"
            >
              Read Full Article ↗
            </a>
         </div>

         {/* 4. WALLET IMPACT HERO */}
         <div className="mb-12">
            <ImpactHero impact={article.impact} />
         </div>

         <div className={mode === 'desktop' ? "grid grid-cols-2 gap-8 items-start mb-12" : "mb-12"}>
             <div className={mode === 'desktop' ? "border-r border-[var(--border)] pr-8" : "mb-10"}>
                 <section>
                    <div className="mb-3">
                       <span className="text-[9px] font-sans uppercase tracking-[0.3em] text-[var(--text-muted)]">
                         WHAT ACTUALLY HAPPENED
                       </span>
                    </div>
                    <p className="text-[16px] font-sans text-[var(--text-primary)] leading-[1.7] font-medium">
                       {article.impact.whatHappened}
                    </p>
                 </section>
             </div>

             <div className={mode === 'desktop' ? "pl-2" : ""}>
                 <section className="p-6 rounded-2xl bg-[#0F100D] border border-[rgba(255,255,255,0.03)]">
                    <div className="mb-3">
                       <span className="text-[9px] font-sans uppercase tracking-[0.3em] text-[var(--text-muted)]">
                         WHY IT MATTERS FOR YOU
                       </span>
                    </div>
                    <p className="text-[16px] font-sans text-[var(--text-primary)] leading-[1.7] italic">
                       "{article.impact.whyItMattersForYou}"
                    </p>
                 </section>
             </div>
         </div>

         <div className="h-[1px] w-full bg-[var(--border)] mb-6" />

         <p className="text-center text-[10px] text-[var(--text-muted)] font-sans uppercase tracking-widest px-8">
            For awareness only. Not financial advice.
         </p>
      </div>
      </div>
    </motion.div>
  );
}
