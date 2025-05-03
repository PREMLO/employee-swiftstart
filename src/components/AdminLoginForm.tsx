
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Mail } from 'lucide-react';

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    // For demo we'll use fixed admin credentials
    if (email === 'anitejmishra@gmail.com' && password === 'admin@123') {
      const success = await signIn(email, password);
      if (!success) {
        toast.error('Failed to log in. Please check your credentials.');
      }
    } else {
      toast.error('Invalid admin credentials');
    }
    
    setIsLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="admin-email">Admin Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="admin-email"
            type="email"
            placeholder="Enter admin email"
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <p className="text-sm text-muted-foreground">Use anitejmishra@gmail.com for testing</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="admin-password">Admin Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="admin-password"
            type="password"
            placeholder="Enter admin password"
            className="pl-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <p className="text-sm text-muted-foreground">Use admin@123 for testing</p>
      </div>
      
      <Button
        type="submit"
        className="w-full h-11"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login as Admin'}
      </Button>
    </form>
  );
};

export default AdminLoginForm;
