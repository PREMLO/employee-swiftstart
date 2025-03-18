
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import DocumentUploader from '@/components/DocumentUploader';
import Navbar from '@/components/Navbar';

const DocumentUpload = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedDocs, setCompletedDocs] = useState<string[]>([]);
  
  const documents = [
    {
      id: 'profile',
      title: 'Profile Picture',
      description: 'Upload a professional headshot photo',
      allowedTypes: '.jpg,.jpeg,.png',
      required: true,
    },
    {
      id: 'class10',
      title: 'Class 10 Certificate',
      description: 'Upload your Class 10 certificate or marksheet',
      allowedTypes: '.pdf,.jpg,.jpeg,.png',
      required: true,
    },
    {
      id: 'class12',
      title: 'Class 12 Certificate',
      description: 'Upload your Class 12 certificate or marksheet',
      allowedTypes: '.pdf,.jpg,.jpeg,.png',
      required: true,
    },
    {
      id: 'degree',
      title: 'College Degree',
      description: 'Upload your college degree certificate',
      allowedTypes: '.pdf,.jpg,.jpeg,.png',
      required: true,
    },
    {
      id: 'resume',
      title: 'Resume/CV',
      description: 'Upload your latest resume or CV',
      allowedTypes: '.pdf,.docx',
      required: true,
    },
    {
      id: 'experience',
      title: 'Experience Certificates',
      description: 'Upload any experience or work certificates (if applicable)',
      allowedTypes: '.pdf,.jpg,.jpeg,.png',
      required: false,
    },
  ];
  
  // For the demo, we're simulating the upload completion
  // In a real application, this would be tracked based on actual file uploads
  const requiredDocs = documents.filter(doc => doc.required).map(doc => doc.id);
  
  // We're tracking it based on listener in DocumentUploader for demo
  const handleSubmit = () => {
    // In a real app, we would validate all required documents are uploaded
    // For the demo, let's simulate a success
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Documents submitted successfully');
      navigate('/application-status');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <div className="flex-1 flex flex-col pt-24 pb-16 px-4 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium">Document Upload</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Please upload the required documents to complete your application
          </p>
        </div>
        
        <div className="space-y-6 mb-8">
          {documents.map((doc) => (
            <div key={doc.id} className="scale-in-transition">
              <DocumentUploader
                type={doc.id as any}
                title={doc.title}
                description={`${doc.description}${doc.required ? ' (Required)' : ' (Optional)'}`}
                allowedTypes={doc.allowedTypes}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-auto pt-8 flex justify-end">
          <Button
            onClick={handleSubmit}
            className="w-full md:w-auto px-8 h-11 bg-primary hover:bg-primary/90 transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Documents'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
