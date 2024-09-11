"use client";

import Layout from "@/components/Layout";
import Treasure from "@/components/Treasure";
import { useState, useEffect } from "react";
import { FaBolt, FaCoins } from "react-icons/fa";
import { useTelegram } from "react-telegram-miniapp";

const formatScore = (score: number) => {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function Home() {
  const [score, setScore] = useState(20030010);
  const [energy, setEnergy] = useState(1000);
  const [chestHealth, setChestHealth] = useState(2000);

  const updateScore = (points: number) => {
    setScore((prev) => prev + points);
  };

  const updateEnergy = (amount: number) => {
    setEnergy(amount);
  };

  const updateChestHealth = (amount: number) => {
    setChestHealth(amount);
  };

  const { webApp, user } = useTelegram();
  const initData = webApp?.initData;

  useEffect(() => {
    if (initData) {
      // POST request with header InitData
      const postData = async () => {
        try {
          const response = await fetch(
            "https://7dff-2-147-9-6.ngrok-free.app/api/base/testapi",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                InitData: initData, // Add InitData header
              },
            }
          );
          const result = await response.json();
          console.log("Response:", result);
        } catch (error) {
          console.error("Error posting data:", error);
        }
      };

      postData();
    }
  }, [initData, score, energy, chestHealth, user?.id]);

  return (
    <Layout>
      <div className="text-center text-4xl mb-6 font-serif mt-20">
        <h1 className="flex items-center justify-center text-lightGold text-xl">
          {user?.id} d
        </h1>
        <h1 className="flex items-center justify-center">
          <FaCoins className="mr-2 text-lightGold " />
          {formatScore(score)}
        </h1>
      </div>
      <Treasure
        energy={energy}
        energyPerSecond={100}
        scorePerTap={20}
        maxConcurrentTaps={10}
        updateScore={updateScore}
        updateEnergy={updateEnergy}
        chestHealth={chestHealth}
        updateChestHealth={updateChestHealth}
      />
      <div className="">
        <div className="w-[19rem] mr-11 mb-20  relative p-3">
          <div
            className="absolute w-full flex justify-center  items-center text-white text-sm"
            style={{ top: "-1rem" }}
          >
            {chestHealth}/2000
          </div>
          <div className="relative mb-4">
            <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden glass-effect">
              <div
                className="bg-gradient-to-r from-healthStart to-healthEnd h-full rounded-full absolute top-0 left-0 inner-bar"
                style={{ width: `${(chestHealth / 2000) * 98.2}%` }}
              ></div>
            </div>
            <div className="absolute right-[-3.5rem] top-1/2 transform -translate-y-1/2">
              <div className="relative flex items-center justify-center mr-1 w-13 h-13 rounded-full glass-effect">
                <svg className="w-12 h-12 ">
                  <circle
                    className="text-energyStart"
                    strokeWidth="2"
                    strokeDasharray="113"
                    strokeDashoffset={113 - (energy / 1000) * 113}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="18"
                    cx="24"
                    cy="24"
                  />
                </svg>
                <FaBolt className="absolute text-lightGold text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
