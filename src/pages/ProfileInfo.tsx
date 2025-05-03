
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProfileInfoForm from '@/components/ProfileInfoForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ProfileInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is authenticated when component mounts
  useEffect(() => {
    if (!user) {
      toast.error('You must be logged in to access this page');
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="scale-in-transition">
            <CardHeader>
              <CardTitle className="text-2xl">Profile Information</CardTitle>
              <CardDescription>
                Please provide your personal details to proceed with the onboarding process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileInfoForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
