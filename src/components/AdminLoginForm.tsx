
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter valid credentials');
      return;
    }
    
    if (!email.endsWith('@admin.com')) {
      toast.error('Please use an admin email address (ending with @admin.com)');
      return;
    }
    
    await signIn(email, password);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full scale-in-transition">
      <div className="space-y-2">
        <Label htmlFor="email">Admin Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@admin.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
        <p className="text-xs text-muted-foreground">
          Admin email must end with @admin.com
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
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
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Admin Sign in'}
      </Button>
    </form>
  );
};

export default AdminLoginForm;
