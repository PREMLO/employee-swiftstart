
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EmployeeCard from '@/components/EmployeeCard';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Search, Filter, ChevronDown, BarChart3, Users, ClipboardCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for employees
  const employees = [
    {
      id: 'e1',
      name: 'Alex Johnson',
      position: 'Software Developer',
      email: 'alex.johnson@example.com',
      joinDate: 'June 10, 2023',
      status: 'in-progress' as const,
      completedSteps: 3,
      totalSteps: 6,
    },
    {
      id: 'e2',
      name: 'Jessica Williams',
      position: 'UI/UX Designer',
      email: 'jessica.williams@example.com',
      joinDate: 'June 8, 2023',
      status: 'completed' as const,
      completedSteps: 6,
      totalSteps: 6,
    },
    {
      id: 'e3',
      name: 'Michael Brown',
      position: 'Product Manager',
      email: 'michael.brown@example.com',
      joinDate: 'June 15, 2023',
      status: 'pending' as const,
      completedSteps: 1,
      totalSteps: 6,
    },
    {
      id: 'e4',
      name: 'Emily Davis',
      position: 'Marketing Specialist',
      email: 'emily.davis@example.com',
      joinDate: 'June 12, 2023',
      status: 'issue' as const,
      completedSteps: 2,
      totalSteps: 6,
    },
    {
      id: 'e5',
      name: 'Robert Wilson',
      position: 'Data Analyst',
      email: 'robert.wilson@example.com',
      joinDate: 'June 5, 2023',
      status: 'in-progress' as const,
      completedSteps: 4,
      totalSteps: 6,
    },
    {
      id: 'e6',
      name: 'Sophia Martinez',
      position: 'Customer Support',
      email: 'sophia.martinez@example.com',
      joinDate: 'June 7, 2023',
      status: 'in-progress' as const,
      completedSteps: 5,
      totalSteps: 6,
    },
  ];
  
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
  const overallCompletionPercentage = Math.round((overallCompletionSteps / totalSteps) * 100);
  
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
          
          <Button className="h-10 bg-primary hover:bg-primary/90 transition-all duration-200">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Employee
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
                  {Math.round((inProgressOnboarding / totalEmployees) * 100)}% of employees
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
                  {Math.round((completedOnboarding / totalEmployees) * 100)}% of employees
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
                  {Math.round((issuesCount / totalEmployees) * 100)}% of employees
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
            <TabsTrigger value="reports">Reports</TabsTrigger>
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
                
                {filteredEmployees.length > 0 ? (
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
          
          <TabsContent value="reports" className="space-y-6">
            <Card className="scale-in-transition">
              <CardHeader>
                <CardTitle>Onboarding Analytics</CardTitle>
                <CardDescription>Insights and statistics about the onboarding process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Overall Completion Rate</h3>
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-medium">{overallCompletionPercentage}%</span>
                        </div>
                        <Progress value={overallCompletionPercentage} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <div className="text-center">
                          <p className="text-2xl font-medium text-primary">{totalEmployees}</p>
                          <p className="text-xs text-muted-foreground mt-1">Total Employees</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-medium text-blue-500">{inProgressOnboarding}</p>
                          <p className="text-xs text-muted-foreground mt-1">In Progress</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-medium text-green-500">{completedOnboarding}</p>
                          <p className="text-xs text-muted-foreground mt-1">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-medium text-red-500">{issuesCount}</p>
                          <p className="text-xs text-muted-foreground mt-1">Issues</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Average Completion Time</h3>
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <div className="text-center">
                        <p className="text-3xl font-medium">7.5 days</p>
                        <p className="text-sm text-muted-foreground mt-2">Average time to complete onboarding</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                        <div className="p-4 bg-white rounded-lg shadow-apple-sm">
                          <p className="text-lg font-medium">5.2 days</p>
                          <p className="text-xs text-muted-foreground mt-1">Development Team</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-apple-sm">
                          <p className="text-lg font-medium">8.7 days</p>
                          <p className="text-xs text-muted-foreground mt-1">Design Team</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-apple-sm">
                          <p className="text-lg font-medium">9.3 days</p>
                          <p className="text-xs text-muted-foreground mt-1">Marketing Team</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <Button variant="outline" className="h-10">
                      Generate Full Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
