"use client";

import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import { FaCoins } from "react-icons/fa";

const statsData = {
  totalShareBalance: 100000000,
  totalTouches: 1010101000040,
  totalPlayers: 9391023192,
  dailyUsers: 39192020,
  onlinePlayers: 123456,
};

function formatLargeNumber(number: number) {
  if (number >= 1e12) return (number / 1e12).toFixed(3) + " T";
  if (number >= 1e9) return (number / 1e9).toFixed(3) + " B";
  if (number >= 1e6) return (number / 1e6).toFixed(3) + " M";
  return number.toLocaleString();
}

function formatNumberWithSpaces(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function stats() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center text-white font-serif">
        <div className="p-4 text-center">
          <h1 className="text-sm mb-2 text-gray-400 opacity-80">
            Total Share Balance:
          </h1>
          <h1 className="text-4xl mb-4 flex items-center justify-center">
            <FaCoins className="mr-2 text-lightGold " />{" "}
            {formatLargeNumber(statsData.totalShareBalance)}
          </h1>
        </div>

        <hr className="absolute w-4/5 border-t border-gray-500  opacity-30 top-[7rem]" />

        <div className="p-4 text-center">
          <h1 className="text-sm mb-2 text-gray-400 opacity-80">
            Total Touches:
          </h1>
          <h1 className="text-3xl mb-4">
            {formatNumberWithSpaces(statsData.totalTouches)}
          </h1>
        </div>
        <div className="p-4 text-center ">
          <h1 className="text-sm mb-2 text-gray-400 opacity-80">
            Total Players:
          </h1>
          <h1 className="text-3xl mb-4">
            {formatNumberWithSpaces(statsData.totalPlayers)}
          </h1>
        </div>
        <div className="p-4 text-center">
          <h1 className="text-sm mb-2 text-gray-400 opacity-80">
            Daily Users:
          </h1>
          <h1 className="text-3xl mb-4">
            {formatNumberWithSpaces(statsData.dailyUsers)}
          </h1>
        </div>
        <div className="p-4 text-center">
          <h1 className="text-sm mb-2 text-gray-400 opacity-80">
            Online Players:
          </h1>
          <h1 className="text-3xl mb-4">
            {formatNumberWithSpaces(statsData.onlinePlayers)}
          </h1>
        </div>
      </div>
    </Layout>
  );
}
