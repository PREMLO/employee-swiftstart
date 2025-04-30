
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import DocumentUploader from '@/components/DocumentUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const DocumentUpload = () => {
  const navigate = useNavigate();
  const { user, refreshApplication } = useAuth();
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, boolean>>({
    resume: false,
    class10: false,
    class12: false,
    degree: false
  });
  const [loading, setLoading] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(true);
  
  // Fetch already uploaded documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return;
      
      try {
        setFetchingStatus(true);
        const { data, error } = await supabase
          .from('documents')
          .select('document_type')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Reset all to false first
        const uploadStatus = {
          resume: false,
          class10: false,
          class12: false,
          degree: false
        };
        
        // Mark uploaded documents as true
        if (data) {
          data.forEach(doc => {
            if (uploadStatus.hasOwnProperty(doc.document_type)) {
              uploadStatus[doc.document_type as keyof typeof uploadStatus] = true;
            }
          });
        }
        
        setUploadedDocuments(uploadStatus);
      } catch (error: any) {
        toast.error(error.message || 'Error fetching document status');
      } finally {
        setFetchingStatus(false);
      }
    };
    
    fetchDocuments();
  }, [user]);
  
  const handleUploadComplete = (type: string) => {
    setUploadedDocuments(prev => ({
      ...prev,
      [type]: true
    }));
  };
  
  const handleSubmit = async () => {
    const requiredDocuments = ['resume', 'class10', 'class12'];
    const missingDocuments = requiredDocuments.filter(doc => !uploadedDocuments[doc]);
    
    if (missingDocuments.length > 0) {
      toast.error(`Please upload all required documents: ${missingDocuments.join(', ')}`);
      return;
    }
    
    try {
      setLoading(true);
      
      if (!user) {
        toast.error('You must be logged in to continue');
        return;
      }
      
      const { error } = await supabase
        .from('applications')
        .update({
          status: 'under-review',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      await refreshApplication();
      toast.success('Documents uploaded successfully!');
      navigate('/application-status');
    } catch (error: any) {
      toast.error(error.message || 'Error updating application status');
    } finally {
      setLoading(false);
    }
  };
  
  if (fetchingStatus) {
    return (
      <div className="min-h-screen flex flex-col page-transition">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="scale-in-transition">
            <CardHeader>
              <CardTitle className="text-2xl">Document Upload</CardTitle>
              <CardDescription>
                Please upload the required documents to complete your onboarding process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Required Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DocumentUploader 
                    type="resume" 
                    title="Resume/CV" 
                    description="Upload your most recent resume or curriculum vitae"
                    allowedTypes=".pdf,.doc,.docx"
                    onUploadComplete={() => handleUploadComplete('resume')}
                  />
                  
                  <DocumentUploader 
                    type="class10" 
                    title="10th Class Certificate" 
                    description="Upload your 10th class marksheet or certificate"
                    allowedTypes=".pdf,.jpg,.jpeg,.png"
                    onUploadComplete={() => handleUploadComplete('class10')}
                  />
                  
                  <DocumentUploader 
                    type="class12" 
                    title="12th Class Certificate" 
                    description="Upload your 12th class marksheet or certificate"
                    allowedTypes=".pdf,.jpg,.jpeg,.png"
                    onUploadComplete={() => handleUploadComplete('class12')}
                  />
                  
                  <DocumentUploader 
                    type="degree" 
                    title="Degree Certificate" 
                    description="Upload your degree or diploma certificate (optional)"
                    allowedTypes=".pdf,.jpg,.jpeg,.png"
                    onUploadComplete={() => handleUploadComplete('degree')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/profile-info')}
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Documents'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
