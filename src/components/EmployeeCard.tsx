
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, User } from 'lucide-react';

type EmployeeStatus = 'pending' | 'in-progress' | 'completed' | 'issue';

interface EmployeeCardProps {
  id: string;
  name: string;
  position: string;
  email: string;
  joinDate: string;
  status: EmployeeStatus;
  completedSteps: number;
  totalSteps: number;
}

const EmployeeCard = ({
  id,
  name,
  position,
  email,
  joinDate,
  status,
  completedSteps,
  totalSteps,
}: EmployeeCardProps) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  
  const statusIcons = {
    pending: Clock,
    'in-progress': Clock,
    completed: CheckCircle,
    issue: AlertCircle,
  };
  
  const statusColors = {
    pending: "text-amber-500 border-amber-200 bg-amber-50",
    'in-progress': "text-blue-500 border-blue-200 bg-blue-50",
    completed: "text-green-500 border-green-200 bg-green-50",
    issue: "text-red-500 border-red-200 bg-red-50",
  };
  
  const StatusIcon = statusIcons[status];
  const progressPercentage = (completedSteps / totalSteps) * 100;
  
  const viewDetails = () => {
    // In a real application, this would navigate to employee details
    navigate(`/admin-dashboard?employee=${id}`);
  };
  
  return (
    <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-apple-md">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">{position}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={statusColors[status]}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            <span className="capitalize">{status.replace('-', ' ')}</span>
          </Badge>
        </div>
        
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-muted-foreground">Onboarding Progress</span>
              <span className="font-medium">{completedSteps}/{totalSteps}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500 ease-apple-easing"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {expanded && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm break-all">{email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Join Date</p>
                  <p className="text-sm">{joinDate}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex border-t border-border">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 py-3 text-sm text-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          {expanded ? 'Show Less' : 'Show More'}
        </button>
        <div className="w-px bg-border"></div>
        <button
          onClick={viewDetails}
          className="flex-1 py-3 text-sm text-center text-primary hover:bg-primary/5 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
