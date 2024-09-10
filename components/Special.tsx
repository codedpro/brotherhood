import React, { useState } from "react";
import { FaTelegramPlane, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";


const activitiesData = [
  {
    id: 1,
    name: "Join Telegram",
    prize: "gold",
    QTY: 1,
    chestUrl: "",
    claimed: false,
    completed: false,
    link: "https://t.me/yourchannel",
    icon: <FaTelegramPlane className="text-blue-500 mr-3" />,
  },
  {
    id: 2,
    name: "Follow Instagram",
    prize: "chest",
    QTY: 2,
    chestUrl: "/public/chests/CLOSED/NO_BACKLIGHT/chests-01.png",
    claimed: false,
    completed: false,
    link: "https://instagram.com/yourprofile",
    icon: <FaInstagram className="text-pink-500 mr-3" />,
  },
  {
    id: 3,
    name: "Subscribe YouTube",
    prize: "gold",
    QTY: 1,
    chestUrl: "",
    claimed: false,
    completed: false,
    link: "https://youtube.com/yourchannel",
    icon: <FaYoutube className="text-red-600 mr-3" />,
  },
  {
    id: 4,
    name: "Visit Twitter",
    prize: "chest",
    QTY: 2,
    chestUrl: "/public/chests/CLOSED/NO_BACKLIGHT/chests-01.png",
    claimed: false,
    completed: false,
    link: "https://twitter.com/yourprofile",
    icon: <FaTwitter className="text-blue-400 mr-3" />,
  },
];

interface Activity {
  id: number;
  name: string;
  prize: string;
  QTY: number;
  chestUrl: string;
  claimed: boolean;
  completed: boolean;
  link: string;
  icon: JSX.Element;
}

const Special = () => {
  const [activities, setActivities] = useState<Activity[]>(activitiesData);

  const handleCompleteActivity = (index: number) => {
    window.open(activities[index].link, "_blank");

    setActivities((prevActivities) =>
      prevActivities.map((activity, i) =>
        i === index ? { ...activity, completed: true } : activity
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
          <div className="flex items-center  text-xl">
            {activity.icon}
            <span className="text-sm">{activity.name}</span>
          </div>
          <div>
            {!activity.claimed ? (
              <>
                {!activity.completed ? (
                  <button
                    className="bg-lightGold text-dark px-4 py-2 rounded"
                    onClick={() => handleCompleteActivity(index)}
                  >
                    Complete
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

export default Special;
