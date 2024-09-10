import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaChartBar, FaTasks, FaGem, FaBoxes, FaRocket } from "react-icons/fa";
import { gsap } from "gsap";

const NavBar: React.FC = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const [activePath, setActivePath] = useState("");

  useEffect(() => {

    setActivePath(window.location.pathname);
  }, []);

  const getActiveClass = (path: string) => {
    return activePath === path ? "text-lightGold" : "text-white";
  };

  return (
    <div
      ref={navRef}
      className="glass-effect w-full fixed bottom-0 left-0 py-4 px-6 z-50 bg-gray-800 rounded-t-xl flex justify-between"
    >
      <Link href="/stats">
        <div
          className={`flex flex-col items-center mx-4 cursor-pointer hover:opacity-50 ${getActiveClass(
            "/stats"
          )}`}
        >
          <FaChartBar size={28} />
          <span className="text-xs mt-1">Stats</span>
        </div>
      </Link>
      <Link href="/tasks">
        <div
          className={`flex flex-col items-center mx-4 cursor-pointer hover:opacity-50 ${getActiveClass(
            "/tasks"
          )}`}
        >
          <FaTasks size={28} />
          <span className="text-xs mt-1">Task</span>
        </div>
      </Link>
      <Link href="/">
        <div
          className={`flex flex-col items-center mx-4 cursor-pointer hover:opacity-50 ${getActiveClass(
            "/"
          )}`}
        >
          <FaGem size={28} />
          <span className="text-xs mt-1">Treasure</span>
        </div>
      </Link>
      <Link href="/collections">
        <div
          className={`flex flex-col items-center mx-4 cursor-pointer hover:opacity-50 ${getActiveClass(
            "/collections"
          )}`}
        >
          <FaBoxes size={28} />
          <span className="text-xs mt-1">Collections</span>
        </div>
      </Link>
      <Link href="/boost">
        <div
          className={`flex flex-col items-center mx-4 cursor-pointer hover:opacity-50 ${getActiveClass(
            "/boost"
          )}`}
        >
          <FaRocket size={28} />
          <span className="text-xs mt-1">Boost</span>
        </div>
      </Link>
    </div>
  );
};

export default NavBar;
