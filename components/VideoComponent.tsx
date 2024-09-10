import React, { useState } from "react";
import { FaYoutube, FaTwitch } from "react-icons/fa";
import clsx from "clsx";

const activitiesData = [
  {
    id: 1,
    name: "Video 1",
    prize: "gold",
    QTY: 1,
    claimed: false,
    watched: false,
    videoUrl: "https://example.com/video1",
  },
  {
    id: 2,
    name: "Video 2",
    prize: "chest",
    QTY: 2,
    claimed: false,
    watched: false,
    videoUrl: "https://example.com/video2",
  },
];

interface Activity {
  id: number;
  name: string;
  prize: string;
  QTY: number;
  claimed: boolean;
  watched: boolean;
  videoUrl: string;
}

const ActivityComponent = () => {
  const [activities, setActivities] = useState<Activity[]>(activitiesData);

  const handleWatchVideo = (index: number) => {
    window.open(activities[index].videoUrl, "_blank");

    setActivities((prevActivities) =>
      prevActivities.map((activity, i) =>
        i === index ? { ...activity, watched: true } : activity
      )
    );
  };

  const handleClaimPrize = (index: number) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity, i) =>
        i === index ? { ...activity, claimed: true } : activity
      )
    );
  };

  return (
    <div className="flex flex-col items-center mt-7 text-white font-serif">
      {activities.map((activity, index) => (
        <div
          key={activity.id}
          className="flex items-center justify-between p-4 glass-effect2 rounded-lg mb-2 w-full max-w-md"
        >
          <div className="flex items-center">
            {activity.prize === "gold" ? (
              <FaYoutube className="text-red-600 text-xl mr-3" />
            ) : (
              <FaTwitch className="text-purple-600 text-xl mr-3" />
            )}
            <span>{activity.name}</span>
          </div>
          <div>
            {!activity.claimed ? (
              <>
                {!activity.watched ? (
                  <button
                    className="bg-lightGold text-dark px-4 py-2 rounded"
                    onClick={() => handleWatchVideo(index)}
                  >
                    Watch
                  </button>
                ) : (
                  <button
                    className="bg-lightGold text-dark px-4 py-2 rounded"
                    onClick={() => handleClaimPrize(index)}
                    disabled={activity.claimed}
                  >
                    Claim Prize
                  </button>
                )}
              </>
            ) : (
              <span>Claimed</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityComponent;
