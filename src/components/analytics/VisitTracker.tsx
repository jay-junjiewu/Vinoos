'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackVisit } from '@/lib/track';
import { recordSection } from '@/lib/engagement';

/**
 * Mounted once in the root layout. Fires a single visit beacon per full page
 * load (trackVisit is internally guarded) and records subsequent client-side
 * route changes as "sections viewed" on the same session. Renders nothing.
 */
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/stats')) return;
    trackVisit();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (pathname && !pathname.startsWith('/stats')) recordSection(pathname);
  }, [pathname]);

  return null;
}
