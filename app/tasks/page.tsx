"use client";

import Layout from "@/components/Layout";
import { useState } from "react";
import { FaCoins } from "react-icons/fa";
import Referral from "@/components/Referral";
import TreeComponent from "@/components/ TreeNode";
import ActivityComponent from "@/components/ActivityComponent";

export default function Tasks() {
  const [activeTab, setActiveTab] = useState("Activity");

  const videoTasks = [
    {
      id: 1,
      name: "Watch Video 1",
      description: "Learn more about the platform",
      prize: "gold",
      QTY: 750,
      done: false,
      imageUrl: "/images/video1.png",
      rewardIcon: "/images/coins-icon.png",
    },
    {
      id: 2,
      name: "Watch Video 2",
      description: "Explore advanced features",
      prize: "chest",
      QTY: 1000,
      done: false,
      imageUrl: "/images/video2.png",
      rewardIcon: "/images/chest-icon.png",
    },
    {
      id: 3,
      name: "Watch Video 3",
      description: "Discover new ways to use the app",
      prize: "silver",
      QTY: 500,
      done: false,
      imageUrl: "/images/video3.png",
      rewardIcon: "/images/silver-icon.png",
    },
    {
      id: 4,
      name: "Watch Video 4",
      description: "Complete the tutorial to earn rewards",
      prize: "diamond",
      QTY: 1250,
      done: false,
      imageUrl: "/images/video4.png",
      rewardIcon: "/images/diamond-icon.png",
    },
  ];

  const specialTasks = [
    {
      id: 5,
      name: "Special Task 1",
      description: "Complete the special quest",
      prize: "silver",
      QTY: 1000,
      done: false,
      imageUrl: "/images/special1.png",
      rewardIcon: "/images/silver-icon.png",
    },
    {
      id: 6,
      name: "Special Task 2",
      description: "Solve the puzzle to earn a reward",
      prize: "diamond",
      QTY: 2000,
      done: false,
      imageUrl: "/images/special2.png",
      rewardIcon: "/images/diamond-icon.png",
    },
    {
      id: 7,
      name: "Special Task 3",
      description: "Complete the daily challenge",
      prize: "gold",
      QTY: 1500,
      done: false,
      imageUrl: "/images/special3.png",
      rewardIcon: "/images/gold-icon.png",
    },
    {
      id: 8,
      name: "Special Task 4",
      description: "Achieve the top score",
      prize: "platinum",
      QTY: 3000,
      done: false,
      imageUrl: "/images/special4.png",
      rewardIcon: "/images/platinum-icon.png",
    },
  ];

  const socialTasks = [
    {
      id: 9,
      name: "Share on Twitter",
      description: "Share the news about our latest updates",
      prize: "bronze",
      QTY: 500,
      done: false,
      imageUrl: "/images/social1.png",
      rewardIcon: "/images/bronze-icon.png",
    },
    {
      id: 10,
      name: "Share on Facebook",
      description: "Tell your friends about the new features",
      prize: "platinum",
      QTY: 1500,
      done: false,
      imageUrl: "/images/social2.png",
      rewardIcon: "/images/platinum-icon.png",
    },
    {
      id: 11,
      name: "Follow on Instagram",
      description: "Follow us on Instagram to stay updated",
      prize: "silver",
      QTY: 1000,
      done: false,
      imageUrl: "/images/social3.png",
      rewardIcon: "/images/silver-icon.png",
    },
    {
      id: 12,
      name: "Join Discord",
      description: "Join our Discord community for exclusive content",
      prize: "gold",
      QTY: 1250,
      done: false,
      imageUrl: "/images/social4.png",
      rewardIcon: "/images/gold-icon.png",
    },
    {
      id: 13,
      name: "Join Discord",
      description: "Join our Discord community for exclusive content",
      prize: "gold",
      QTY: 1250,
      done: false,
      imageUrl: "/images/social4.png",
      rewardIcon: "/images/gold-icon.png",
    },
  ];

  function formatNumberWithSpaces(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  const balance = 100200123;

  const renderContent = () => {
    switch (activeTab) {
      case "Activity":
        return (
          <div className="mb-32">
            <ActivityComponent
              headerTitle="Video Tasks"
              headerIcon={<FaCoins />}
              activitiesData={videoTasks}
              onTaskCompleted={(id) =>
                console.log("Video task completed with ID:", id)
              }
            />
            <ActivityComponent
              headerTitle="Special Tasks"
              headerIcon={<FaCoins />}
              activitiesData={specialTasks}
              onTaskCompleted={(id) =>
                console.log("Special task completed with ID:", id)
              }
            />
            <ActivityComponent
              headerTitle="Social Tasks"
              headerIcon={<FaCoins />}
              activitiesData={socialTasks}
              onTaskCompleted={(id) =>
                console.log("Social task completed with ID:", id)
              }
            />
          </div>
        );
      case "Referral":
        return <Referral />;
      case "Nodes":
        return (
          <div className="overflow-hidden h-screen">
            {" "}
            <TreeComponent />
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center text-white font-serif  ">
        <div className="p-4 mt-7 text-center">
          <h1 className="text-4xl mb-4 flex items-center justify-center">
            <FaCoins className="mr-2 text-lightGold" />
            {formatNumberWithSpaces(balance)}
          </h1>
        </div>
        <hr className="absolute w-4/5 border-none opacity-30 top-[7rem]" />
        <div className="mt-8 flex space-x-4">
          <button
            style={{ border: "none" }}
            className={`px-4 py-2  border-none ${
              activeTab === "Activity"
                ? "bg-lightGold text-black"
                : "bg-gray-700 text-white"
            } rounded`}
            onClick={() => setActiveTab("Activity")}
          >
            Activity
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "Referral"
                ? "bg-lightGold text-black"
                : "bg-gray-700 text-white"
            } rounded`}
            onClick={() => setActiveTab("Referral")}
          >
            Referral
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "Nodes"
                ? "bg-lightGold text-black"
                : "bg-gray-700 text-white"
            } rounded`}
            onClick={() => setActiveTab("Nodes")}
          >
            Nodes
          </button>
        </div>
        <div className="mt-4 w-full">{renderContent()}</div>
      </div>
    </Layout>
  );
}
