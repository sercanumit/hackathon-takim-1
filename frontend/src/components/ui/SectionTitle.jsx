import { Link } from "react-router-dom";

const SectionTitle = ({ title, viewAllLink }) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
      {title}
    </h2>
    {viewAllLink && (
      <Link
        to={viewAllLink}
        className="text-purple-600 dark:text-purple-400 hover:underline flex items-center font-medium"
      >
        Tümünü Gör
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    )}
  </div>
);

export default SectionTitle;
