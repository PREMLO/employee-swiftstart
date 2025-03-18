
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { ArrowRight, CheckCircle2, UserCheck, Clock, FileText } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 max-w-3xl mx-auto slide-in-up-transition">
            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium">
              Streamlined Employee Onboarding
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
              Simplify your <span className="text-primary">onboarding</span> process
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A seamless platform for new employees and HR administrators to manage the entire onboarding journey from document submission to task assignment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                onClick={() => navigate('/login')}
                className="h-12 px-8 bg-primary hover:bg-primary/90 transition-all duration-200"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={() => navigate('/admin-login')}
                variant="outline"
                className="h-12 px-8"
              >
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16 scale-in-transition">
            <h2 className="text-3xl font-medium">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform makes employee onboarding simple, efficient, and organized.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={FileText} 
              title="Document Management" 
              description="Upload and manage all required documents in one secure location with easy tracking and verification."
            />
            <FeatureCard 
              icon={Clock} 
              title="Progress Tracking" 
              description="Real-time updates on application status and onboarding progress for both employees and administrators."
            />
            <FeatureCard 
              icon={UserCheck} 
              title="Task Assignment" 
              description="Administrators can assign tasks to new employees and track completion status throughout the onboarding process."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto glass-card p-10 md:p-16 text-center space-y-6 scale-in-transition">
          <h2 className="text-3xl font-medium">Ready to transform your onboarding process?</h2>
          <p className="text-muted-foreground">
            Join thousands of companies using our platform to create a seamless experience for their new employees.
          </p>
          <Button 
            onClick={() => navigate('/login')}
            className="h-12 px-8 mt-4 bg-primary hover:bg-primary/90 transition-all duration-200"
          >
            Get Started Today
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-6 bg-muted/30 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-xl font-medium text-primary">Onboard</span>
            <span className="text-xl font-medium">Flow</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OnboardFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="glass-card p-8 text-center space-y-4 scale-in-transition">
    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-medium">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
