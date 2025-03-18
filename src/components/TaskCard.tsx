
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

type TaskPriority = 'low' | 'medium' | 'high';
type TaskStatus = 'pending' | 'in-progress' | 'completed';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedBy: string;
}

const TaskCard = ({
  id,
  title,
  description,
  dueDate,
  priority,
  status,
  assignedBy,
}: TaskCardProps) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  
  const statusIcons = {
    pending: Clock,
    'in-progress': AlertCircle,
    completed: CheckCircle2,
  };
  
  const statusColors = {
    pending: "text-amber-500 bg-amber-50",
    'in-progress': "text-blue-500 bg-blue-50",
    completed: "text-green-500 bg-green-50",
  };
  
  const priorityColors = {
    low: "text-green-500 bg-green-50",
    medium: "text-amber-500 bg-amber-50",
    high: "text-red-500 bg-red-50",
  };
  
  const StatusIcon = statusIcons[currentStatus];
  
  const markAsComplete = () => {
    setCurrentStatus('completed');
  };
  
  return (
    <div className="glass-card p-5 overflow-hidden transition-all duration-300 hover:shadow-apple-md">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full",
          statusColors[currentStatus]
        )}>
          <StatusIcon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Due Date</p>
          <p className="text-sm">{dueDate}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Priority</p>
          <div className="flex items-center space-x-1">
            <span className={cn(
              "inline-block w-2 h-2 rounded-full",
              priority === 'high' ? "bg-red-500" :
              priority === 'medium' ? "bg-amber-500" : "bg-green-500"
            )}></span>
            <span className="text-sm capitalize">{priority}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-1">
        <p className="text-xs text-muted-foreground">Assigned by</p>
        <p className="text-sm">{assignedBy}</p>
      </div>
      
      {currentStatus !== 'completed' && (
        <button
          onClick={markAsComplete}
          className="mt-4 w-full py-2 text-sm text-center rounded-lg border border-primary/20 text-primary hover:bg-primary/5 transition-colors"
        >
          Mark as Complete
        </button>
      )}
    </div>
  );
};

export default TaskCard;
