
import { cn } from '@/lib/utils';
import { Check, Clock, XCircle, AlertCircle, FileText, Calendar, ThumbsUp } from 'lucide-react';

type Status = 'submitted' | 'under-review' | 'interview-scheduled' | 'pending-documents' | 'selected' | 'rejected';

interface StatusTrackerProps {
  currentStatus: Status;
}

const StatusTracker = ({ currentStatus }: StatusTrackerProps) => {
  const statuses = [
    { 
      id: 'submitted', 
      name: 'Application Submitted', 
      description: 'Your application has been received',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    { 
      id: 'under-review', 
      name: 'Under Review', 
      description: 'HR team is reviewing your application',
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    { 
      id: 'interview-scheduled', 
      name: 'Interview Scheduled', 
      description: 'Prepare for your upcoming interview',
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    { 
      id: 'pending-documents', 
      name: 'Pending Documents', 
      description: 'Additional documents required',
      icon: AlertCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    { 
      id: 'selected', 
      name: 'Selected', 
      description: 'Congratulations! You've been selected',
      icon: ThumbsUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    { 
      id: 'rejected', 
      name: 'Not Selected', 
      description: 'Thank you for your interest',
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
  ];
  
  // Find current status index
  const currentIndex = statuses.findIndex(status => status.id === currentStatus);
  
  // Check if status is active
  const isActive = (index: number) => {
    // Special case for rejected status
    if (currentStatus === 'rejected') {
      return statuses[index].id === 'rejected';
    }
    
    return index <= currentIndex;
  };
  
  // Check if status is the current one
  const isCurrent = (id: string) => id === currentStatus;
  
  return (
    <div className="w-full scale-in-transition">
      <div className="space-y-8">
        {statuses.filter(status => 
          // Only show rejected if it's the current status, otherwise show all except rejected
          currentStatus === 'rejected' ? status.id === 'rejected' : status.id !== 'rejected'
        ).map((status, index, filteredArray) => (
          <div key={status.id} className="relative">
            {/* Connector line */}
            {index < filteredArray.length - 1 && (
              <div 
                className={cn(
                  "absolute top-7 left-4 w-0.5 h-[calc(100%+32px)] -translate-x-1/2 transition-colors duration-300",
                  isActive(index) && isActive(index + 1) ? "bg-primary" : "bg-muted"
                )} 
              />
            )}
            
            <div className="flex items-start group">
              {/* Status indicator */}
              <div 
                className={cn(
                  "relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-apple-easing",
                  isActive(index) 
                    ? isCurrent(status.id) 
                      ? status.bgColor
                      : "bg-primary"
                    : "bg-muted"
                )}
              >
                {isActive(index) ? (
                  isCurrent(status.id) ? (
                    <status.icon className={cn("w-4 h-4", status.color)} />
                  ) : (
                    <Check className="w-4 h-4 text-white" />
                  )
                ) : (
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
                )}
              </div>
              
              {/* Status content */}
              <div className="ml-4 pb-8">
                <h3 
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    isActive(index) 
                      ? isCurrent(status.id)
                        ? status.color
                        : "text-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  {status.name}
                </h3>
                <p 
                  className={cn(
                    "mt-1 text-xs transition-colors duration-200",
                    isActive(index) ? "text-muted-foreground" : "text-muted-foreground/60"
                  )}
                >
                  {status.description}
                </p>
                
                {isCurrent(status.id) && (
                  <div className="mt-3 text-xs inline-block px-2 py-1 rounded-full bg-background border">
                    Current Status
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusTracker;
