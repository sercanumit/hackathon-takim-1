import { useMemo } from "react";

const useStoryTheme = (category) => {
  return useMemo(() => {
    const categoryLower = category?.toLowerCase() || "";

    if (categoryLower.includes("fantezi") || categoryLower.includes("fantasy"))
      return {
        primary: "from-purple-600 to-blue-400",
        secondary: "bg-purple-100 dark:bg-purple-900/30",
        accent: "text-purple-600 dark:text-purple-300",
        decoration: "magic",
      };
    else if (
      categoryLower.includes("macera") ||
      categoryLower.includes("adventure")
    )
      return {
        primary: "from-amber-500 to-orange-600",
        secondary: "bg-amber-100 dark:bg-amber-900/30",
        accent: "text-amber-600 dark:text-amber-300",
        decoration: "adventure",
      };
    else if (categoryLower.includes("doğa") || categoryLower.includes("nature"))
      return {
        primary: "from-green-600 to-teal-400",
        secondary: "bg-green-100 dark:bg-green-900/30",
        accent: "text-green-600 dark:text-green-300",
        decoration: "nature",
      };
    else
      return {
        primary: "from-blue-500 to-indigo-600",
        secondary: "bg-blue-100 dark:bg-blue-900/30",
        accent: "text-blue-600 dark:text-blue-300",
        decoration: "default",
      };
  }, [category]);
};

export default useStoryTheme;
