import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Download, Save, CreditCard, Loader2, FileText } from 'lucide-react';
import axios from 'axios';
import Modal from '../../components/Modal';
import { resumeTemplates } from '../../data/resumeTemplates';

const ResumeBuilder = () => {
  const { user } = useAuth();
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

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
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
