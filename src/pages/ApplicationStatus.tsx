
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import StatusTracker from '@/components/StatusTracker';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MessageSquare, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const { application, user, refreshApplication } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<'submitted' | 'under-review' | 'interview-scheduled' | 'pending-documents' | 'selected' | 'rejected'>('under-review');
  const [activeTab, setActiveTab] = useState('status');
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (application) {
      setCurrentStatus(application.status as any);
    }
    
    fetchActivitiesAndEvents();
  }, [application, user]);
  
  const fetchActivitiesAndEvents = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Fetch documents to create activities
      const { data: documents, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });
        
      if (documentsError) throw documentsError;
      
      // Create activities from documents
      const docActivities = documents?.map(doc => ({
        id: doc.id,
        activity: `Document Uploaded: ${doc.document_type}`,
        timestamp: new Date(doc.uploaded_at).toLocaleString(),
        description: `You have uploaded your ${doc.document_type} document.`,
      })) || [];
      
      // Create profile update activity if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('updated_at')
        .eq('id', user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      const activities = [...docActivities];
      
      if (profile) {
        activities.push({
          id: 'profile-update',
          activity: 'Profile Information Updated',
          timestamp: new Date(profile.updated_at).toLocaleString(),
          description: 'You have updated your profile information.',
        });
      }
      
      // Get agreements
      const { data: agreements, error: agreementsError } = await supabase
        .from('agreements')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (agreementsError && agreementsError.code !== 'PGRST116') {
        throw agreementsError;
      }
      
      if (agreements) {
        activities.push({
          id: 'agreements',
          activity: 'Agreements Accepted',
          timestamp: new Date(agreements.agreed_at).toLocaleString(),
          description: 'You have accepted the required agreements and policies.',
        });
      }
      
      // Sort activities by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setRecentActivities(activities);
      
      // Fetch upcoming events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });
        
      if (eventsError) throw eventsError;
      
      setUpcomingEvents(events || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };
  
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
            {user && `Application ID: ${user.id.substring(0, 8).toUpperCase()}`}
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
                  
                  {currentStatus === 'submitted' && (
                    <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-800 text-sm">
                        Your application has been submitted and is pending review. Please upload the required documents to proceed.
                      </p>
                    </div>
                  )}
                  
                  {currentStatus === 'under-review' && (
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        Your application is currently being reviewed by our team. We will update you on the next steps soon.
                      </p>
                    </div>
                  )}
                  
                  {currentStatus === 'interview-scheduled' && (
                    <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-purple-800 text-sm">
                        Congratulations! Your application has moved to the interview stage. Check the Upcoming Events tab for interview details.
                      </p>
                    </div>
                  )}
                  
                  {currentStatus === 'pending-documents' && (
                    <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-orange-800 text-sm">
                        We need additional documents to proceed with your application. Please check your email for details.
                      </p>
                    </div>
                  )}
                  
                  {currentStatus === 'rejected' && (
                    <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">
                        Unfortunately, we are unable to proceed with your application at this time. Thank you for your interest.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="events" className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <Card key={event.id} className="scale-in-transition">
                    <CardHeader className="flex flex-row items-start space-y-0 space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription>{new Date(event.date).toLocaleDateString()} • {event.time || 'To be decided'}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{event.description || 'No additional details provided.'}</p>
                      <div className="mt-4 bg-muted/30 p-3 rounded-lg flex items-center justify-between">
                        <span className="text-sm font-medium">Location: {event.location || 'To be announced'}</span>
                        <Button variant="outline" size="sm">
                          Add to Calendar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming events scheduled</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Check back later for updates on your application process
                  </p>
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
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    </div>
                  ) : recentActivities.length > 0 ? (
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
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">No activities recorded yet</p>
                    </div>
                  )}
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
