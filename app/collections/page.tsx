"use client";
import React from "react";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import Collection from "@/components/Collection";
import { GiIsland } from "react-icons/gi";

const data = {
  NFT_Slots: 3,
  NFT_Collection: [
    { id: 1, imageUrl: "/NFTs/1.jpg" },
    { id: 2, imageUrl: "/NFTs/2.jpg" },
    { id: 3, imageUrl: "/NFTs/5.jpg" },
  ],
  Chest_Slots: 6,
  Chest_Collection: [
    { id: 1, imageUrl: "/chests/CLOSED/BACKLIGHT/chests-06.png" },
    { id: 2, imageUrl: "/chests/CLOSED/BACKLIGHT/chests-04.png" },
    { id: 3, imageUrl: "/chests/CLOSED/BACKLIGHT/chests-05.png" },
  ],
  Land_Slots: 3,
  Land_Collection: [
    { id: 1, latitude: 123456, longitude: 654321 },
    { id: 2, latitude: 234567, longitude: 765432 },
    { id: 3, latitude: 345678, longitude: 876543 },
  ],
};

const Collections: React.FC = () => {
  return (
    <Layout>
      <div className="h-4/5 overflow-y-scroll p-4 space-y-12 mt-8">
        <Collection
          items={data.NFT_Collection}
          title="NFT Collection"
          totalSlots={data.NFT_Slots}
        />
        <Collection
          items={data.Chest_Collection}
          title="Chest Collection"
          totalSlots={data.Chest_Slots}
        />
        <Collection
          items={data.Land_Collection}
          title="Land Collection"
          totalSlots={data.Land_Slots}
          icon={<GiIsland className="w-12 h-12 text-gray-400" />}
        />
      </div>
    </Layout>
  );
};

export default Collections;
