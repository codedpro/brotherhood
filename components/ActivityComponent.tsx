import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Activity {
  id: number;
  name: string;
  description: string;
  prize: string;
  QTY: number;
  done: boolean;
  imageUrl: string;
  rewardIcon: string;
}

interface ActivityComponentProps {
  headerTitle: string;
  headerIcon: React.ReactNode;
  activitiesData: Activity[];
  onTaskCompleted: (id: number) => void;
}

const ActivityComponent: React.FC<ActivityComponentProps> = ({
  headerTitle,
  headerIcon,
  activitiesData,
  onTaskCompleted,
}) => {
  const [activities, setActivities] = useState<Activity[]>(activitiesData);
  const [currentPage, setCurrentPage] = useState(0);
  const tasksPerPage = 4; // 4x2 grid: 8 tasks per page

  const totalPages = Math.ceil(activities.length / tasksPerPage);

  const handleCardClick = (id: number) => {
    updateActivity(id, { done: true });
    onTaskCompleted(id);
  };

  const updateActivity = (id: number, updatedFields: Partial<Activity>) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id ? { ...activity, ...updatedFields } : activity
      )
    );
  };

  // Pagination logic: slice activities based on the current page
  const paginatedActivities = activities.slice(
    currentPage * tasksPerPage,
    (currentPage + 1) * tasksPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 text-white font-serif w-full">
      {/* Header with Arrow Navigation */}
      <div className="flex items-center justify-between w-full mb-2 px-2 sm:px-4">
        <div>{headerIcon}</div>
        <h2 className="text-base sm:text-lg md:text-xl font-bold">
          {headerTitle}
        </h2>
        {/* Page navigation arrows */}
        <div className="flex items-center">
          {currentPage > 0 && (
            <FaArrowLeft
              onClick={handlePrevPage}
              className="cursor-pointer text-lg mr-4"
            />
          )}
          {currentPage < totalPages - 1 && (
            <FaArrowRight
              onClick={handleNextPage}
              className="cursor-pointer text-lg"
            />
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center w-full px-4">
        {paginatedActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex-shrink-0 flex flex-col p-2 sm:p-3 md:p-4 border border-gray-400 rounded-lg bg-gray-800 cursor-pointer"
            onClick={() => handleCardClick(activity.id)}
          >
            <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
              <img
                src={activity.imageUrl}
                alt={activity.name}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded mr-2 sm:mr-3"
              />
              <div className="flex-1">
                <span className="block font-bold text-xs sm:text-sm md:text-base text-white">
                  {activity.name}
                </span>
                <span className="block text-xs text-gray-400">
                  {activity.description}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-white font-bold text-xs sm:text-sm md:text-base">
                  {activity.QTY}
                </span>
                <img
                  src={activity.rewardIcon}
                  alt="reward"
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityComponent;
