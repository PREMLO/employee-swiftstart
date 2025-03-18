
import { Link } from 'react-router-dom';
import AdminLoginForm from '@/components/AdminLoginForm';
import Navbar from '@/components/Navbar';

const AdminLogin = () => {
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium">Admin Portal</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to access the administrator dashboard
            </p>
          </div>
          
          <div className="glass-card p-8">
            <AdminLoginForm />
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Need admin access? </span>
              <Link to="#" className="text-primary hover:text-primary/80 font-medium">
                Contact IT support
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              to="/login" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in as employee
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
