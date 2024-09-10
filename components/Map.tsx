"use client";
import React, { useState, useEffect, useRef } from "react";
import "tailwindcss/tailwind.css";

interface Cell {
  id: number;
  latitude: number;
  longitude: number;
  owner: string | null;
  isForSale: boolean;
  price: number | null;
}

interface MapProps {
  coins: number;
  cells: Cell[];
  onCellClick: (cell: Cell) => void;
  onBuy: (cell: Cell) => void;
}

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 1000;
const CELL_BASE_SIZE = 15;
const GRID_ZOOM_THRESHOLD = 1.5;
const REGION_COLORS = [
  "rgba(190, 0, 0",
  "rgba(0, 144, 0)",
  "rgba(238, 232, 0)",
  "rgba(190, 0, 166)",
  "rgb(0 150 177)",
  "rgba(0, 255, 255, 0.5)",
  "rgba(128, 0, 0)",
  "rgb(118 123 106)",
  "rgba(128, 128, 0, 0.5)",
];

const Map: React.FC<MapProps> = ({ coins, cells, onCellClick, onBuy }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cellSize = CELL_BASE_SIZE * zoomLevel;

        // Draw cells with region overlay
        cells.forEach((cell) => {
          const x = cell.longitude * cellSize + offsetX;
          const y = cell.latitude * cellSize + offsetY;
          const regionColor = getRegionColor(cell.latitude, cell.longitude);

          ctx.fillStyle = cellStatusColor(cell);
          ctx.fillRect(x, y, cellSize, cellSize);

          ctx.strokeStyle = regionColor;
          ctx.strokeRect(x, y, cellSize, cellSize);
        });
      }
    }
  }, [cells, zoomLevel, offsetX, offsetY]);

  const handleCellClick = (cell: Cell) => {
    onCellClick(cell);
  };

  const cellStatusColor = (cell: Cell) => {
    if (cell.owner === "me") {
      return cell.isForSale ? "#FFD700" : "#32CD32";
    } else if (cell.owner) {
      return cell.isForSale ? "#FF4500" : "#FF6347";
    } else {
      return cell.isForSale ? "#87CEEB" : "#D3D3D3";
    }
  };

  const getRegionColor = (lat: number, long: number) => {
    const regionIndex = getRegionIndex(lat, long);
    return REGION_COLORS[regionIndex];
  };

  const getRegionIndex = (lat: number, long: number) => {
    const regionSize = 34; // Define a region size
    const row = Math.floor(lat / regionSize);
    const col = Math.floor(long / regionSize);
    const index = (row * 3 + col) % REGION_COLORS.length; // Updated to 3 columns for 9 regions
    return index;
  };

  const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left - offsetX,
      y: evt.clientY - rect.top - offsetY,
    };
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      const pos = getMousePos(canvasRef.current, event.nativeEvent);
      const cellSize = CELL_BASE_SIZE * zoomLevel;
      const lat = Math.floor(pos.y / cellSize);
      const long = Math.floor(pos.x / cellSize);
      const clickedCell = cells.find(
        (cell) => cell.latitude === lat && cell.longitude === long
      );
      if (clickedCell) {
        handleCellClick(clickedCell);
      }
    }
  };

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    const pos = getEventPos(event);
    dragStart.current = { x: pos.x - offsetX, y: pos.y - offsetY };
  };

  const handleDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (dragging.current) {
      const pos = getEventPos(event);
      setOffsetX(pos.x - dragStart.current.x);
      setOffsetY(pos.y - dragStart.current.y);
    }
  };

  const handleDragEnd = () => {
    dragging.current = false;
  };

  const getEventPos = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const isTouchEvent = (
      e: React.MouseEvent | React.TouchEvent
    ): e is React.TouchEvent => "touches" in e;

    if (isTouchEvent(event)) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.2));

  const handleWheel = (event: React.WheelEvent) => {
    if (event.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-display text-lightGold mb-4">
        City Grid Map
      </h1>
      <p className="text-lg text-lightGold mb-4">Coins: {coins}</p>
      <div className="relative w-96 max-w-4xl h-72 overflow-hidden glass-effect2 rounded-lg">
        <canvas
          ref={canvasRef}
          className="cursor-pointer touch-pan-x touch-pan-y"
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          onClick={handleCanvasClick}
          onMouseDown={(e) => {
            e.preventDefault();
            handleDragStart(e);
          }}
          onMouseMove={(e) => {
            e.preventDefault();
            handleDragMove(e);
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleDragEnd();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            handleDragStart(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            handleDragMove(e);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleDragEnd();
          }}
          onWheel={(e) => {
            e.preventDefault();
            handleWheel(e);
          }}
          style={{ touchAction: "none" }}
        />
        <div className="absolute top-2 left-2 flex flex-col space-y-2">
          <button
            className="bg-lightGold text-dark p-2 rounded"
            onClick={handleZoomIn}
          >
            +
          </button>
          <button
            className="bg-lightGold text-dark p-2 rounded"
            onClick={handleZoomOut}
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
};

export default Map;
