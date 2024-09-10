import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FaMapMarkedAlt } from "react-icons/fa";

interface CollectionItem {
  id: number;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
}

interface CollectionProps {
  items: CollectionItem[];
  title: string;
  totalSlots: number;
  icon?: JSX.Element;
}

const Collection: React.FC<CollectionProps> = ({ items, title, totalSlots, icon }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const childrenArray = Array.from(containerRef.current.children);
      gsap.fromTo(
        childrenArray,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1 }
      );
    }
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { scale: 1.1, duration: 0.3 });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3 });
  };

  // Calculate empty slots
  const emptySlots = totalSlots - items.length;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-serif text-lightGold mb-4 text-center">{title}</h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-4" ref={containerRef}>
          {items.map((item) => (
            <div
              key={item.id}
              className="card"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={`Item ${item.id}`}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-lightGold" >
                  {icon || <FaMapMarkedAlt className="w-16 h-16 text-lightGold" />}
                  <p className="text-white mt-2 text-xs">
                    {item.latitude},{item.longitude}
                  </p>
                </div>
              )}
            </div>
          ))}
          {/* Render empty slots */}
          {Array.from({ length: emptySlots }, (_, index) => (
            <div key={`empty-${index}`} className="empty-card">
              <svg
                className="icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h14M12 5l7 7-7 7"
                ></path>
              </svg>
              <span className="text-lightGold mt-2">Empty</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
