"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fetchEconNews, fetchEconNewsWeekly } from "@/lib/newsApi";
import { getWalletImpact } from "@/lib/openrouter";
import { buildPrompt } from "@/lib/prompt";
import { ArticleWithImpact, UserProfile } from "@/lib/types";
import FeaturedCard from "@/components/FeaturedCard";
import CompactCard from "@/components/CompactCard";
import { useDevice } from "@/components/DeviceProvider";
import BottomNav from "@/components/BottomNav";

// Simple global cache for navigation
export const articleCache: Record<string, ArticleWithImpact> = {};

export default function FeedPage() {
  const router = useRouter();
  const mode = useDevice();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [articles, setArticles] = useState<ArticleWithImpact[]>([]);
  const [weeklyArticles, setWeeklyArticles] = useState<ArticleWithImpact[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("affect_profile");
    if (!savedProfile) {
      router.replace("/onboarding");
      return;
    }
    setProfile(JSON.parse(savedProfile));
  }, [router]);

  useEffect(() => {
    if (!profile) return;

    async function loadFeed() {
      try {
        setLoading(true);
        const [rawArticles, rawWeekly] = await Promise.all([
          fetchEconNews(),
          fetchEconNewsWeekly()
        ]);
        
        // Removing duplicate articles (common in news APIs) to prevent key collision errors
        const uniqueArticles = rawArticles.filter((article, index, self) => 
          index === self.findIndex((a) => a.id === article.id)
        );
        const uniqueWeekly = rawWeekly.filter((article, index, self) => 
          index === self.findIndex((a) => a.id === article.id)
        );
        
        const withImpact = (await Promise.all(
          uniqueArticles.map(async (article) => {
            try {
              const prompt = buildPrompt(article, profile!);
              const impact = await getWalletImpact(prompt, article.id);
              const fullArticle = { ...article, impact };
              articleCache[article.id] = fullArticle;
              return fullArticle;
            } catch (err) {
              console.error(`Failed to get impact for ${article.id}:`, err);
              return null;
            }
          })
        )).filter((a): a is ArticleWithImpact => a !== null);

        // Rank by severity: HIGH > MODERATE > LOW
        const severityMap = { HIGH: 3, MODERATE: 2, LOW: 1 };
        const sorted = withImpact.sort((a, b) => 
          severityMap[b.impact.impactSeverity] - severityMap[a.impact.impactSeverity]
        );

        setArticles(sorted);

        const weeklyWithImpact = (await Promise.all(
          uniqueWeekly.map(async (article) => {
            try {
              const prompt = buildPrompt(article, profile!);
              const impact = await getWalletImpact(prompt, article.id);
              const fullArticle = { ...article, impact };
              articleCache[article.id] = fullArticle;
              return fullArticle;
            } catch (err) {
              return null;
            }
          })
        )).filter((a): a is ArticleWithImpact => a !== null);
        
        const weeklySorted = weeklyWithImpact.sort((a, b) => 
          severityMap[b.impact.impactSeverity] - severityMap[a.impact.impactSeverity]
        );
        
        setWeeklyArticles(weeklySorted);
      } catch (err: any) {
        setError(err.message || "Something went wrong reading the news.");
      } finally {
        setLoading(false);
      }
    }

    loadFeed();
  }, [profile]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[var(--bg-primary)] flex flex-col items-center justify-center z-[100]">
        <h1 className="text-5xl font-serif text-[var(--accent-fire)] mb-4 tracking-tighter italic">Affect</h1>
        <div className="w-48 h-[1px] bg-[var(--border)] relative overflow-hidden mb-4">
          <motion.div 
            animate={{ x: [-200, 200] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute top-0 left-0 h-full w-20 bg-[var(--accent-fire)]"
          />
        </div>
        <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-[var(--text-muted)]">
          Reading the news for you...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-6">
        <p className="text-[var(--text-secondary)] font-sans">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 border border-[var(--accent-fire)] text-[var(--accent-fire)] rounded-xl uppercase text-[10px] tracking-widest font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  const featured = articles[0];
  const others = articles.slice(1);

  return (
    <div className="pb-24 pt-6 px-6 bg-[var(--bg-primary)] min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-serif italic text-[var(--accent-fire)]">Affect</h1>
        <button 
          onClick={() => router.push("/profile")}
          className="px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-[9px] font-sans text-[var(--text-secondary)] uppercase tracking-wider"
        >
          {profile?.housing} · {profile?.age}
        </button>
      </header>

      {featured && (
        <section className="mb-12">
          <div className="mb-4">
            <span className="text-[9px] font-sans uppercase tracking-[0.4em] text-[var(--text-muted)]">
              BIGGEST HIT TODAY
            </span>
          </div>
          <FeaturedCard 
            article={featured} 
            impactData={featured.impact}
            onClick={() => router.push(`/article/${featured.id}`)} 
          />
        </section>
      )}

      {others.length > 0 && (
        <section>
          <div className="mb-4">
            <span className="text-[9px] font-sans uppercase tracking-[0.4em] text-[var(--text-muted)]">
              MORE TODAY
            </span>
          </div>
          <div className={mode === 'desktop' ? "grid grid-cols-2 gap-4" : "flex flex-col gap-3"}>
            {others.map((article) => (
              <CompactCard 
                key={article.id} 
                article={article} 
                onClick={() => router.push(`/article/${article.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {weeklyArticles.length > 0 && (
        <section className="mt-12">
          <div className="mb-4">
            <span className="text-[9px] font-sans uppercase tracking-[0.4em] text-[var(--text-muted)]">
              THIS WEEK'S TOP STORIES
            </span>
          </div>
          <div className={mode === 'desktop' ? "grid grid-cols-2 gap-4" : "flex flex-col gap-3"}>
            {weeklyArticles.map((article) => (
              <CompactCard 
                key={article.id} 
                article={article} 
                onClick={() => router.push(`/article/${article.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

