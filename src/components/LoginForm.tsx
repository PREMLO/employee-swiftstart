
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Simple validation
      if (email && password) {
        toast.success('Login successful');
        navigate('/agreement');
      } else {
        toast.error('Please enter valid credentials');
      }
    }, 1500);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full scale-in-transition">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors">
            Forgot password?
          </button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
      </div>
      
      <Button
        type="submit"
        className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};

export default LoginForm;
