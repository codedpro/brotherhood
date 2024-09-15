import { useEffect, useState, useRef } from "react";
import Lottie from "react-lottie";
import chestImage from "../public/chests/CLOSED/NO_BACKLIGHT/chests-01.png";
import openChestImage from "../public/chests/OPEN_EMPTY/NO_BACKLIGHT/chests-01.png";

const lottieAnimations = {
  level1: require("../public/mining/level1.json"),
};

interface TreasureProps {
  startTime: number;
  endTime: number;
  isMining: boolean;
  itemName: string;
  claimReward: () => void;
}

const Treasure: React.FC<TreasureProps> = ({
  isMining,
  itemName,
  claimReward,
  startTime,
  endTime,
}) => {
  const [lottieFile, setLottieFile] = useState<any>(null);
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    const miningLevelMatch = itemName.match(/mining_level(\d+)/);
    if (miningLevelMatch) {
      const level = miningLevelMatch[1];
      setLottieFile(
        lottieAnimations[`level${level}` as keyof typeof lottieAnimations]
      );
    }
  }, [itemName]);

  const lottieOptions = {
    loop: true,
    autoplay: false, // Disable autoplay initially
    animationData: lottieFile,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="relative min-h-screen w-full">
      <div
        className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          pointerEvents: "none", // Disable all click events
          userSelect: "none", // Prevent text/image selection
        }}
      >
        {lottieFile && (
          <Lottie
            options={lottieOptions}
            height="auto"
            width="60vw" // Make it responsive based on viewport width
            isPaused={!isMining} // Play animation when mining starts
            ref={lottieRef}
          />
        )}
      </div>
    </div>
  );
};

export default Treasure;
