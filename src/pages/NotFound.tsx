
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-card p-10 text-center max-w-md w-full scale-in-transition">
        <h1 className="text-6xl font-medium text-primary mb-4">404</h1>
        <p className="text-xl text-foreground mb-6">Oops! Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => navigate('/')} 
          className="px-8 h-11 bg-primary hover:bg-primary/90 transition-all duration-200"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
