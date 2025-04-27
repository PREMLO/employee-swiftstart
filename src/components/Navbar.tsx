
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const isActive = (path: string) => location.pathname === path;
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ease-apple-easing",
      scrolled ? "bg-white/80 backdrop-blur-lg shadow-apple-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-medium text-primary">Onboard</span>
          <span className="text-xl font-medium">Flow</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" isActive={isActive('/')}>Home</NavLink>
          
          {!user ? (
            <>
              <NavLink to="/login" isActive={isActive('/login')}>Login</NavLink>
              {/* Only show Admin Login if not logged in */}
              <NavLink to="/admin-login" isActive={isActive('/admin-login')}>Admin</NavLink>
            </>
          ) : (
            <>
              <NavLink to={isAdmin ? '/admin-dashboard' : '/user-dashboard'} 
                isActive={isActive(isAdmin ? '/admin-dashboard' : '/user-dashboard')}>
                Dashboard
              </NavLink>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={signOut}
                className="flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </>
          )}
        </nav>
        
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="p-2 text-muted-foreground"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md mt-4 py-4 px-6 shadow-apple-sm rounded-lg">
          <nav className="flex flex-col space-y-4">
            <MobileNavLink to="/" isActive={isActive('/')} onClick={() => setMenuOpen(false)}>
              Home
            </MobileNavLink>
            
            {!user ? (
              <>
                <MobileNavLink to="/login" isActive={isActive('/login')} onClick={() => setMenuOpen(false)}>
                  Login
                </MobileNavLink>
                <MobileNavLink to="/admin-login" isActive={isActive('/admin-login')} onClick={() => setMenuOpen(false)}>
                  Admin
                </MobileNavLink>
              </>
            ) : (
              <>
                <MobileNavLink 
                  to={isAdmin ? '/admin-dashboard' : '/user-dashboard'} 
                  isActive={isActive(isAdmin ? '/admin-dashboard' : '/user-dashboard')}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </MobileNavLink>
                
                <button 
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 py-2 px-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, isActive, children }: NavLinkProps) => (
  <Link 
    to={to} 
    className={cn(
      "relative py-2 text-sm transition-colors duration-200",
      isActive 
        ? "text-primary font-medium" 
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    {children}
    <span className={cn(
      "absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 transition-transform duration-200 ease-apple-easing",
      isActive && "scale-x-100"
    )}></span>
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink = ({ to, isActive, children, onClick }: MobileNavLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "py-2 px-1 text-sm transition-colors duration-200",
      isActive 
        ? "text-primary font-medium" 
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    {children}
  </Link>
);

export default Navbar;
