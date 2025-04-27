
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UploadCloud, File, CheckCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

type DocumentType = 'profile' | 'class10' | 'class12' | 'degree' | 'resume' | 'experience';

interface DocumentUploaderProps {
  type: DocumentType;
  title: string;
  description: string;
  allowedTypes?: string;
  onUploadComplete?: (filePath: string) => void;
}

const DocumentUploader = ({ 
  type, 
  title, 
  description, 
  allowedTypes = ".pdf,.jpg,.jpeg,.png",
  onUploadComplete
}: DocumentUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  
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
  };
  
  const uploadFile = async () => {
    if (!file || !user) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Generate a unique file path for the user
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${type}/${uuidv4()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('employee-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the file
      const { data } = supabase.storage
        .from('employee-documents')
        .getPublicUrl(filePath);
        
      // Save document reference to database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          document_type: type,
          file_path: filePath,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size
        });
      
      if (dbError) throw dbError;
      
      setUploadProgress(100);
      toast.success(`${title} uploaded successfully!`);
      
      if (onUploadComplete) {
        onUploadComplete(filePath);
      }
      
    } catch (error: any) {
      console.error('Upload error:', error.message);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
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
              {isUploading && (
                <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
            <div>
              {isUploading ? (
                <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              ) : uploadProgress === 100 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Button onClick={uploadFile} size="sm">Upload</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
