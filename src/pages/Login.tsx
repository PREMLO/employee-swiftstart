
import { Link } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import Navbar from '@/components/Navbar';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to continue your onboarding process
            </p>
          </div>
          
          <div className="glass-card p-8">
            <LoginForm />
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="#" className="text-primary hover:text-primary/80 font-medium">
                Contact your HR
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              to="/admin-login" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in as administrator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
