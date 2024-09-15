"use client";
import { ReactNode, Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "./globals.css";
import { useRouter } from "next/navigation";

const TelegramProvider = dynamic(() =>
  import("react-telegram-miniapp").then(
    (mod) => mod.TelegramProvider as React.FC<{ children: ReactNode }>
  )
);

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isReady, setIsReady] = useState(false);
  const [isTelegram, setIsTelegram] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkTelegram = () => {
        if (window.Telegram?.WebApp) {
          setIsTelegram(true);

          const app = window.Telegram.WebApp;
          app.ready();

          if (app.initDataUnsafe.user) {
            setIsReady(true);
          } else {
            setError("User info is not available.");
          }
        } else {
          setTimeout(checkTelegram, 300);
        }
      };
      checkTelegram();
    }
  }, []);

  return (
    <html lang="en">
      <body>
      {/*   <TelegramProvider>
          {isTelegram && isReady ? (
            <Suspense fallback={<div>Loading Telegram...</div>}>
              {children}
            </Suspense>
          ) : (
            <div>
              {error
                ? `Error: ${error}`
                : "This app is not running inside Telegram."}
            </div>
          )}
        </TelegramProvider> */}


          {children}
      </body>
    </html>
  );
}
