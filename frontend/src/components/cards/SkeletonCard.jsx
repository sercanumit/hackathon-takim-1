const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
    <div className="bg-gray-200 dark:bg-gray-700 h-40 animate-pulse"></div>
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;
