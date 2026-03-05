import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Download, Save, CreditCard, Loader2, FileText, Check, Star, Zap, LayoutTemplate, FileCheck, Award, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Modal from '../../components/Modal';
import { resumeTemplates } from '../../data/resumeTemplates';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [isBuilding, setIsBuilding] = useState(false); // State to toggle between Landing and Builder
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'phone' | 'processing' | 'success'>('select');
  
  const [resumeData, setResumeData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: ''
  });

  const handleTemplateSelect = (templateId: string) => {
    const template = resumeTemplates.find(t => t.id === templateId);
    if (template) {
      if (confirm('This will overwrite your current content. Continue?')) {
        setResumeData(prev => ({
          ...prev,
          summary: template.summary,
          experience: template.experience,
          skills: template.skills,
          education: template.education || prev.education
        }));
        setShowTemplates(false);
      }
    }
  };

  const handleEnhance = async () => {
    setEnhancing(true);
    try {
      // Combine relevant fields for context
      const context = `
        Summary: ${resumeData.summary}
        Experience: ${resumeData.experience}
        Skills: ${resumeData.skills}
      `;
      
      const response = await axios.post('/api/resume/enhance', { resumeText: context });
      const enhanced = response.data;

      setResumeData(prev => ({
        ...prev,
        summary: enhanced.summary || prev.summary,
        // If the AI returns arrays, we join them for the text area, or keep as is if string
        skills: Array.isArray(enhanced.skills) ? enhanced.skills.join(', ') : (enhanced.skills || prev.skills),
        // Simple append for demo purposes if complex structure returned
        experience: Array.isArray(enhanced.experience) ? enhanced.experience.map((e: any) => `${e.role} at ${e.company}: ${e.description}`).join('\n\n') : (enhanced.experience || prev.experience)
      }));
    } catch (error) {
      console.error('Enhancement failed', error);
      alert('Failed to enhance resume. Please try again.');
    } finally {
      setEnhancing(false);
    }
  };

  const handlePayment = async (amount: number) => {
    setPaymentStep('processing');
    try {
      await axios.post('/api/payment/initiate', { amount, phoneNumber: '0780000000' });
      setPaymentStep('success');
    } catch (error) {
      alert('Payment failed');
      setPaymentStep('select');
    }
  };

  // --- Landing Page Components ---

  const HeroSection = () => (
    <div className="bg-navy-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
          Build a Standout Resume <br />
          <span className="text-gold-500">Effortlessly with AI</span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Don’t waste precious time staring at a blank page. In just three straightforward steps, you’ll have the perfect resume – polished, compelling, and ready to submit.
        </p>
        <button 
          onClick={() => setIsBuilding(true)}
          className="bg-gold-500 text-navy-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gold-400 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
        >
          Create my resume <ArrowRight className="ml-2 h-5 w-5" />
        </button>
        <div className="mt-12 flex justify-center space-x-8 text-sm text-gray-400">
          <div className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-400" /> No credit card required</div>
          <div className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-400" /> ATS-friendly templates</div>
          <div className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-400" /> Download in PDF</div>
        </div>
      </div>
    </div>
  );

  const StepsSection = () => (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">3 simple steps to a resume that lands you a job</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: LayoutTemplate, 
              title: "Pick your template", 
              desc: "Select from a wide range of layouts that check all the boxes. Each designed to make you stand out from the crowd." 
            },
            { 
              icon: FileText, 
              title: "Add your information", 
              desc: "Can’t find the right words? We’ll walk you through every step and suggest pre-written content based on your role." 
            },
            { 
              icon: Download, 
              title: "Download your resume", 
              desc: "Time to impress. Get your resume in PDF format with a simple click. Then watch the interview invites roll in." 
            }
          ].map((step, i) => (
            <div key={i} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-6 text-navy-900">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FeaturesSection = () => (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Everything you need in one resume maker</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: Sparkles,
              title: "Fill in the blanks with personalized writing assistance from AI.",
              desc: "If the words aren’t coming to you, you can rely on our AI Assistant to do the crafting for you. Based on your input, we’ll provide strong phrases and content suggestions."
            },
            {
              icon: Award,
              title: "Achieve perfection with an AI resume score.",
              desc: "To take your resume from good to great, AI will assess its content and relevance. See how your resume compares to others for the same role and refine every detail."
            },
            {
              icon: FileCheck,
              title: "Create flawless text with automated proofreading.",
              desc: "Even the smallest spelling mistake can hurt your application. Our AI expert will carefully proofread all your content and make sure your resume is as error free as can be."
            },
            {
              icon: Zap,
              title: "Get your resume seen by hiring managers with ATS-friendly templates.",
              desc: "Don’t let companies’ screening tools take you out of the running. Our templates are formatted to meet the requirements of Applicant Tracking Systems (ATS)."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center text-gold-600">
                  <feature.icon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const faqs = [
      { q: "What is the difference between a resume and a CV?", a: "A resume is typically a one-to-two page document highlighting your skills and experience, while a CV (Curriculum Vitae) is a more detailed document charting your career journey." },
      { q: "How can I make my resume stand out?", a: "Use our AI-powered enhancement tools to add strong action verbs, quantify your achievements, and ensure your resume is tailored to the job description." },
      { q: "Are the templates ATS-friendly?", a: "Yes! All our templates are designed to be easily readable by Applicant Tracking Systems used by most employers." }
    ];

    return (
      <div className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy-900 mb-12 text-center">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-bold text-navy-900">{faq.q}</span>
                  {openIndex === i ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                </button>
                {openIndex === i && (
                  <div className="p-6 bg-gray-50 border-t border-gray-200 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const BottomCTA = () => (
    <div className="bg-navy-900 py-20 text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">75% of resumes get ignored. <br /><span className="text-gold-500">Build one that won’t.</span></h2>
        <button 
          onClick={() => setIsBuilding(true)}
          className="bg-gold-500 text-navy-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gold-400 transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
        >
          Create my resume <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );

  if (!isBuilding) {
    return (
      <Layout>
        <HeroSection />
        <StepsSection />
        <FeaturesSection />
        <FAQSection />
        <BottomCTA />
      </Layout>
    );
  }

  // --- Builder Interface (Existing Code) ---

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button onClick={() => setIsBuilding(false)} className="text-sm text-gray-500 hover:text-navy-900 mb-2 flex items-center">
              &larr; Back to Home
            </button>
            <h1 className="text-3xl font-serif font-bold text-navy-900">AI Resume Builder</h1>
            <p className="text-gray-600">Create a professional hospitality resume in minutes.</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowTemplates(true)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-navy-900 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </button>
            <button 
              onClick={handleEnhance}
              disabled={enhancing}
              className="flex items-center px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 transition-colors disabled:opacity-50"
            >
              {enhancing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2 text-gold-500" />}
              Enhance with AI
            </button>
            <button 
              onClick={() => setShowPayment(true)}
              className="flex items-center px-4 py-2 bg-gold-500 text-navy-900 font-bold rounded-lg hover:bg-gold-400 transition-colors shadow-md"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <h2 className="text-xl font-bold text-navy-900 border-b pb-2">Personal Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={resumeData.fullName}
                  onChange={e => setResumeData({...resumeData, fullName: e.target.value})}
                  className="w-full p-2 border rounded-md focus:ring-gold-500 focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="text" 
                  value={resumeData.phone}
                  onChange={e => setResumeData({...resumeData, phone: e.target.value})}
                  className="w-full p-2 border rounded-md focus:ring-gold-500 focus:border-gold-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={resumeData.email}
                  onChange={e => setResumeData({...resumeData, email: e.target.value})}
                  className="w-full p-2 border rounded-md focus:ring-gold-500 focus:border-gold-500"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-navy-900 border-b pb-2 pt-4">Professional Profile</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
              <textarea 
                rows={4}
                value={resumeData.summary}
                onChange={e => setResumeData({...resumeData, summary: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-gold-500 focus:border-gold-500"
                placeholder="Briefly describe your experience and goals..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <textarea 
                rows={6}
                value={resumeData.experience}
                onChange={e => setResumeData({...resumeData, experience: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-gold-500 focus:border-gold-500"
                placeholder="List your work history..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <textarea 
                rows={3}
                value={resumeData.skills}
                onChange={e => setResumeData({...resumeData, skills: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-gold-500 focus:border-gold-500"
                placeholder="e.g., Customer Service, POS Systems, Housekeeping..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <textarea 
                rows={3}
                value={resumeData.education}
                onChange={e => setResumeData({...resumeData, education: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-gold-500 focus:border-gold-500"
                placeholder="List your education..."
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 p-8 rounded-xl shadow-inner border border-gray-200 min-h-[800px]">
            <div className="bg-white shadow-xl p-8 min-h-full" id="resume-preview">
              <div className="text-center border-b-2 border-navy-900 pb-6 mb-6">
                <h1 className="text-3xl font-bold text-navy-900 uppercase tracking-widest">{resumeData.fullName}</h1>
                <div className="flex justify-center space-x-4 text-sm text-gray-600 mt-2">
                  <span>{resumeData.email}</span>
                  <span>|</span>
                  <span>{resumeData.phone}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-navy-900 uppercase border-b border-gold-500 mb-3 inline-block">Professional Summary</h3>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{resumeData.summary}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-navy-900 uppercase border-b border-gold-500 mb-3 inline-block">Experience</h3>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{resumeData.experience}</div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-navy-900 uppercase border-b border-gold-500 mb-3 inline-block">Education</h3>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{resumeData.education}</div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-navy-900 uppercase border-b border-gold-500 mb-3 inline-block">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.split(',').map((skill, i) => (
                    skill.trim() && (
                      <span key={i} className="bg-navy-50 text-navy-900 px-3 py-1 rounded-full text-xs font-semibold">
                        {skill.trim()}
                      </span>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      <Modal isOpen={showTemplates} onClose={() => setShowTemplates(false)} title="Select a Template">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumeTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className="text-left p-4 border rounded-xl hover:border-gold-500 hover:bg-gray-50 transition-all group"
            >
              <h4 className="font-bold text-navy-900 group-hover:text-gold-600">{template.title}</h4>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{template.department}</span>
                <span className="bg-navy-100 text-navy-800 px-2 py-0.5 rounded-full">{template.level}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2 line-clamp-2">{template.summary}</p>
            </button>
          ))}
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} title="Download Resume">
        {paymentStep === 'select' && (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">Select a package to download your professional resume.</p>
            
            <button 
              onClick={() => setPaymentStep('phone')}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-gold-500 hover:bg-gold-50 transition-all text-left flex justify-between items-center group"
            >
              <div>
                <h4 className="font-bold text-navy-900">Standard Package</h4>
                <p className="text-sm text-gray-500">Resume without photo</p>
              </div>
              <span className="text-lg font-bold text-gold-600 group-hover:text-gold-700">2,500 RWF</span>
            </button>

            <button 
              onClick={() => setPaymentStep('phone')}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-gold-500 hover:bg-gold-50 transition-all text-left flex justify-between items-center group"
            >
              <div>
                <h4 className="font-bold text-navy-900">Premium Package</h4>
                <p className="text-sm text-gray-500">Resume with photo + Priority Support</p>
              </div>
              <span className="text-lg font-bold text-gold-600 group-hover:text-gold-700">5,000 RWF</span>
            </button>
          </div>
        )}

        {paymentStep === 'phone' && (
          <div className="space-y-4">
            <p className="text-gray-600">Enter your MTN Mobile Money number to pay.</p>
            <div className="flex items-center border rounded-md p-2">
              <span className="text-gray-500 mr-2 font-medium">+250</span>
              <input type="tel" placeholder="788 000 000" className="flex-1 outline-none" />
            </div>
            <button 
              onClick={() => handlePayment(2500)}
              className="w-full bg-gold-500 text-navy-900 font-bold py-3 rounded-lg hover:bg-gold-400 transition-colors"
            >
              Pay Now
            </button>
            <button onClick={() => setPaymentStep('select')} className="w-full text-gray-500 text-sm hover:text-navy-900">Back</button>
          </div>
        )}

        {paymentStep === 'processing' && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 text-gold-500 animate-spin mx-auto mb-4" />
            <h4 className="text-lg font-bold text-navy-900">Processing Payment...</h4>
            <p className="text-gray-500">Please check your phone to confirm the transaction.</p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-lg font-bold text-navy-900">Payment Successful!</h4>
            <p className="text-gray-500 mb-6">Your resume is ready for download.</p>
            <button 
              onClick={() => {
                setShowPayment(false);
                setPaymentStep('select');
                alert('Downloading PDF...'); // In real app, trigger PDF generation
              }}
              className="w-full bg-navy-900 text-white font-bold py-3 rounded-lg hover:bg-navy-800 transition-colors"
            >
              Download PDF
            </button>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

// Helper for success icon
const CheckCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default ResumeBuilder;
