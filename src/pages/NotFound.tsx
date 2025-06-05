import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center from-background via-background to-purple-900/20">
      <div className="text-center">
        <h1 className="text-4xl text-violet-500 font-bold mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-4">Kowalski, Status Report.</p>
        <p className="text-m text-gray-600 mb-4">This page was not found, sir.</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Take me back home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
