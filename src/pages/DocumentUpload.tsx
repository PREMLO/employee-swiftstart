
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import DocumentUploader from '@/components/DocumentUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const DocumentUpload = () => {
  const navigate = useNavigate();
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, boolean>>({
    resume: false,
    class10: false,
    class12: false,
    degree: false
  });
  const [loading, setLoading] = useState(false);
  
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
      
      const { error } = await supabase
        .from('applications')
        .update({
          status: 'under-review',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
        
      if (error) throw error;
      
      toast.success('Documents uploaded successfully!');
      navigate('/application-status');
    } catch (error: any) {
      toast.error(error.message || 'Error updating application status');
    } finally {
      setLoading(false);
    }
  };
  
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
