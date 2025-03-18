
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCard from '@/components/TaskCard';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { User, ChevronRight, FileText, Calendar, ClipboardCheck, BookOpen, Settings, Bell } from 'lucide-react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for tasks
  const tasks = [
    {
      id: 't1',
      title: 'Complete Company Orientation',
      description: 'Review the company handbook and complete the orientation questionnaire',
      dueDate: 'June 20, 2023',
      priority: 'high' as const,
      status: 'in-progress' as const,
      assignedBy: 'HR Department',
    },
    {
      id: 't2',
      title: 'Setup Development Environment',
      description: 'Install and configure all required software for your development work',
      dueDate: 'June 18, 2023',
      priority: 'medium' as const,
      status: 'pending' as const,
      assignedBy: 'IT Department',
    },
    {
      id: 't3',
      title: 'Complete Benefits Enrollment',
      description: 'Select your health insurance plan and other benefits options',
      dueDate: 'June 25, 2023',
      priority: 'high' as const,
      status: 'pending' as const,
      assignedBy: 'HR Department',
    },
    {
      id: 't4',
      title: 'Initial Team Meeting',
      description: 'Attend the introductory meeting with your team members',
      dueDate: 'June 15, 2023',
      priority: 'medium' as const,
      status: 'completed' as const,
      assignedBy: 'Team Lead',
    },
  ];
  
  // Mock data for user
  const userData = {
    name: 'Alex Johnson',
    position: 'Software Developer',
    department: 'Engineering',
    joinDate: 'June 10, 2023',
    manager: 'Sarah Williams',
    employeeId: 'EMP-2023-056',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
  };
  
  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 'e1',
      title: 'Team Weekly Standup',
      date: 'June 15, 2023',
      time: '10:00 AM',
      type: 'Meeting',
    },
    {
      id: 'e2',
      title: 'Project Kickoff',
      date: 'June 17, 2023',
      time: '2:00 PM',
      type: 'Meeting',
    },
    {
      id: 'e3',
      title: 'Company All-Hands',
      date: 'June 20, 2023',
      time: '11:00 AM',
      type: 'Event',
    },
  ];
  
  // Mock data for resources
  const resources = [
    {
      id: 'r1',
      title: 'Employee Handbook',
      description: 'Company policies, benefits, and guidelines',
      type: 'Document',
      icon: FileText,
    },
    {
      id: 'r2',
      title: 'Training Schedule',
      description: 'Upcoming training sessions for new employees',
      type: 'Calendar',
      icon: Calendar,
    },
    {
      id: 'r3',
      title: 'Development Guidelines',
      description: 'Coding standards and best practices',
      type: 'Document',
      icon: BookOpen,
    },
  ];
  
  // Calculate task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);
  
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <div className="flex-1 flex flex-col pt-24 pb-16 px-4 max-w-7xl mx-auto w-full">
        {/* User welcome section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl md:text-3xl font-medium">Welcome, {userData.name}</h1>
              <p className="text-muted-foreground">{userData.position} • {userData.department}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-muted/50 transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted/50 transition-colors" aria-label="Settings">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8 max-w-md mx-auto scale-in-transition">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="scale-in-transition">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Task Completion</CardTitle>
                  <CardDescription>Your onboarding progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{completionPercentage}% Complete</span>
                      <span className="text-sm text-muted-foreground">{completedTasks}/{totalTasks} Tasks</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                    
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-xl font-medium">{completedTasks}</div>
                        <div className="text-xs text-muted-foreground mt-1">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-medium">{inProgressTasks}</div>
                        <div className="text-xs text-muted-foreground mt-1">In Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-medium">{pendingTasks}</div>
                        <div className="text-xs text-muted-foreground mt-1">Pending</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="scale-in-transition">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  <CardDescription>Your scheduled meetings and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium">{event.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {event.date} • {event.time}
                          </div>
                        </div>
                        <span className="inline-block px-2 py-0.5 bg-muted text-xs rounded-full">
                          {event.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="scale-in-transition">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Your Information</CardTitle>
                  <CardDescription>Employee details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-muted-foreground">Employee ID</div>
                      <div className="font-medium">{userData.employeeId}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-muted-foreground">Join Date</div>
                      <div className="font-medium">{userData.joinDate}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-muted-foreground">Manager</div>
                      <div className="font-medium">{userData.manager}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-muted-foreground">Email</div>
                      <div className="font-medium truncate">{userData.email}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Tasks */}
            <Card className="scale-in-transition">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Tasks</CardTitle>
                  <CardDescription>Your assigned onboarding tasks</CardDescription>
                </div>
                <button className="text-sm text-primary flex items-center" onClick={() => setActiveTab('tasks')}>
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-start p-3 hover:bg-muted/30 rounded-lg transition-colors">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
                        <ClipboardCheck className="w-4 h-4" />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-start justify-between">
                          <div className="text-sm font-medium">{task.title}</div>
                          <span 
                            className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                              task.status === 'completed' ? 'bg-green-50 text-green-500' :
                              task.status === 'in-progress' ? 'bg-blue-50 text-blue-500' :
                              'bg-amber-50 text-amber-500'
                            }`}
                          >
                            {task.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Due: {task.dueDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-6">
            <Card className="scale-in-transition">
              <CardHeader>
                <CardTitle>Assigned Tasks</CardTitle>
                <CardDescription>Tasks that need to be completed as part of your onboarding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} {...task} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-6">
            <Card className="scale-in-transition">
              <CardHeader>
                <CardTitle>Resources & Documentation</CardTitle>
                <CardDescription>Helpful resources for new employees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {resources.map((resource) => (
                    <div key={resource.id} className="group">
                      <div className="flex items-start p-4 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
                          <resource.icon className="w-5 h-5" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-base font-medium group-hover:text-primary transition-colors">
                            {resource.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {resource.description}
                          </p>
                        </div>
                        <div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
