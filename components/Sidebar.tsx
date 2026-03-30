"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User } from "lucide-react";
import { useEffect, useState } from "react";
import { UserProfile } from "@/lib/types";

export default function Sidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("affect_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, [pathname]); // Refresh on navigation just in case

  const navItems = [
    { name: "Feed", icon: Home, href: "/feed" },
    { name: "Profile", icon: User, href: "/profile" },
  ];

  if (pathname === "/onboarding" || pathname === "/") return null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[var(--bg-surface)] border-r border-[var(--border)] hidden lg:flex flex-col z-50">
      <div className="p-8">
        <h1 className="text-[28px] font-serif italic text-[var(--accent-fire)]">Affect</h1>
        <p className="text-[13px] font-sans text-[var(--text-muted)] mt-1 leading-snug">the economy, translated to your wallet</p>
      </div>

      <nav className="flex flex-col gap-2 px-4 mt-8 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg group transition-all duration-300 ${
                isActive ? "bg-[rgba(200,92,0,0.08)] text-[var(--accent-fire)] border-l-[3px] border-[var(--accent-fire)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] border-l-[3px] border-transparent"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-sans text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {profile && (
        <div className="p-6 mt-auto border-t border-[var(--border)]">
          <div className="flex items-center gap-3 w-full">
             <div className="w-8 h-8 rounded-full bg-[var(--accent-fire)] flex items-center justify-center text-[var(--text-primary)] font-serif italic text-sm">
               {profile.country?.charAt(0) || "A"}
             </div>
             <div className="flex flex-col">
               <span className="text-[12px] font-sans text-[var(--text-primary)] capitalize">{profile.housing} • {profile.age}</span>
               <span className="text-[10px] font-sans text-[var(--text-muted)] uppercase tracking-wider">{profile.employment}</span>
             </div>
          </div>
        </div>
      )}
    </aside>
  );
}
