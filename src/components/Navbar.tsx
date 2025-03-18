
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
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
          <NavLink to="/login" isActive={isActive('/login')}>Login</NavLink>
          <NavLink to="/admin-login" isActive={isActive('/admin-login')}>Admin</NavLink>
        </nav>
        
        <div className="md:hidden">
          {/* Mobile menu button would go here */}
        </div>
      </div>
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

export default Navbar;
