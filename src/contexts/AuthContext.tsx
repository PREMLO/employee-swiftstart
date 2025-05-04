import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Application = Database['public']['Tables']['applications']['Row'];

interface UserMetadata {
  firstName?: string;
  lastName?: string;
}

// Define user onboarding steps
export type OnboardingStep = 'agreement' | 'profile-info' | 'document-upload' | 'application-status' | 'completed';

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  application: Application | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<boolean>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  refreshApplication: () => Promise<void>;
  currentOnboardingStep: OnboardingStep;
  checkOnboardingStatus: () => Promise<OnboardingStep>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState<OnboardingStep>('agreement');
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        // Check if user is admin (either by email domain or specific hardcoded admin email)
        const isUserAdmin = session?.user?.email === 'anitejmishra@gmail.com' || 
                          (session?.user?.email?.endsWith('@admin.com') ?? false);
        setIsAdmin(isUserAdmin);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Check if user is admin (either by email domain or specific hardcoded admin email)
      const isUserAdmin = session?.user?.email === 'anitejmishra@gmail.com' || 
                        (session?.user?.email?.endsWith('@admin.com') ?? false);
      setIsAdmin(isUserAdmin);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile when user changes
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchApplication();
    } else {
      setProfile(null);
      setApplication(null);
    }
  }, [user]);

  // Check onboarding status when user, profile or application changes
  useEffect(() => {
    if (user) {
      checkOnboardingStatus().then(step => setCurrentOnboardingStep(step));
    }
  }, [user, profile, application]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      console.log('Fetching profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code !== 'PGRST116') throw error;
      }
      
      console.log('Fetched profile:', data);
      setProfile(data || null);
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const fetchApplication = async () => {
    if (!user) return;

    try {
      console.log('Fetching application for user:', user.id);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching application:', error);
        if (error.code !== 'PGRST116') throw error;
      }
      
      console.log('Fetched application:', data);
      setApplication(data || null);
    } catch (error: any) {
      console.error('Error fetching application:', error.message);
    }
  };

  const refreshApplication = async () => {
    await fetchApplication();
  };

  const checkOnboardingStatus = async (): Promise<OnboardingStep> => {
    if (!user || isAdmin) return 'completed';

    try {
      console.log('Checking onboarding status for user:', user.id);
      
      // Check if application is already completed (selected/rejected)
      if (application) {
        if (application.status === 'selected' || application.status === 'rejected') {
          return 'completed';
        }
      }
      
      // Check if user has accepted agreement
      const { data: agreements, error: agreementsError } = await supabase
        .from('agreements')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (agreementsError) {
        console.error('Error checking agreements:', agreementsError);
        if (agreementsError.code !== 'PGRST116') throw agreementsError;
      }

      console.log('Agreement data:', agreements);
      if (!agreements) {
        return 'agreement';
      }

      // Check if user has completed profile
      if (!profile || !profile.first_name || !profile.last_name || !profile.phone) {
        return 'profile-info';
      }

      // Check if user has uploaded required documents
      const { data: documents, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id);

      if (documentsError) {
        console.error('Error checking documents:', documentsError);
        throw documentsError;
      }

      console.log('Documents data:', documents);
      const requiredDocs = ['resume', 'class10', 'class12'];
      const uploadedDocTypes = documents?.map(doc => doc.document_type) || [];
      
      const missingDocs = requiredDocs.filter(docType => !uploadedDocTypes.includes(docType));
      
      if (missingDocs.length > 0) {
        return 'document-upload';
      }

      return 'application-status';
    } catch (error: any) {
      console.error('Error checking onboarding status:', error.message);
      return 'agreement';
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign in for:', email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      // Check if this is admin login
      const isUserAdmin = email === 'anitejmishra@gmail.com' || email.endsWith('@admin.com');
      
      if (isUserAdmin) {
        navigate('/admin-dashboard');
        toast.success('Admin logged in successfully');
        return true;
      }
      
      // For non-admin users, check onboarding status and redirect accordingly
      const nextStep = await checkOnboardingStatus();
      console.log('Next onboarding step:', nextStep);
      
      switch (nextStep) {
        case 'agreement':
          navigate('/agreement');
          break;
        case 'profile-info':
          navigate('/profile-info');
          break;
        case 'document-upload':
          navigate('/document-upload');
          break;
        case 'application-status':
          navigate('/application-status');
          break;
        case 'completed':
          navigate('/user-dashboard');
          break;
      }
      
      toast.success('Signed in successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      console.error('Sign in error:', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: UserMetadata) => {
    try {
      setLoading(true);
      console.log('Attempting sign up for:', email);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      // After signup, sign in automatically and redirect to agreement page
      await signIn(email, password);
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      console.error('Sign up error:', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      console.error('Sign out error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        application,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
        refreshProfile,
        refreshApplication,
        currentOnboardingStep,
        checkOnboardingStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
