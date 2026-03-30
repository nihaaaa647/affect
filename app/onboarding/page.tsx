"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingStep from "@/components/OnboardingStep";
import { UserProfile } from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    country: "India",
    savingsType: [],
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const handleFinish = () => {
    localStorage.setItem("affect_profile", JSON.stringify(profile));
    router.push("/feed");
  };

  const Pill = ({ 
    label, 
    value, 
    currentValue, 
    onClick,
    multi = false 
  }: { 
    label: string; 
    value: string; 
    currentValue: any; 
    onClick: (val: string) => void;
    multi?: boolean;
  }) => {
    const isSelected = multi 
      ? (currentValue as string[]).includes(value)
      : currentValue === value;

    return (
      <button
        onClick={() => onClick(value)}
        className={`px-4 py-3 rounded-xl border font-sans text-sm transition-all duration-300 text-left ${
          isSelected
            ? "border-[var(--accent-fire)] bg-[rgba(200,92,0,0.08)] text-[var(--accent-warm)]"
            : "border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
        }`}
      >
        {label}
      </button>
    );
  };

  const NextButton = ({ onClick, label = "Next", disabled = false }: { onClick: () => void; label?: string; disabled?: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 bg-[var(--accent-fire)] text-[var(--text-primary)] font-serif text-lg rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale mt-8"
    >
      {label}
    </button>
  );

  return (
    <main className="fixed inset-0 bg-[var(--bg-primary)] lg:bg-[#070504] flex items-start lg:items-center justify-center overflow-y-auto text-[var(--text-primary)]">
      <div className="w-full h-full lg:h-auto lg:my-8 lg:max-w-[520px] lg:bg-[var(--bg-surface)] lg:border lg:border-[var(--border)] lg:rounded-[28px] lg:shadow-2xl relative lg:p-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
          <OnboardingStep
            key="step1"
            step={1}
            totalSteps={5}
            title="Where are you based?"
            subtext="So we pull news relevant to your economy."
          >
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {["India", "USA", "UK", "Other"].map((c) => (
                  <Pill
                    key={c}
                    label={c}
                    value={c}
                    currentValue={profile.country}
                    onClick={(v) => updateProfile({ country: v })}
                  />
                ))}
              </div>
              <input
                type="text"
                placeholder="e.g. Mumbai, Hyderabad..."
                className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl py-4 px-5 font-sans text-sm focus:outline-none focus:border-[var(--accent-warm)] transition-colors"
                value={profile.city || ""}
                onChange={(e) => updateProfile({ city: e.target.value })}
              />
              <NextButton onClick={nextStep} />
            </div>
          </OnboardingStep>
        )}

        {step === 2 && (
          <OnboardingStep
            key="step2"
            step={2}
            totalSteps={5}
            title="A bit about you"
            subtext="Helps us size the impact realistically."
            onBack={prevStep}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Age range</span>
                <div className="grid grid-cols-2 gap-2">
                  {["Under 25", "25–35", "35–50", "50+"].map((v) => (
                    <Pill key={v} label={v} value={v} currentValue={profile.age} onClick={(v) => updateProfile({ age: v })} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Employment</span>
                <div className="grid grid-cols-2 gap-2">
                  {["Student", "Salaried", "Freelance", "Business"].map((v) => (
                    <Pill key={v} label={v} value={v} currentValue={profile.employment} onClick={(v) => updateProfile({ employment: v })} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Housing</span>
                <div className="grid grid-cols-2 gap-2">
                  {["Renter", "Homeowner", "With family"].map((v) => (
                    <Pill key={v} label={v} value={v} currentValue={profile.housing} onClick={(v) => updateProfile({ housing: v })} />
                  ))}
                </div>
              </div>
              <NextButton onClick={nextStep} disabled={!profile.age || !profile.employment || !profile.housing} />
            </div>
          </OnboardingStep>
        )}

        {step === 3 && (
          <OnboardingStep
            key="step3"
            step={3}
            totalSteps={5}
            title="Your income"
            subtext="We never store this. Just used to estimate impact ranges."
            onBack={prevStep}
          >
            <div className="flex flex-col gap-3">
              {["Under ₹30k", "₹30–80k", "₹80k–2L", "₹2L+"].map((v) => (
                <Pill key={v} label={v} value={v} currentValue={profile.income} onClick={(v) => updateProfile({ income: v })} />
              ))}
              <NextButton onClick={nextStep} disabled={!profile.income} />
            </div>
          </OnboardingStep>
        )}

        {step === 4 && (
          <OnboardingStep
            key="step4"
            step={4}
            totalSteps={5}
            title="Loans & savings"
            subtext="Rate changes hit very differently depending on this."
            onBack={prevStep}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Loans/EMIs</span>
                <div className="flex flex-col gap-2">
                  {["Home loan", "Personal / car", "No loans"].map((v) => (
                    <Pill key={v} label={v} value={v} currentValue={profile.loans} onClick={(v) => updateProfile({ loans: v })} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Savings type</span>
                <div className="grid grid-cols-2 gap-2">
                  {["FDs / savings", "Mutual funds", "Stocks", "None yet"].map((v) => (
                    <Pill 
                      key={v} 
                      label={v} 
                      value={v} 
                      multi
                      currentValue={profile.savingsType} 
                      onClick={(v) => {
                         const current = profile.savingsType || [];
                         if (v === "None yet") {
                           updateProfile({ savingsType: ["None yet"], savingsAmount: "" });
                         } else {
                           const filtered = current.filter(x => x !== "None yet");
                           if (filtered.includes(v)) {
                             updateProfile({ savingsType: filtered.filter(x => x !== v) });
                           } else {
                             updateProfile({ savingsType: [...filtered, v] });
                           }
                         }
                      }} 
                    />
                  ))}
                </div>
              </div>
              
              {!profile.savingsType?.includes("None yet") && (
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Savings amount</span>
                  <div className="grid grid-cols-2 gap-2">
                    {["Just starting", "Under ₹1L", "₹1–10L", "₹10–50L", "₹50L+"].map((v) => (
                      <Pill key={v} label={v} value={v} currentValue={profile.savingsAmount} onClick={(v) => updateProfile({ savingsAmount: v })} />
                    ))}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] italic">
                    Approximate is fine — never stored, only used to size estimates.
                  </p>
                </div>
              )}
              
              <NextButton onClick={nextStep} disabled={!profile.loans || profile.savingsType?.length === 0} />
            </div>
          </OnboardingStep>
        )}

        {step === 5 && (
          <OnboardingStep
            key="step5"
            step={5}
            totalSteps={5}
            title="Your radar is ready."
            subtext=""
            onBack={prevStep}
          >
            <div className="flex flex-col gap-6">
              <div className="p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--accent-fire)] bg-gradient-to-br from-[var(--bg-elevated)] to-[#1A1410]">
                <h3 className="text-xl font-serif text-[var(--accent-warm)] mb-4">Profile Summary</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mb-1">Focus</p>
                    <p className="text-sm font-sans">{profile.country}{profile.city ? `, ${profile.city}` : ""}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mb-1">Affinity</p>
                    <p className="text-sm font-sans">{profile.age} · {profile.employment}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mb-1">Housing</p>
                    <p className="text-sm font-sans">{profile.housing}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)] mb-1">Income</p>
                    <p className="text-sm font-sans">{profile.income}</p>
                  </div>
                </div>
              </div>
              <NextButton onClick={handleFinish} label="Open my feed →" />
            </div>
          </OnboardingStep>
        )}
        </AnimatePresence>
      </div>
    </main>
  );
}
