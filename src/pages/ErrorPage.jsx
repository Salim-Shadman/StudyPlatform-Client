import { useEffect } from 'react';
import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  useEffect(() => {
    
    const isChunkLoadError = error?.message?.includes("Failed to fetch dynamically imported module");
    
    
    const hasReloaded = sessionStorage.getItem('reloaded');

    if (isChunkLoadError && !hasReloaded) {
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
    }
  }, [error]);

 
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('reloaded');
    };
    
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center px-4">
      <div className="max-w-md">
        <h1 className="text-9xl font-extrabold text-primary">Oops!</h1>
        <p className="text-2xl md:text-3xl font-semibold mt-4">
          {error.status === 404 ? "Page Not Found" : "An Unexpected Error Occurred"}
        </p>
        <p className="text-base-content/70 mt-4 mb-8">
          {error.statusText || error.message || "We can't seem to find the page you're looking for."}
        </p>
        <Link to="/" className="btn btn-primary">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;