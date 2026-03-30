"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { UserProfile } from "@/lib/types";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const saved = localStorage.getItem("affect_profile");
    if (saved) {
      const p = JSON.parse(saved);
      setProfile(p);
      setFormData(p);
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  const handleSave = () => {
    localStorage.setItem("affect_profile", JSON.stringify(formData));
    setProfile(formData as UserProfile);
    setEditing(false);
  };

  if (!profile) return null;

  return (
    <main className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)] pb-24">
      <div className="px-6 pt-12">
        <header className="flex items-center gap-4 mb-10">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-serif italic text-[var(--accent-fire)]">Profile</h1>
        </header>

        {!editing ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-fire)] blur-[100px] opacity-10" />
               
               <div className="grid grid-cols-1 gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] font-sans">Geography</span>
                    <p className="text-xl font-serif text-[var(--text-primary)]">{profile.country}{profile.city ? `, ${profile.city}` : ""}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] font-sans">Occupation</span>
                      <p className="text-lg font-serif">{profile.employment}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] font-sans">Housing</span>
                      <p className="text-lg font-serif">{profile.housing}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] font-sans">Monthly Income</span>
                    <p className="text-lg font-serif">{profile.income}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] font-sans">Savings Profile</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.savingsType.map(s => (
                        <span key={s} className="px-3 py-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full text-[11px] font-sans text-[var(--accent-warm)]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => setEditing(true)}
              className="w-full py-4 bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--accent-warm)] font-sans uppercase tracking-[0.2em] text-[10px] font-bold rounded-2xl hover:bg-[var(--border)] transition-all"
            >
              Modify Radar Settings
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-8 pb-10"
          >
            <div className="flex flex-col gap-4">
               <label className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] ml-1">City</label>
               <input 
                 className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 text-sm focus:border-[var(--accent-fire)] outline-none"
                 value={formData.city || ""}
                 onChange={e => setFormData({...formData, city: e.target.value})}
               />
            </div>

            <div className="flex flex-col gap-4">
               <label className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] ml-1">Rent / Homeowner</label>
               <div className="grid grid-cols-2 gap-2">
                 {["Renter", "Homeowner", "With family"].map(h => (
                   <button 
                     key={h}
                     onClick={() => setFormData({...formData, housing: h})}
                     className={`p-3 rounded-xl border text-xs font-sans transition-all ${
                        formData.housing === h ? "border-[var(--accent-fire)] text-[var(--accent-warm)] bg-[rgba(200,92,0,0.05)]" : "border-[var(--border)] text-[var(--text-secondary)]"
                     }`}
                   >
                     {h}
                   </button>
                 ))}
               </div>
            </div>

            <div className="flex flex-col gap-4">
               <label className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] ml-1">Monthly Income</label>
               <div className="grid grid-cols-2 gap-2">
                 {["Under ₹30k", "₹30–80k", "₹80k–2L", "₹2L+"].map(i => (
                   <button 
                     key={i}
                     onClick={() => setFormData({...formData, income: i})}
                     className={`p-3 rounded-xl border text-xs font-sans transition-all ${
                        formData.income === i ? "border-[var(--accent-fire)] text-[var(--accent-warm)] bg-[rgba(200,92,0,0.05)]" : "border-[var(--border)] text-[var(--text-secondary)]"
                     }`}
                   >
                     {i}
                   </button>
                 ))}
               </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <button 
                onClick={handleSave}
                className="w-full py-5 bg-[var(--accent-fire)] text-[var(--text-primary)] font-serif text-lg rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setEditing(false)}
                className="w-full py-4 text-[var(--text-muted)] font-sans uppercase tracking-[0.2em] text-[10px]"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
