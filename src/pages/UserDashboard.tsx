
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCard from '@/components/TaskCard';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { User, ChevronRight, FileText, Calendar, ClipboardCheck, BookOpen, Settings, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, profile, application } = useAuth();
  const navigate = useNavigate();
  
  // Task state
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  
  // Events state
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  
  // Resources state
  const [resources, setResources] = useState<any[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  
  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      try {
        setTasksLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('due_date', { ascending: true });
          
        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setTasksLoading(false);
      }
    };
    
    fetchTasks();
  }, [user]);
  
  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true })
          .limit(5);
          
        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setEventsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setResourcesLoading(true);
        const { data, error } = await supabase
          .from('resources')
          .select('*');
          
        if (error) throw error;
        setResources(data || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setResourcesLoading(false);
      }
    };
    
    fetchResources();
  }, []);
  
  // Calculate task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Prepare user data
  const userData = {
    name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Loading...',
    position: profile?.position || 'New Employee',
    department: profile?.department || 'Onboarding',
    joinDate: profile?.join_date ? new Date(profile.join_date).toLocaleDateString() : 'Pending',
    manager: 'HR Department',
    employeeId: profile?.employee_id || 'Not assigned yet',
    email: user?.email || '',
    phone: profile?.phone || 'Not provided',
  };
  
  // Default resources if none found
  const defaultResources = [
    {
      id: 'default-1',
      title: 'Employee Handbook',
      description: 'Company policies, benefits, and guidelines',
      type: 'Document',
      icon: FileText,
    },
    {
      id: 'default-2',
      title: 'Training Schedule',
      description: 'Upcoming training sessions for new employees',
      type: 'Calendar',
      icon: Calendar,
    },
    {
      id: 'default-3',
      title: 'Development Guidelines',
      description: 'Coding standards and best practices',
      type: 'Document',
      icon: BookOpen,
    },
  ];
  
  const displayResources = resources.length > 0 ? resources : defaultResources;
  
  const handleProfileSettings = () => {
    navigate('/profile-info');
  };
  
  const handleViewDocuments = () => {
    navigate('/document-upload');
  };
  
  const handleCheckStatus = () => {
    navigate('/application-status');
  };
  
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
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleCheckStatus}
              className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-full bg-secondary/70 hover:bg-secondary transition-colors"
            >
              <span>Application Status</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <button 
              onClick={handleProfileSettings}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors" 
              aria-label="Settings"
            >
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
                  {eventsLoading ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
                      <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
                      <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
                    </div>
                  ) : events.length > 0 ? (
                    <div className="space-y-4">
                      {events.slice(0, 3).map((event) => (
                        <div key={event.id} className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-medium">{event.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(event.date).toLocaleDateString()} • {event.time || 'All day'}
                            </div>
                          </div>
                          <span className="inline-block px-2 py-0.5 bg-muted text-xs rounded-full">
                            {event.type || 'Event'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">
                      <p>No upcoming events</p>
                      <p className="text-xs mt-1">Check back later for updates</p>
                    </div>
                  )}
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
                  
                  <div className="mt-4 pt-3 border-t">
                    <button 
                      onClick={handleProfileSettings}
                      className="text-sm text-primary flex items-center hover:underline"
                    >
                      Update Profile <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Documents Status */}
            <Card className="scale-in-transition">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Documents</CardTitle>
                  <CardDescription>Your submitted documents</CardDescription>
                </div>
                <button className="text-sm text-primary flex items-center" onClick={handleViewDocuments}>
                  Manage Documents <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg flex flex-col items-center text-center">
                    <FileText className="w-8 h-8 text-primary mb-2" />
                    <h4 className="font-medium">Resume/CV</h4>
                    <p className="text-xs text-muted-foreground mt-1">Required</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex flex-col items-center text-center">
                    <FileText className="w-8 h-8 text-primary mb-2" />
                    <h4 className="font-medium">10th Certificate</h4>
                    <p className="text-xs text-muted-foreground mt-1">Required</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex flex-col items-center text-center">
                    <FileText className="w-8 h-8 text-primary mb-2" />
                    <h4 className="font-medium">12th Certificate</h4>
                    <p className="text-xs text-muted-foreground mt-1">Required</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex flex-col items-center text-center">
                    <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                    <h4 className="font-medium">Degree</h4>
                    <p className="text-xs text-muted-foreground mt-1">Optional</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
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
                {tasksLoading ? (
                  <div className="space-y-4">
                    <div className="h-16 bg-muted/50 rounded animate-pulse"></div>
                    <div className="h-16 bg-muted/50 rounded animate-pulse"></div>
                    <div className="h-16 bg-muted/50 rounded animate-pulse"></div>
                  </div>
                ) : tasks.length > 0 ? (
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
                          <div className="text-xs text-muted-foreground mt-1">
                            Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <ClipboardCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No tasks assigned yet</p>
                    <p className="text-xs mt-1">Check back later</p>
                  </div>
                )}
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
                {tasksLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-48 bg-muted/50 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : tasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                      <TaskCard key={task.id} {...task} />
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center text-muted-foreground">
                    <ClipboardCheck className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">No tasks assigned yet</p>
                    <p className="text-sm mt-2">
                      Your onboarding tasks will appear here once assigned by HR
                    </p>
                  </div>
                )}
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
                  {displayResources.map((resource, index) => {
                    const IconComponent = resource.icon || FileText;
                    
                    return (
                      <div key={resource.id || index} className="group">
                        <div className="flex items-start p-4 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
                            <IconComponent className="w-5 h-5" />
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
                    );
                  })}
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
