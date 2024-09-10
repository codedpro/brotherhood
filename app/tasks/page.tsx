"use client";

import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FaCoins } from "react-icons/fa";
import Referral from "@/components/Referral";
import TreeComponent from "@/components/ TreeNode";
import VideoComponent from "@/components/VideoComponent";
import Special from "@/components/Special";

export default function Tasks() {
  const [activeTab, setActiveTab] = useState("Videos");
  function formatNumberWithSpaces(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  const balance = 100200123;
  const renderContent = () => {
    switch (activeTab) {
      case "Videos":
        return <VideoComponent />;
      case "Special":
        return <Special />;
      case "Referral":
        return <Referral />;
      case "Nodes":
        return <TreeComponent />;
      default:
        return <VideoComponent />;
    }
  };
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center text-white font-serif ">
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
              activeTab === "Videos"
                ? "bg-lightGold text-black"
                : "bg-gray-700 text-white"
            } rounded`}
            onClick={() => setActiveTab("Videos")}
          >
            Videos
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "Special"
                ? "bg-lightGold text-black"
                : "bg-gray-700 text-white"
            } rounded`}
            onClick={() => setActiveTab("Special")}
          >
            Special
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
