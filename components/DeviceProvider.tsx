"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useDeviceMode, DeviceMode } from '@/lib/useDeviceMode';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { usePathname } from 'next/navigation';

const DeviceContext = createContext<DeviceMode>('mobile');

export function useDevice() {
  return useContext(DeviceContext);
}

export function DeviceProvider({ children }: { children: ReactNode }) {
  const mode = useDeviceMode();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Initial server render placeholder with no dynamic styles attached
    return <div className="invisible">{children}</div>;
  }

  const isOnboarding = pathname === "/onboarding";
  const isRoot = pathname === "/";

  // Determine wrapper classes based on mode
  let wrapperClass = "min-h-screen relative overflow-x-hidden transition-all duration-300 w-full";
  
  if (isOnboarding) {
    // Onboarding runs edge-to-edge
    wrapperClass += " w-full";
  } else {
    // Structural constraints for normal pages based on device
    if (mode === 'desktop') {
      wrapperClass += " lg:ml-[240px] max-w-[720px] mx-auto";
    } else if (mode === 'tablet' || mode === 'phone-desktop') {
      wrapperClass += " max-w-[600px] mx-auto";
    } else {
      wrapperClass += " max-w-[430px] mx-auto";
    }
  }

  return (
    <DeviceContext.Provider value={mode}>
      {/* Show sidebar on true desktop only */}
      {mode === 'desktop' && !isOnboarding && !isRoot && <Sidebar />}
      
      <div className={wrapperClass}>
        {children}
      </div>

      {/* Show bottom nav on anything except true desktop */}
      {mode !== 'desktop' && !isOnboarding && !isRoot && <BottomNav />}
    </DeviceContext.Provider>
  );
}
