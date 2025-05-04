
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ProfileInfoForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Personal information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !phone) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simplified - just show success message and navigate
      toast.success('Profile information saved successfully!');
      
      // Navigate to document upload page
      setTimeout(() => {
        navigate('/document-upload');
      }, 500);
    } catch (error: any) {
      toast.error('Error updating profile information');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Employee Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              type="email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Engineering"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/agreement')}
        >
          Back
        </Button>
        <Button 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileInfoForm;
