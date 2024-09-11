"use client";
import React, { useRef, useEffect, useCallback } from "react";

interface Cell {
  id: number;
  latitude: number;
  longitude: number;
  owner: string | null;
  isForSale: boolean;
  price: number | null;
}

interface CellDetailsModalProps {
  cell: Cell | null;
  onClose: () => void;
  onBuy: () => void;
  coins: number;
}

const CellDetailsModal: React.FC<CellDetailsModalProps> = ({ cell, onClose, onBuy, coins }) => {
    const modalRef = useRef<HTMLDivElement>(null);
  
    const handleOutsideClick = useCallback((event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }, [onClose]);
  
    useEffect(() => {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, [handleOutsideClick]);
  
    if (!cell) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div ref={modalRef} className="glass-effect2 p-8 rounded-lg w-11/12 max-w-md mx-auto shadow-lg transform transition-all duration-300 ease-in-out">
          <h2 className="text-xl font-bold mb-4 font-display text-gray-200">Cell Details</h2>
          <p className="mb-2"><strong>Latitude:</strong> {cell.latitude}</p>
          <p className="mb-2"><strong>Longitude:</strong> {cell.longitude}</p>
          <p className="mb-2"><strong>Owner:</strong> {cell.owner ? cell.owner : "No Owner"}</p>
          <p className="mb-2"><strong>For Sale:</strong> {cell.isForSale ? "Yes" : "No"}</p>
          {cell.isForSale && cell.price && (
            <p className="mb-2"><strong>Price:</strong> {cell.price} coins</p>
          )}
          <div className="flex justify-between">
            {cell.isForSale && cell.owner !== "me" && (
              <button className="bg-energyStart text-white px-4 py-2 rounded hover:bg-energyEnd transition duration-300" onClick={onBuy} disabled={!!(cell.price && cell.price > coins)}>
                Buy
              </button>
            )}
            {!cell.isForSale && cell.owner !== "me" && (
              <button className="bg-energyEnd text-white px-4 py-2 rounded hover:bg-energyStart transition duration-300" onClick={() => alert("Bid request sent to the owner.")}>
                Make a Bid
              </button>
            )}
            <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default CellDetailsModal;