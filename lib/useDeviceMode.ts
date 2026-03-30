import { useState, useEffect } from 'react';

export type DeviceMode = 'mobile' | 'tablet' | 'phone-desktop' | 'desktop';

export function useDeviceMode(): DeviceMode {
  const [mode, setMode] = useState<DeviceMode>('mobile');

  useEffect(() => {
    function detect() {
      const w = window.innerWidth;
      const ua = navigator.userAgent;
      const isMobileUA = /Mobile|Android|iPhone|iPad/i.test(ua);

      if (w < 431) return setMode('mobile');
      if (w < 1024) return setMode('tablet');
      if (w >= 1024 && isMobileUA) return setMode('phone-desktop');
      return setMode('desktop');
    }

    detect();
    window.addEventListener('resize', detect);
    return () => window.removeEventListener('resize', detect);
  }, []);

  return mode;
}
