import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaUserPlus, FaTrophy } from "react-icons/fa";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

interface Referral {
  id: number | null;
  number: string;
}

const referralsData = {
  rightSide: [
    { id: 1, number: "1" },
    { id: 2, number: "2" },
    { id: 3, number: "3" },
  ] as Referral[],
  leftSide: [
    { id: 1, number: "1" },
    { id: 2, number: "2" },
    { id: 3, number: "4" },
  ] as Referral[],
};

const prizesData: { levels: { [key: number]: string } } = {
  levels: {
    1: "10M",
    2: "1 NFT",
    3: "Golden Chest",
  },
};

const maxLevel = 10;

const getLevelLimit = (level: number): number => Math.pow(2, level - 1);

const Referral = () => {
  const [rightSideReferrals, setRightSideReferrals] = useState<Referral[]>(
    referralsData.rightSide
  );
  const [leftSideReferrals, setLeftSideReferrals] = useState<Referral[]>(
    referralsData.leftSide
  );
  const [scrollIndex, setScrollIndex] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play none none reverse",
        },
      }
    );

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 2
      ) {
        loadMoreItems();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadMoreItems = () => {
    setScrollIndex((prevIndex) => {
      const newIndex = prevIndex + 20;
      setRightSideReferrals(referralsData.rightSide.slice(0, newIndex));
      setLeftSideReferrals(referralsData.leftSide.slice(0, newIndex));
      return newIndex;
    });
  };

  const getLevelPrize = (level: number) =>
    prizesData.levels[level] || "No prize";

  const renderLevel = (level: number) => {
    const leftReferral = leftSideReferrals[level - 1] || {
      id: null,
      number: "Invite",
    };
    const rightReferral = rightSideReferrals[level - 1] || {
      id: null,
      number: "Invite",
    };
    const leftNumber = parseInt(leftReferral.number, 10);
    const rightNumber = parseInt(rightReferral.number, 10);
    const levelLimit = getLevelLimit(level);
    const isLeftCompleted = leftNumber >= levelLimit;
    const isRightCompleted = rightNumber >= levelLimit;
    const isLevelCompleted = isLeftCompleted && isRightCompleted;
    const middleNodeColor = isLevelCompleted ? "bg-lightGold" : "bg-gray-500";

    return (
      <div
        key={level}
        className="flex items-center justify-center mt-1 relative"
      >
        <div className="w-1/4 flex justify-end">
          <div
            className={clsx("flex items-center p-2 border rounded-lg", {
              "border-lightGold bg-lightGold text-black": isLeftCompleted,
              "border-gray-500 bg-gray-700": !isLeftCompleted,
            })}
          >
            <FaUserPlus className="mr-2" />
            {leftReferral.number}
          </div>
        </div>
        <div className="w-1/3 flex flex-col items-center relative">
          <div
            className={`w-12 h-12 rounded-full mb-2 ${middleNodeColor} flex items-center justify-center text-black`}
          >
            {isLevelCompleted ? <FaTrophy /> : <span>{level}</span>}
          </div>
          {level < maxLevel && (
            <div
              className={`w-0.5 h-16 ${
                isLevelCompleted ? "bg-lightGold" : "bg-gray-500"
              }`}
            ></div>
          )}
          <div className="text-center mt-2">{getLevelPrize(level)}</div>
          {level < maxLevel && (
            <div
              className={`w-0.5 h-8 ${
                isLevelCompleted ? "bg-lightGold" : "bg-gray-500"
              }`}
            ></div>
          )}
        </div>
        <div className="w-1/4 flex justify-start">
          <div
            className={clsx("flex items-center p-2 border rounded-lg", {
              "border-lightGold bg-lightGold text-black": isRightCompleted,
              "border-gray-500 bg-gray-700": !isRightCompleted,
            })}
          >
            <FaUserPlus className="mr-2" />
            {rightReferral.number}
          </div>
        </div>
        {isLevelCompleted && (
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-1/3 border-b-4 border-lightGold"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="mt-7 text-center text-white">
      <div className="flex flex-col items-center overflow-y-scroll h-[60vh] absolute w-full left-0">
        {Array.from({ length: maxLevel }, (_, i) => renderLevel(i + 1))}
      </div>
    </div>
  );
};

export default Referral;
