'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function PwaProvider() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(typeof navigator === 'undefined' ? true : navigator.onLine);

    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service worker registration failed', error);
      });
    }

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  return (
    <>
      {!online ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
          You are offline. Cached pages remain available. Some live actions like checkout and uploads may be unavailable.
        </div>
      ) : null}

      {installEvent ? (
        <div className="border-b border-line bg-soft px-4 py-2 text-center text-sm text-ink">
          Install Bandbnb for a faster app-like experience.
          <button onClick={handleInstall} className="ml-3 rounded-full bg-brand px-3 py-1 font-semibold text-white">
            Install app
          </button>
          <Link href="/offline" className="ml-3 underline underline-offset-4">
            Offline support
          </Link>
        </div>
      ) : null}
    </>
  );
}
