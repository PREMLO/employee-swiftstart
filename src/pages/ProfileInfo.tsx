
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const ProfileInfo = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Profile information saved successfully');
      navigate('/document-upload');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center pt-24 pb-16 px-4 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium">Personal Information</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Please provide your personal details for our records
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full glass-card p-8 space-y-6 scale-in-transition">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                <SelectTrigger id="gender" className="input-field">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
            <Textarea
              id="address"
              name="address"
              placeholder="1234 Main St, Apt 567"
              value={formData.address}
              onChange={handleChange}
              className="input-field min-h-[100px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
              <Input
                id="city"
                name="city"
                placeholder="New York"
                value={formData.city}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State/Province <span className="text-destructive">*</span></Label>
              <Input
                id="state"
                name="state"
                placeholder="NY"
                value={formData.state}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip/Postal Code <span className="text-destructive">*</span></Label>
              <Input
                id="zipCode"
                name="zipCode"
                placeholder="10001"
                value={formData.zipCode}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country <span className="text-destructive">*</span></Label>
              <Input
                id="country"
                name="country"
                placeholder="United States"
                value={formData.country}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Emergency Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  placeholder="Jane Doe"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  placeholder="+1 (555) 987-6543"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">Relationship</Label>
                <Input
                  id="emergencyContactRelation"
                  name="emergencyContactRelation"
                  placeholder="Spouse"
                  value={formData.emergencyContactRelation}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="w-full md:w-auto px-8 h-11 bg-primary hover:bg-primary/90 transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;
