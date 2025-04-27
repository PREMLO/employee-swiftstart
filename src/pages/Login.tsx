
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login = () => {
  const [activeTab, setActiveTab] = useState<string>('login');
  
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium">Welcome</h1>
            <p className="text-muted-foreground mt-2">
              Sign in or create an account to continue
            </p>
          </div>
          
          <div className="glass-card p-8">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
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
