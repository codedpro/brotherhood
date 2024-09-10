import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import chestImage from "../public/chests/CLOSED/NO_BACKLIGHT/chests-01.png";
import openChestImage from "../public/chests/OPEN_EMPTY/NO_BACKLIGHT/chests-01.png";

interface TreasureProps {
  energy: number;
  energyPerSecond: number;
  scorePerTap: number;
  maxConcurrentTaps: number;
  updateScore: (score: number) => void;
  updateEnergy: (amount: number) => void;
  chestHealth: number;
  updateChestHealth: (amount: number) => void;
}

const Treasure: React.FC<TreasureProps> = ({
  energy,
  energyPerSecond,
  scorePerTap,
  maxConcurrentTaps,
  updateScore,
  updateEnergy,
  chestHealth,
  updateChestHealth,
}) => {
  const [taps, setTaps] = useState(1);
  const treasureRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      updateEnergy(Math.min(energy + energyPerSecond, 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [energy, energyPerSecond, updateEnergy]);

  const handleTap = (e: React.MouseEvent) => {
    if (energy >= scorePerTap && taps < maxConcurrentTaps && chestHealth > 0) {
      updateEnergy(energy - scorePerTap);
      setTaps((prev) => prev + 1);

      updateScore(scorePerTap);
      updateChestHealth(chestHealth - scorePerTap);
      animateTreasure(scorePerTap, e.clientX, e.clientY);
      animateShake();
      setTimeout(() => setTaps((prev) => prev - 1), 1000);
    }
  };

  const animateTreasure = (score: number, x: number, y: number) => {
    if (treasureRef.current) {
      const rect = treasureRef.current.getBoundingClientRect();
      const treasure = document.createElement("div");
      treasure.className = "treasure-animation";
      treasure.innerText = `+${score}`;
      treasure.style.left = `${x - rect.left}px`;
      treasure.style.top = `${y - rect.top}px`;
      treasureRef.current.appendChild(treasure);

      gsap.to(treasure, {
        y: -100,
        opacity: 0,
        duration: 1,
        onComplete: () => {
          treasure.remove();
        },
      });
    }
  };

  const animateShake = () => {
    if (imageRef.current) {
      const intensity = Math.min(taps / 50, 1);
      gsap
        .timeline()
        .to(imageRef.current, { x: -taps * intensity, duration: 0.05 })
        .to(imageRef.current, {
          x: 10 * intensity,
          duration: 0.1,
          yoyo: true,
          repeat: 5,
        })
        .to(imageRef.current, { x: 0, duration: 0.05 });
    }
  };

  return (
    <div className="relative flex justify-center items-center">
      <Image
        src={chestHealth > 0 ? chestImage : openChestImage}
        alt="Treasure Chest"
        width={1680}
        height={1680}
        className="absolute"
        style={{
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(1.5)",
        }}
        ref={imageRef}
      />
      <div
        ref={treasureRef}
        onClick={handleTap}
        className="relative flex justify-center items-center rounded-full w-[19rem] h-[19rem]"
      ></div>
    </div>
  );
};

export default Treasure;
