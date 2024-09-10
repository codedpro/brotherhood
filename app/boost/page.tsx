// pages/boost.tsx
"use client";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import Map from "@/components/Map";
import CellDetailsModal from "@/components/CellDetailsModal";
import React, { useState, useEffect } from "react";

interface Cell {
  id: number;
  latitude: number;
  longitude: number;
  owner: string | null;
  isForSale: boolean;
  price: number | null;
}

const hardcodedCells: Cell[] = [
  {
    id: 1,
    latitude: 50,
    longitude: 60,
    owner: null,
    isForSale: true,
    price: 100,
  },
  {
    id: 2,
    latitude: 0,
    longitude: 1,
    owner: "User1",
    isForSale: true,
    price: 150,
  },
  {
    id: 3,
    latitude: 1,
    longitude: 0,
    owner: "User2",
    isForSale: false,
    price: null,
  },
  {
    id: 4,
    latitude: 1,
    longitude: 1,
    owner: "me",
    isForSale: true,
    price: 200,
  },
  {
    id: 5,
    latitude: 2,
    longitude: 2,
    owner: "me",
    isForSale: false,
    price: null,
  },
];

const getRandomPrice = () => Math.floor(Math.random() * 1000) + 100;

export default function Boost() {
  const [cells, setCells] = useState<Cell[]>([]);
  const [coins, setCoins] = useState(1000000);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  useEffect(() => {
    const grid: Cell[] = [];
    for (let lat = 0; lat < 100; lat++) {
      for (let long = 0; long < 100; long++) {
        grid.push({
          id: lat * 100 + long,
          latitude: lat,
          longitude: long,
          owner: null,
          isForSale: true,
          price: getRandomPrice(),
        });
      }
    }

    hardcodedCells.forEach((cell) => {
      const index = grid.findIndex(
        (c) => c.latitude === cell.latitude && c.longitude === cell.longitude
      );
      if (index !== -1) {
        grid[index] = cell;
      }
    });

    setCells(grid);
  }, []);

  const handleCellClick = (cell: Cell) => {
    setSelectedCell(cell);
  };

  const handleBuy = () => {
    if (
      selectedCell &&
      selectedCell.isForSale &&
      selectedCell.price &&
      selectedCell.price <= coins
    ) {
      setCoins(coins - selectedCell.price);
      const updatedCells = cells.map((cell) =>
        cell.id === selectedCell.id
          ? { ...cell, owner: "me", isForSale: false, price: null }
          : cell
      );
      setCells(updatedCells);
      setSelectedCell(null);
      alert("You have purchased this land!");
    }
  };

  return (
    <Layout>
      <Map
        coins={coins}
        cells={cells}
        onCellClick={handleCellClick}
        onBuy={handleBuy}
      />
      <CellDetailsModal
        cell={selectedCell}
        onClose={() => setSelectedCell(null)}
        onBuy={handleBuy}
        coins={coins}
      />
    </Layout>
  );
}
