import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Shield, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Agreement = () => {
  const [accepted, setAccepted] = useState({
    terms: false,
    privacy: false,
    confidentiality: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, checkOnboardingStatus } = useAuth();
  
  const allAccepted = Object.values(accepted).every(Boolean);
  
  const handleSubmit = async () => {
    if (!allAccepted) {
      toast.error('Please accept all agreements to continue');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to continue');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Record agreement acceptance in the database
      const { error } = await supabase
        .from('agreements')
        .insert({
          user_id: user.id,
          agreed_at: new Date().toISOString(),
          agreement_version: '1.0'
        });

      if (error) throw error;
      
      toast.success('Agreements accepted successfully');
      
      // Update onboarding status in auth context before navigating
      await checkOnboardingStatus();
      
      // Navigate after a short delay to ensure state updates
      setTimeout(() => {
        navigate('/profile-info');
      }, 100);
    } catch (error: any) {
      console.error('Error saving agreement:', error);
      toast.error('Failed to save your agreement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center px-4 py-16 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8 mt-10">
          <h1 className="text-3xl font-medium">Agreements & Policies</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Please review and accept the following agreements before proceeding with the onboarding process
          </p>
        </div>
        
        <div className="w-full space-y-6">
          <AgreementCard 
            title="Terms of Employment"
            description="Standard terms and conditions of your employment"
            icon={FileText}
            accepted={accepted.terms}
            onAccept={() => setAccepted({ ...accepted, terms: !accepted.terms })}
            content={termsContent}
          />
          
          <AgreementCard 
            title="Privacy Policy"
            description="How we handle and protect your personal information"
            icon={Shield}
            accepted={accepted.privacy}
            onAccept={() => setAccepted({ ...accepted, privacy: !accepted.privacy })}
            content={privacyContent}
          />
          
          <AgreementCard 
            title="Confidentiality Agreement"
            description="Regarding company information and intellectual property"
            icon={Lock}
            accepted={accepted.confidentiality}
            onAccept={() => setAccepted({ ...accepted, confidentiality: !accepted.confidentiality })}
            content={confidentialityContent}
          />
        </div>
        
        <div className="mt-8 flex flex-col items-center">
          <Button
            onClick={handleSubmit}
            disabled={!allAccepted || isSubmitting}
            className="w-full max-w-md h-12 bg-primary hover:bg-primary/90 transition-all duration-200"
          >
            {isSubmitting ? 'Processing...' : 'Accept & Continue'}
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4 text-center max-w-md">
            By clicking "Accept & Continue", you agree to abide by all the terms and conditions outlined in the documents above.
          </p>
        </div>
      </div>
    </div>
  );
};

interface AgreementCardProps {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  accepted: boolean;
  onAccept: () => void;
  content: string;
}

const AgreementCard = ({
  title,
  description,
  icon: Icon,
  accepted,
  onAccept,
  content,
}: AgreementCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="glass-card overflow-hidden scale-in-transition">
      <div className="p-6">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-muted-foreground text-sm mt-1">{description}</p>
          </div>
        </div>
        
        {expanded && (
          <ScrollArea className="h-64 mt-4 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
            <div className="whitespace-pre-line">{content}</div>
          </ScrollArea>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {expanded ? 'Hide details' : 'View details'}
          </button>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`accept-${title}`} 
              checked={accepted} 
              onCheckedChange={onAccept}
            />
            <label 
              htmlFor={`accept-${title}`}
              className="text-sm font-medium cursor-pointer"
            >
              I accept
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample agreement content
const termsContent = `TERMS OF EMPLOYMENT

1. EMPLOYMENT
   1.1. Your employment with the Company will commence on the start date specified in your offer letter.
   1.2. Your employment is subject to a probationary period of three months from the commencement date.

2. JOB TITLE AND DUTIES
   2.1. Your job title is specified in your offer letter.
   2.2. You are expected to perform all duties reasonably associated with your position.
   2.3. The Company reserves the right to amend your duties from time to time according to business needs.

3. PLACE OF WORK
   3.1. Your primary place of work is the Company's office as specified in your offer letter.
   3.2. The Company may require you to work at different locations temporarily or permanently.

4. HOURS OF WORK
   4.1. Standard working hours are 40 hours per week, Monday to Friday.
   4.2. You may be required to work additional hours when necessary to fulfill your duties.

5. SALARY AND BENEFITS
   5.1. Your salary is specified in your offer letter and will be paid monthly in arrears.
   5.2. The Company offers benefits as outlined in the Employee Handbook.
   5.3. Salary reviews will be conducted annually but do not guarantee an increase.

6. HOLIDAYS AND LEAVE
   6.1. You are entitled to paid annual leave as specified in your offer letter.
   6.2. The Company's holiday year runs from January to December.
   6.3. All holidays must be approved in advance by your manager.

7. SICKNESS ABSENCE
   7.1. If you are unable to attend work due to illness, you must notify your manager as soon as possible.
   7.2. For absences of seven calendar days or less, you must complete a self-certification form.
   7.3. For absences exceeding seven calendar days, you must provide a medical certificate.

8. TERMINATION OF EMPLOYMENT
   8.1. The notice period required from either party to terminate employment is specified in your offer letter.
   8.2. The Company reserves the right to pay salary in lieu of notice.
   8.3. The Company may terminate employment without notice in cases of gross misconduct.

9. CONFIDENTIALITY
   9.1. You must not disclose any confidential information relating to the Company during or after your employment.
   9.2. All documents, materials, and information created or acquired during your employment remain Company property.

10. GOVERNING LAW
    10.1. This agreement is governed by and construed in accordance with the laws of [jurisdiction].
    10.2. Any disputes arising from this agreement shall be subject to the exclusive jurisdiction of the courts of [jurisdiction].`;

const privacyContent = `PRIVACY POLICY

1. INFORMATION WE COLLECT
   1.1. Personal Information: Name, address, phone number, email, date of birth, social security number, and other identification information.
   1.2. Employment Information: Resume, employment history, education, qualifications, references, and performance evaluations.
   1.3. Financial Information: Bank account details, tax information, salary, and benefits information.
   1.4. Technical Information: Login credentials, IP address, device information when accessing company systems.

2. HOW WE USE YOUR INFORMATION
   2.1. To manage the employment relationship including payroll, benefits, and performance management.
   2.2. To comply with legal obligations such as tax reporting, workplace safety, and equal opportunity monitoring.
   2.3. To protect company interests and assets, including network security and fraud prevention.
   2.4. To communicate important information about company policies, benefits, and events.

3. INFORMATION SHARING
   3.1. Internal Departments: HR, Finance, IT, and Management as necessary for business operations.
   3.2. Third-Party Service Providers: Payroll processors, benefits providers, and IT service providers.
   3.3. Legal Requirements: Government agencies, law enforcement, and courts when legally required.
   3.4. We do not sell your personal information to third parties.

4. DATA SECURITY
   4.1. We implement appropriate technical and organizational measures to protect your information.
   4.2. Access to personal information is restricted to authorized personnel only.
   4.3. We maintain data retention policies and securely dispose of information when no longer needed.

5. YOUR RIGHTS
   5.1. You have the right to access personal information we hold about you.
   5.2. You may request correction of inaccurate information.
   5.3. You may request deletion of information when legally permissible.
   5.4. You may submit complaints regarding the handling of your information.

6. DATA RETENTION
   6.1. We retain your information for as long as necessary for the purposes outlined in this policy.
   6.2. Employment records are typically retained for the duration of employment plus a defined period afterward.
   6.3. Certain information may be retained longer to comply with legal obligations.

7. CHANGES TO THIS POLICY
   7.1. We may update this policy periodically to reflect changes in our practices or legal requirements.
   7.2. Significant changes will be communicated to you directly.
   7.3. The current version of this policy will always be available through the company intranet.

8. CONTACT INFORMATION
   8.1. Questions or concerns about this policy should be directed to the HR department.
   8.2. Data protection-related inquiries can be sent to [privacy@company.com].`;

const confidentialityContent = `CONFIDENTIALITY AGREEMENT

1. DEFINITION OF CONFIDENTIAL INFORMATION
   1.1. "Confidential Information" means all non-public information disclosed by the Company that is designated as confidential or would reasonably be understood to be confidential.
   1.2. This includes but is not limited to: trade secrets, business plans, financial information, customer lists, product designs, software code, marketing strategies, employee information, and intellectual property.
   1.3. Confidential Information may be in written, electronic, or verbal form.

2. OBLIGATIONS OF CONFIDENTIALITY
   2.1. You agree to keep all Confidential Information in strict confidence.
   2.2. You will not disclose Confidential Information to any third party without prior written consent from the Company.
   2.3. You will use Confidential Information solely for the purpose of performing your job duties.
   2.4. You will take reasonable measures to protect the confidentiality of the information.

3. EXCLUSIONS
   3.1. This agreement does not apply to information that:
   3.2. Was in your possession prior to receiving it from the Company.
   3.3. Is or becomes publicly available through no fault of your own.
   3.4. Is rightfully obtained from a third party without restriction on disclosure.
   3.5. Is required to be disclosed by law, provided you give the Company reasonable notice.

4. RETURN OF MATERIALS
   4.1. Upon termination of employment or at the Company's request, you will promptly return all documents and materials containing Confidential Information.
   4.2. You will not retain any copies, summaries, or extracts of Confidential Information.
   4.3. You will delete any Confidential Information stored on personal devices or accounts.

5. INTELLECTUAL PROPERTY
   5.1. All intellectual property created during your employment belongs exclusively to the Company.
   5.2. You assign to the Company all rights, title, and interest in any intellectual property created within the scope of your employment.
   5.3. You will assist the Company in obtaining and enforcing intellectual property rights.

6. DURATION
   6.1. Your confidentiality obligations remain in effect during your employment and continue after termination.
   6.2. Certain types of Confidential Information, such as trade secrets, remain confidential indefinitely.

7. REMEDIES
   7.1. You acknowledge that monetary damages may not be sufficient remedy for breach of this agreement.
   7.2. The Company may seek injunctive relief in addition to any other remedies available by law.
   7.3. You will be responsible for any damages resulting from unauthorized disclosure.

8. GENERAL PROVISIONS
   8.1. This agreement constitutes the entire understanding regarding confidentiality.
   8.2. Any modifications must be in writing and signed by both parties.
   8.3. This agreement is governed by the laws of [jurisdiction].`;

export default Agreement;
