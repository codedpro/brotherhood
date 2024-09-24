"use client";

import Layout from "@/components/Layout";
import { Mining } from "@/components/Mining";
import Treasure from "@/components/Treasure";
import { useState, useEffect } from "react";
import { FaCoins } from "react-icons/fa";
import { useTelegram } from "react-telegram-miniapp";

const formatScore = (score: number) => {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function Home() {
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [serverCurrentTime, setServerCurrentTime] = useState<number | null>(
    null
  );
  const [isClaimable, setIsClaimable] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const [level, setLevel] = useState<number>(1); // Default level
  const [maxMine, setMaxMine] = useState<number>(2000); // Default Max Mine

  const startMining = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_URL + "/startmining",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            initData: initData,
          },
        }
      );
      const result = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Data:", result);

      if (response.status === 200 || response.status === 400) {
        const miningData = result;

        if (miningData) {
          const { Mine_Started, End_Time, Current_Time } = miningData;

          const startTime = new Date(Mine_Started).getTime();
          const endTime = new Date(End_Time).getTime();
          const serverCurrentTime = new Date(Current_Time).getTime();

          setStartTime(startTime);
          setEndTime(endTime);
          setServerCurrentTime(serverCurrentTime);

          const remainingTime = endTime - serverCurrentTime;
          const totalDuration = endTime - startTime;

          if (remainingTime > 0) {
            setTimeLeft(remainingTime);
            setProgress(
              ((totalDuration - remainingTime) / totalDuration) * 100
            );
            setIsClaimable(false);
          } else {
            setIsClaimable(true);
            setTimeLeft(0);
            setProgress(100);
          }
        } else {
          console.error("Mining data is undefined or empty.");
        }
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error starting mining:", error);
    }
  };

  useEffect(() => {
    if (endTime && startTime && serverCurrentTime) {
      const interval = setInterval(() => {
        setServerCurrentTime((prevServerTime) =>
          prevServerTime ? prevServerTime + 1000 : null
        );

        const remainingTime = endTime - (serverCurrentTime ?? 0);
        setTimeLeft(remainingTime);

        const totalDuration = endTime - startTime;
        const progress =
          ((totalDuration - remainingTime) / totalDuration) * 100;

        setProgress(Math.min(Math.max(progress, 0), 100));

        if (remainingTime <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          setProgress(100);
          setIsClaimable(true);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime, endTime, serverCurrentTime]);

  const claimReward = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_URL + "/claimmining",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            initData: initData,
          },
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        if (result.status === "Earned") {
          setScore((prevScore) => prevScore + result.Max_Mine);
          alert(
            `You earned ${result.Max_Mine}! Your new balance is ${result.Balance}.`
          );
        }
      } else if (response.status === 400) {
        if (result.status === "Mining Is Not Started") {
          alert("Mining has not started yet. Please start mining first.");
        }
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    }

    setStartTime(null);
    setEndTime(null);
    setServerCurrentTime(null);
    setTimeLeft(0);
    setProgress(0);
    setIsClaimable(false);
  };

  const { webApp, user } = useTelegram();
  const initData =
    "user=%7B%22id%22%3A373342220%2C%22first_name%22%3A%22Coded%22%2C%22last_name%22%3A%22Pro%22%2C%22username%22%3A%22Coded_Pro%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=8981388618691983163&chat_type=private&auth_date=1726636740&hash=2b2e3b5c48233236717b8d065d469ef6c2eb3ddda585201ced4a9dcbfa428dc1";

  useEffect(() => {
    if (initData) {
      const fetchMiningData = async () => {
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
          console.log("Mining Data on Load:", result);
          setScore(result.Balance);
          setLevel(result.Level); // Set the user level
          setMaxMine(result.Max_Mine); // Set Max Mine value

          if (
            result?.Mine_Started &&
            result?.End_Time &&
            result?.Current_Time
          ) {
            const startTime = new Date(result.Mine_Started).getTime();
            const endTime = new Date(result.End_Time).getTime();
            const serverCurrentTime = new Date(result.Current_Time).getTime();

            setStartTime(startTime);
            setEndTime(endTime);
            setServerCurrentTime(serverCurrentTime);

            const remainingTime = endTime - serverCurrentTime;
            const totalDuration = endTime - startTime;

            if (remainingTime > 0) {
              setTimeLeft(remainingTime);
              setProgress(
                ((totalDuration - remainingTime) / totalDuration) * 100
              );
              setIsClaimable(false);
            } else {
              setIsClaimable(true);
              setTimeLeft(0);
              setProgress(100);
            }
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching mining data:", error);
          setLoading(false);
        }
      };

      fetchMiningData();
    }
  }, [initData]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-y-auto ">
        <div className="absolute top-8 text-center text-4xl font-serif">
          <h1 className="flex items-center justify-center">
            <FaCoins className="mr-2 text-lightGold" />
            {user?.id}
            {formatScore(score)}
          </h1>
        </div>

        <div className="flex-grow w-full flex justify-center items-center">
          {/*     <Treasure
            startTime={startTime || 0}
            endTime={endTime || 0}
            isMining={!!endTime && !isClaimable}
            itemName="mining_level1"
            claimReward={claimReward}
          /> */}

          <Mining />
        </div>

        {endTime && !isClaimable && (
          <div className="absolute bottom-16 w-full flex justify-center">
            <div className="w-[19rem] relative p-3">
              <div className="flex justify-between items-center mb-2 text-white">
                <span>Level: {level}</span>
                <span>Max Mine: {maxMine}</span>
              </div>
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
