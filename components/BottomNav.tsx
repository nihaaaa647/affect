"use client";

import { motion } from "framer-motion";
import { Home, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDevice } from "./DeviceProvider";

export default function BottomNav() {
  const pathname = usePathname();
  const mode = useDevice();

  const navItems = [
    { name: "Feed", icon: Home, href: "/feed" },
    { name: "Profile", icon: User, href: "/profile" },
  ];

  if (pathname === "/onboarding" || pathname === "/") return null;
  if (mode === "desktop") return null;

  const heightClass = mode === "mobile" ? "py-4" : "h-[56px] flex items-center";
  const maxWClass = mode === "mobile" ? "max-w-[430px]" : "max-w-[600px]";

  return (
    <nav className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full ${maxWClass} bg-[var(--bg-surface)] border-t border-[var(--border)] px-8 ${heightClass} flex justify-between items-center z-50 transition-all duration-300`}>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center gap-1 group touch-manipulation"
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className={`transition-colors duration-300 ${
                isActive ? "text-[var(--accent-fire)]" : "text-[var(--text-muted)] lg:group-hover:text-[var(--text-secondary)]"
              }`}
            >
              <Icon size={mode === "mobile" ? 20 : 22} strokeWidth={isActive ? 2.5 : 2} />
            </motion.div>
            <span
              className={`text-[10px] font-sans uppercase tracking-widest transition-colors duration-300 ${
                isActive ? "text-[var(--accent-fire)]" : "text-[var(--text-muted)] lg:group-hover:text-[var(--text-secondary)]"
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
