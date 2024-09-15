"use client";

import Layout from "@/components/Layout";
import Treasure from "@/components/Treasure";
import { useState, useEffect } from "react";
import { FaCoins } from "react-icons/fa";
import { useTelegram } from "react-telegram-miniapp";

const formatScore = (score: number) => {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function Home() {
  const [score, setScore] = useState(20030010);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isClaimable, setIsClaimable] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const startMining = () => {
    const now = Date.now();
    const miningDuration = 60000;
    setStartTime(now);
    setEndTime(now + miningDuration);
    setIsClaimable(false);
  };

  const claimReward = () => {
    console.log("Treasure claimed!");
    setScore((prev) => prev + 500);
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(0);
    setProgress(0);
    setIsClaimable(false); // Reset the claimable state
  };

  useEffect(() => {
    if (endTime) {
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const remainingTime = endTime - currentTime;
        setTimeLeft(remainingTime);

        const totalDuration = endTime - startTime!;
        setProgress(((totalDuration - remainingTime) / totalDuration) * 100);

        if (remainingTime <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          setIsClaimable(true);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime, endTime]);

  const { webApp, user } = useTelegram();
  const initData = webApp?.initData;

  useEffect(() => {
    if (initData) {
      const postData = async () => {
        try {
          const response = await fetch(
            process.env.NEXT_PUBLIC_URL + "/NewUser",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                initData: initData,
              },
            }
          );
          const result = await response.json();
          console.log(result);
        } catch (error) {
          console.error("Error posting data:", error);
        }
      };

      postData();
    }
  }, [initData, user?.id]);

  return (
    <Layout>
      <div className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-auto">
        <div className="absolute top-8 text-center text-4xl font-serif">
          <h1 className="flex items-center justify-center">
            <FaCoins className="mr-2 text-lightGold" />
            {formatScore(score)}
          </h1>
        </div>

        <div className="flex-grow w-full flex justify-center items-center">
          <Treasure
            startTime={startTime || 0}
            endTime={endTime || 0}
            isMining={!!endTime && !isClaimable}
            itemName="mining_level1"
            claimReward={claimReward}
          />
        </div>

        {endTime && !isClaimable && (
          <div className="absolute bottom-16 w-full flex justify-center">
            <div className="w-[19rem] relative p-3">
              <div
                className="absolute w-full flex justify-center items-center text-white text-sm"
                style={{ top: "-1rem" }}
              >
                Time Remaining: {Math.max(timeLeft / 1000, 0).toFixed(0)}s
              </div>
              <div className="relative mb-4">
                <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden glass-effect">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full absolute top-0 left-0 inner-bar"
                    style={{ width: `${98 - progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full absolute bottom-20 flex justify-center">
          <div className="w-[19rem] relative p-3">
            <div className="flex justify-center gap-4 ">
              {!isClaimable && !endTime && (
                <button
                  className="bg-green-500 text-white py-2 px-6 rounded-lg"
                  onClick={startMining}
                >
                  Start Mining
                </button>
              )}
              {isClaimable && (
                <button
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg"
                  onClick={claimReward}
                >
                  Claim
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
