import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileText, Clock, CheckCircle } from 'lucide-react';
import TaskCard from '@/components/TaskCard';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

type TaskPriority = 'low' | 'medium' | 'high';
type TaskStatus = 'pending' | 'in-progress' | 'completed';

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: TaskPriority;
  status: TaskStatus;
}

const UserDashboard = () => {
  const [greeting, setGreeting] = useState('Good day');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };
    
    setGreeting(getTimeBasedGreeting());
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch user tasks
      const { data: userTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });
        
      if (tasksError) throw tasksError;
      
      // Transform task data to ensure proper types
      const typedTasks = (userTasks || []).map(task => ({
        ...task,
        priority: (task.priority as TaskPriority) || 'medium',
        status: (task.status as TaskStatus) || 'pending'
      }));
      
      setTasks(typedTasks);
      
      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (resourcesError) throw resourcesError;
      setResources(resourcesData || []);
      
      // Fetch upcoming events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(3);
        
      if (eventsError) throw eventsError;
      setEvents(eventsData || []);
    } catch (error) {
      console.error('Error fetching user dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Default resources
  const defaultResources = [
    {
      id: 'res1',
      title: 'Employee Handbook',
      description: 'A comprehensive guide to company policies and procedures',
      type: 'document',
      url: '#',
    },
    {
      id: 'res2',
      title: 'Benefits Overview',
      description: 'Learn about your health, retirement, and other benefits',
      type: 'document',
      url: '#',
    },
    {
      id: 'res3',
      title: 'IT Setup Guide',
      description: 'Step-by-step instructions for setting up your workstation',
      type: 'guide',
      url: '#',
    },
  ];

  const displayResources = resources.length > 0 ? resources : defaultResources;

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email ? user.email[0].toUpperCase() : '?';
  };

  const generateRandomAvatarUrl = () => {
    const styles = ['adventurer', 'adventurer-neutral', 'avataaars', 'big-smile', 'bottts', 'croodles', 'fun-emoji'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${user?.id || 'default'}`;
  };

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16 px-4 max-w-7xl mx-auto w-full">
        {/* Dashboard header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-medium">{greeting}, {profile?.first_name || user?.email?.split('@')[0] || 'User'}</h1>
            <p className="text-muted-foreground">Welcome to your employee dashboard</p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <Avatar className="h-10 w-10 border border-muted">
              <AvatarImage src={generateRandomAvatarUrl()} alt="Avatar" />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {profile?.first_name && profile?.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">{profile?.position || 'Employee'}</p>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="scale-in-transition">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-3xl font-medium mt-1">{totalTasks}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="w-5 h-5 text-foreground/70" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="scale-in-transition">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-medium mt-1">{completedTasks}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>{completionRate}% completion rate</span>
                </div>
                <Progress className="h-1" value={completionRate} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="scale-in-transition">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-medium mt-1">{pendingTasks}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="scale-in-transition">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-3xl font-medium mt-1">{inProgressTasks}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="events">Calendar</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="space-y-6">
            <Card className="scale-in-transition">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>My Tasks</CardTitle>
                    <CardDescription>Manage your current tasks and assignments</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                ) : tasks.length > 0 ? (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        dueDate={task.due_date}
                        priority={task.priority}
                        status={task.status}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No tasks yet</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                      You don't have any tasks assigned at the moment. Check back later or contact your manager.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-6">
            <Card className="scale-in-transition">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Your schedule for the coming days</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                ) : events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div 
                        key={event.id}
                        className="border rounded-lg p-4 hover:border-primary transition-colors"
                      >
                        <div className="flex items-start">
                          <div className={cn(
                            "w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0",
                            event.type === 'meeting' ? 'bg-blue-50 text-blue-500' :
                            event.type === 'training' ? 'bg-amber-50 text-amber-500' :
                            'bg-green-50 text-green-500'
                          )}>
                            <Calendar className="w-6 h-6" />
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(event.date).toLocaleDateString()} • {event.time || 'All day'}
                            </p>
                            {event.description && (
                              <p className="text-sm mt-2">{event.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No upcoming events</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                      You don't have any scheduled events at the moment. Check back later for updates.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-6">
            <Card className="scale-in-transition">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Resources</CardTitle>
                    <CardDescription>Helpful documents and information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayResources.map((resource) => (
                    <Link 
                      key={resource.id}
                      to={resource.url || "#"}
                      className="block"
                    >
                      <div className="border rounded-lg p-4 h-full hover:border-primary hover:shadow-sm transition-all">
                        <div className="flex items-start h-full flex-col">
                          <div className={cn(
                            "w-10 h-10 rounded-md flex items-center justify-center",
                            resource.type === 'document' ? 'bg-blue-50 text-blue-500' :
                            resource.type === 'video' ? 'bg-red-50 text-red-500' :
                            resource.type === 'guide' ? 'bg-amber-50 text-amber-500' :
                            'bg-green-50 text-green-500'
                          )}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="mt-3 flex-1 flex flex-col">
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1 flex-1">{resource.description}</p>
                            <div className="mt-4">
                              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                {resource.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
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
