
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import StatusTracker from '@/components/StatusTracker';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MessageSquare, FileText } from 'lucide-react';

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<'submitted' | 'under-review' | 'interview-scheduled' | 'pending-documents' | 'selected' | 'rejected'>('under-review');
  const [activeTab, setActiveTab] = useState('status');
  
  // For demo purposes, let's include some upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'HR Interview',
      date: 'June 15, 2023',
      time: '10:00 AM - 11:00 AM',
      location: 'Online (Zoom)',
      description: 'Initial interview with the HR team to discuss your application and experience.',
    },
    {
      id: 2,
      title: 'Technical Assessment',
      date: 'June 18, 2023',
      time: '2:00 PM - 4:00 PM',
      location: 'Online',
      description: 'Technical skills assessment related to your role. You will receive an email with details before the assessment.',
    },
  ];
  
  // For demo purposes, let's include some recent activities
  const recentActivities = [
    {
      id: 1,
      activity: 'Documents Verified',
      timestamp: 'June 10, 2023 • 2:34 PM',
      description: 'Your uploaded documents have been verified by the HR team.',
    },
    {
      id: 2,
      activity: 'Application Reviewed',
      timestamp: 'June 8, 2023 • 11:15 AM',
      description: 'Your application has been reviewed by the hiring manager.',
    },
    {
      id: 3,
      activity: 'Documents Uploaded',
      timestamp: 'June 5, 2023 • 4:20 PM',
      description: 'You have successfully uploaded all required documents.',
    },
    {
      id: 4,
      activity: 'Profile Created',
      timestamp: 'June 3, 2023 • 10:45 AM',
      description: 'Your employee profile has been created in our system.',
    },
  ];
  
  // For demo purposes, let's simulate a login to the user dashboard
  const goToDashboard = () => {
    navigate('/user-dashboard');
  };
  
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <div className="flex-1 flex flex-col pt-24 pb-16 px-4 max-w-5xl mx-auto w-full">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-500 rounded-full text-sm font-medium mb-3">
            Application ID: AP-2023-0342
          </div>
          <h1 className="text-3xl font-medium">Application Status</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Track the progress of your application and upcoming activities
          </p>
        </div>
        
        {currentStatus === 'selected' ? (
          <div className="text-center mb-8 animate-scale-in">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-green-500">Congratulations!</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Your application has been accepted. You can now access your employee dashboard.
            </p>
            <Button
              onClick={goToDashboard}
              className="mt-6 px-8 h-11 bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="status" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8 scale-in-transition">
              <TabsTrigger value="status">Application Status</TabsTrigger>
              <TabsTrigger value="events">Upcoming Events</TabsTrigger>
              <TabsTrigger value="activities">Recent Activities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="status" className="space-y-6">
              <Card className="scale-in-transition">
                <CardHeader>
                  <CardTitle>Application Progress</CardTitle>
                  <CardDescription>Current status of your application</CardDescription>
                </CardHeader>
                <CardContent>
                  <StatusTracker currentStatus={currentStatus} />
                </CardContent>
              </Card>
              
              {/* For demo purposes, let's add buttons to change status */}
              <div className="flex flex-wrap gap-2 justify-center mt-8">
                <Button variant="outline" onClick={() => setCurrentStatus('submitted')}>
                  Set: Submitted
                </Button>
                <Button variant="outline" onClick={() => setCurrentStatus('under-review')}>
                  Set: Under Review
                </Button>
                <Button variant="outline" onClick={() => setCurrentStatus('interview-scheduled')}>
                  Set: Interview Scheduled
                </Button>
                <Button variant="outline" onClick={() => setCurrentStatus('pending-documents')}>
                  Set: Pending Documents
                </Button>
                <Button variant="outline" onClick={() => setCurrentStatus('selected')}>
                  Set: Selected
                </Button>
                <Button variant="outline" onClick={() => setCurrentStatus('rejected')}>
                  Set: Rejected
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="space-y-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="scale-in-transition">
                  <CardHeader className="flex flex-row items-start space-y-0 space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>{event.date} • {event.time}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="mt-4 bg-muted/30 p-3 rounded-lg flex items-center justify-between">
                      <span className="text-sm font-medium">Location: {event.location}</span>
                      <Button variant="outline" size="sm">
                        Add to Calendar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {upcomingEvents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming events scheduled</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="activities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>Recent updates on your application</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentActivities.map((activity, index) => (
                      <div key={activity.id} className="relative scale-in-transition">
                        {/* Connector line */}
                        {index < recentActivities.length - 1 && (
                          <div className="absolute top-7 left-4 w-0.5 h-[calc(100%+24px)] -translate-x-1/2 bg-muted" />
                        )}
                        
                        <div className="flex items-start">
                          <div className="relative z-10 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-sm font-medium">{activity.activity}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                            <p className="text-sm mt-2">{activity.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        
        {currentStatus !== 'selected' && currentStatus !== 'rejected' && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Have questions about your application? Contact our HR team.
            </p>
            <Button variant="outline" className="h-11">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact HR
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;
