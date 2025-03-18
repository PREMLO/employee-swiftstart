
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UploadCloud, File, CheckCircle, X } from 'lucide-react';

type DocumentType = 'profile' | 'class10' | 'class12' | 'degree' | 'resume' | 'experience';

interface DocumentUploaderProps {
  type: DocumentType;
  title: string;
  description: string;
  allowedTypes?: string;
}

const DocumentUploader = ({ type, title, description, allowedTypes = ".pdf,.jpg,.jpeg,.png" }: DocumentUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (selectedFile: File) => {
    // Validate file type
    const fileType = selectedFile.type;
    const validTypes = allowedTypes.split(',').map(type => type.replace('.', 'image/').replace('pdf', 'application/pdf'));
    
    if (!validTypes.some(type => fileType.includes(type.split('/')[1]))) {
      toast.error(`Invalid file type. Please upload ${allowedTypes} files.`);
      return;
    }
    
    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }
    
    setFile(selectedFile);
    
    // Simulating upload
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success(`${title} uploaded successfully!`);
    }, 1500);
  };
  
  const removeFile = () => {
    setFile(null);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="scale-in-transition">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={allowedTypes}
        onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
      />
      
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <UploadCloud className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium">{title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{description}</p>
            </div>
            <Button 
              type="button" 
              onClick={triggerFileInput}
              variant="outline"
              className="mt-4"
            >
              Browse files
            </Button>
            <p className="text-xs text-muted-foreground">
              Drag & drop or click to browse. Max size: 5MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-6 relative">
          <button 
            type="button" 
            onClick={removeFile}
            className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Remove file"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="bg-muted rounded-lg p-3">
              <File className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(file.size / 1024).toFixed(0)} KB • {file.type.split('/')[1].toUpperCase()}
              </p>
            </div>
            <div>
              {isUploading ? (
                <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
