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

const Treasure: React.FC<TreasureProps> = ({ isMining, itemName }) => {
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
    autoplay: false,
    animationData: lottieFile,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <div
        className="flex justify-center items-center"
        style={{
          pointerEvents: "none",
          userSelect: "none",
          width: "100%",
          height: "100%",
          overflow: "visible", // Ensure no content is hidden
        }}
      >
        {lottieFile && (
          <Lottie
            options={lottieOptions}
            height="50vh" // Large size relative to viewport height
            width="1000vw"  // Large size relative to viewport width
            isPaused={!isMining}
            ref={lottieRef}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Treasure;
