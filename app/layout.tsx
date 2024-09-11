"use client";
import { ReactNode } from "react";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "./globals.css";
import Script from "next/script";

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
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkTelegram = () => {
        if (window.Telegram?.WebApp) {
          setIsTelegram(true);
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
        <TelegramProvider>
          {" "}
          {isTelegram ? (
            <Suspense fallback={<div>Loading Telegram...</div>}>
              {children}{" "}
            </Suspense>
          ) : (
            <div>This app is not running inside Telegram.</div>
          )}
        </TelegramProvider>
      </body>
    </html>
  );
}
