
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EmployeeCard from '@/components/EmployeeCard';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Search, Filter, ChevronDown, BarChart3, Users, ClipboardCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  joinDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'issue';
  completedSteps: number;
  totalSteps: number;
}

interface ApplicationUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  position: string | null;
  application_status: string;
  document_count: number;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [applications, setApplications] = useState<ApplicationUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    fetchApplicationsAndUsers();
  }, [user]);

  const fetchApplicationsAndUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all applications with their related profiles
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          user_id,
          status,
          profiles:profiles(id, first_name, last_name, position, email, join_date)
        `);
      
      if (error) throw error;
      
      // Count documents for each user
      const employeesList: Employee[] = [];
      const applicationsList: ApplicationUser[] = [];
      
      for (const app of data || []) {
        // Count user documents
        const { data: docs, error: docsError } = await supabase
          .from('documents')
          .select('*', { count: 'exact' })
          .eq('user_id', app.user_id);
          
        if (docsError) throw docsError;
        
        const docCount = docs?.length || 0;
        
        // Get user email
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(app.user_id);
        
        if (authError) {
          console.error('Error fetching user details:', authError);
          continue;
        }
        
        const profile = app.profiles;
        const email = authUser?.user?.email || 'No email';
        const name = profile?.first_name && profile?.last_name 
          ? `${profile.first_name} ${profile.last_name}`
          : email;
          
        const position = profile?.position || 'Applicant';
        const joinDate = profile?.join_date ? new Date(profile.join_date).toLocaleDateString() : 'N/A';
        
        // Calculate status
        let status: 'pending' | 'in-progress' | 'completed' | 'issue' = 'pending';
        let completedSteps = 0;
        
        // Check if they have accepted agreement
        const { data: agreement } = await supabase
          .from('agreements')
          .select('*')
          .eq('user_id', app.user_id)
          .single();
          
        if (agreement) completedSteps++;
        
        // Check if profile is complete
        if (profile?.first_name && profile?.last_name && profile?.phone) completedSteps++;
        
        // Check document uploads
        if (docCount >= 3) completedSteps++;
        
        // Set status based on application state and completed steps
        if (app.status === 'selected') {
          status = 'completed';
          completedSteps = 6;
        } else if (app.status === 'rejected') {
          status = 'issue';
        } else if (app.status === 'under-review' || app.status === 'interview-scheduled') {
          status = 'in-progress';
        }
        
        // Add to employees list
        employeesList.push({
          id: app.user_id,
          name,
          position,
          email,
          joinDate,
          status,
          completedSteps,
          totalSteps: 6
        });
        
        // Add to applications list
        applicationsList.push({
          id: app.user_id,
          email,
          first_name: profile?.first_name || null,
          last_name: profile?.last_name || null,
          position: profile?.position || null,
          application_status: app.status,
          document_count: docCount
        });
      }
      
      setEmployees(employeesList);
      setApplications(applicationsList);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications data');
    } finally {
      setLoading(false);
    }
  };

  // Process application
  const processApplication = async (userId: string, status: 'selected' | 'rejected' | 'under-review' | 'interview-scheduled' | 'pending-documents') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
        
      if (error) throw error;
      
      toast.success(`Application ${status === 'selected' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'} successfully`);
      fetchApplicationsAndUsers();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application status');
    }
  };
  
  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate statistics
  const totalEmployees = employees.length;
  const completedOnboarding = employees.filter(e => e.status === 'completed').length;
  const inProgressOnboarding = employees.filter(e => e.status === 'in-progress').length;
  const pendingOnboarding = employees.filter(e => e.status === 'pending').length;
  const issuesCount = employees.filter(e => e.status === 'issue').length;
  
  // Calculate completion percentage
  const overallCompletionSteps = employees.reduce((acc, curr) => acc + curr.completedSteps, 0);
  const totalSteps = employees.reduce((acc, curr) => acc + curr.totalSteps, 0);
  const overallCompletionPercentage = totalSteps > 0 ? Math.round((overallCompletionSteps / totalSteps) * 100) : 0;
  
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <div className="flex-1 flex flex-col pt-24 pb-16 px-4 max-w-7xl mx-auto w-full">
        {/* Admin header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-medium">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage and monitor employee onboarding progress</p>
          </div>
          
          <Button 
            className="h-10 bg-primary hover:bg-primary/90 transition-all duration-200"
            onClick={() => fetchApplicationsAndUsers()}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="scale-in-transition">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-3xl font-medium mt-1">{totalEmployees}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-1">Overall onboarding progress</p>
                <div className="flex justify-between items-center mb-1">
                  <Progress value={overallCompletionPercentage} className="h-1.5" />
                  <span className="text-xs font-medium ml-2">{overallCompletionPercentage}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="scale-in-transition">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-3xl font-medium mt-1">{inProgressOnboarding}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-blue-500">
                  {totalEmployees ? Math.round((inProgressOnboarding / totalEmployees) * 100) : 0}% of employees
                </p>
                <p className="text-xs text-muted-foreground mt-1">Currently in onboarding process</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="scale-in-transition">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-medium mt-1">{completedOnboarding}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-green-500">
                  {totalEmployees ? Math.round((completedOnboarding / totalEmployees) * 100) : 0}% of employees
                </p>
                <p className="text-xs text-muted-foreground mt-1">Successfully completed onboarding</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="scale-in-transition">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Issues</p>
                  <p className="text-3xl font-medium mt-1">{issuesCount}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-red-500">
                  {totalEmployees ? Math.round((issuesCount / totalEmployees) * 100) : 0}% of employees
                </p>
                <p className="text-xs text-muted-foreground mt-1">Have issues with onboarding</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <Tabs defaultValue="employees" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-8 max-w-md mx-auto scale-in-transition">
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees" className="space-y-6">
            <Card className="scale-in-transition">
              <CardHeader>
                <CardTitle>Employee Onboarding Status</CardTitle>
                <CardDescription>Track and manage employee progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      className="pl-10 input-field"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                ) : filteredEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEmployees.map((employee) => (
                      <EmployeeCard key={employee.id} {...employee} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No employees found matching your search</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-6">
            <Card className="scale-in-transition">
              <CardHeader>
                <CardTitle>Application Management</CardTitle>
                <CardDescription>Review and process new applications</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                ) : applications.length > 0 ? (
                  <div className="space-y-6">
                    {applications.map((application) => (
                      <Card key={application.id} className="relative">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="space-y-2 mb-4 md:mb-0">
                              <h3 className="text-lg font-medium">
                                {application.first_name && application.last_name 
                                  ? `${application.first_name} ${application.last_name}`
                                  : application.email}
                              </h3>
                              <p className="text-sm text-muted-foreground">{application.position || 'No position specified'}</p>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                  {application.document_count} documents
                                </span>
                                <span className={cn("text-xs px-2 py-1 rounded-full", {
                                  'bg-blue-50 text-blue-500': application.application_status === 'submitted',
                                  'bg-amber-50 text-amber-500': application.application_status === 'under-review',
                                  'bg-purple-50 text-purple-500': application.application_status === 'interview-scheduled',
                                  'bg-orange-50 text-orange-500': application.application_status === 'pending-documents',
                                  'bg-green-50 text-green-500': application.application_status === 'selected',
                                  'bg-red-50 text-red-500': application.application_status === 'rejected',
                                })}>
                                  {application.application_status.replace(/-/g, ' ')}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline" 
                                onClick={() => processApplication(application.id, 'under-review')}
                              >
                                Mark as Reviewing
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => processApplication(application.id, 'interview-scheduled')}
                              >
                                Schedule Interview
                              </Button>
                              <Button 
                                size="sm"
                                variant="destructive" 
                                onClick={() => processApplication(application.id, 'rejected')}
                              >
                                Reject
                              </Button>
                              <Button 
                                size="sm"
                                variant="default" 
                                onClick={() => processApplication(application.id, 'selected')}
                              >
                                Approve
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No applications found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
