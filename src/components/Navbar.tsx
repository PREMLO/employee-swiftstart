
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  
  return (
    <header 
      className={cn(
        "w-full fixed top-0 left-0 z-50 transition-all duration-300",
        isHomePage ? "py-6" : "py-4 bg-background/80 backdrop-blur-md shadow-sm"
      )}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          OnboardWiz
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          {user ? (
            <>
              {isAdmin ? (
                <Link 
                  to="/admin-dashboard" 
                  className="px-4 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  to="/user-dashboard" 
                  className="px-4 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  Dashboard
                </Link>
              )}
              
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="ml-2"
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-md hover:bg-muted transition-colors"
              >
                Login
              </Link>
              
              <Link 
                to="/admin-login" 
                className="px-4 py-2 rounded-md hover:bg-muted transition-colors"
              >
                Admin
              </Link>
            </>
          )}
        </nav>
        
        <div className="flex md:hidden">
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
            >
              Log out
            </Button>
          ) : (
            <Link 
              to="/login" 
              className="px-3 py-1.5 text-sm bg-primary/10 rounded-md text-primary"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
