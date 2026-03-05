import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, Users, Briefcase, TrendingUp, Edit, Trash2, Eye, X, FileText, Upload, Filter } from 'lucide-react';
import Modal from '../../components/Modal';
import axios from 'axios';
import { resumeTemplates } from '../../data/resumeTemplates';

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  created_at: string;
  applicant_count: number;
  status: 'Active' | 'Closed';
}

interface Applicant {
  id: number;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostJob, setShowPostJob] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingApplicants, setViewingApplicants] = useState<number | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  
  // New State for Templates
  const [activeTab, setActiveTab] = useState<'jobs' | 'templates'>('jobs');
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState('All');
  const [templateLevel, setTemplateLevel] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewingTemplate, setViewingTemplate] = useState<any | null>(null);
  const [previewLayout, setPreviewLayout] = useState<'classic' | 'modern'>('classic');
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  
  // Job Search State
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('All');

  const [uploadForm, setUploadForm] = useState({
    title: '',
    department: 'Food & Beverage',
    level: 'Entry Level',
    summary: '',
    experience: '',
    skills: '',
    education: ''
  });

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: ''
  });

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/employer/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (jobId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
    try {
      await axios.patch(`/api/jobs/${jobId}/status`, { status: newStatus });
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: newStatus as 'Active' | 'Closed' } : j));
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update job status');
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await axios.put(`/api/jobs/${editingJob.id}`, jobForm);
        alert('Job updated successfully!');
      } else {
        await axios.post('/api/jobs', jobForm);
        alert('Job posted successfully!');
      }
      setShowPostJob(false);
      setEditingJob(null);
      setJobForm({ title: '', description: '', requirements: '', location: '', salary: '' });
      fetchJobs();
    } catch (error) {
      alert('Failed to save job');
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`/api/jobs/${id}`);
      setJobs(jobs.filter(j => j.id !== id));
    } catch (error) {
      alert('Failed to delete job');
    }
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      salary: job.salary
    });
    setShowPostJob(true);
  };

  const openPostModal = () => {
    setEditingJob(null);
    setJobForm({ title: '', description: '', requirements: '', location: '', salary: '' });
    setShowPostJob(true);
  };

  const handleViewApplicants = async (jobId: number) => {
    setViewingApplicants(jobId);
    try {
      const response = await axios.get(`/api/jobs/${jobId}/applicants`);
      setApplicants(response.data);
    } catch (error) {
      console.error('Failed to fetch applicants', error);
      setApplicants([]);
    }
  };

  const handleUploadTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const newTemplate = {
      id: `custom-${Date.now()}`,
      ...uploadForm,
      isCustom: true
    };
    setCustomTemplates([...customTemplates, newTemplate]);
    alert('Template uploaded successfully!');
    setShowUploadModal(false);
    setUploadForm({
      title: '',
      department: 'Food & Beverage',
      level: 'Entry Level',
      summary: '',
      experience: '',
      skills: '',
      education: ''
    });
  };

  const handleUseTemplate = () => {
    alert(`Template "${viewingTemplate.title}" selected! In a real app, this would start a job posting with this template attached or download it.`);
    setViewingTemplate(null);
  };

  // Filter templates
  const allTemplates = [...customTemplates, ...resumeTemplates];
  const filteredTemplates = allTemplates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(templateSearch.toLowerCase()) || 
                          t.skills.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesCategory = templateCategory === 'All' || t.department === templateCategory;
    const matchesLevel = templateLevel === 'All' || t.level === templateLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Filter jobs
  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
                          j.location.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesStatus = jobStatusFilter === 'All' || j.status === jobStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const departments = ['All', ...Array.from(new Set(resumeTemplates.map(t => t.department)))];
  const levels = ['All', 'Entry Level', 'Mid Level', 'Senior Level'];

  return (
    <Layout>
      <div className="bg-navy-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Employer Portal</h1>
              <p className="text-gray-300">Manage your talent pipeline and job postings.</p>
            </div>
            {activeTab === 'jobs' ? (
              <button 
                onClick={openPostModal}
                className="bg-gold-500 text-navy-900 px-6 py-3 rounded-lg font-bold hover:bg-gold-400 transition-colors flex items-center shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" /> Post New Job
              </button>
            ) : (
              <button 
                onClick={() => setShowUploadModal(true)}
                className="bg-gold-500 text-navy-900 px-6 py-3 rounded-lg font-bold hover:bg-gold-400 transition-colors flex items-center shadow-lg"
              >
                <Upload className="h-5 w-5 mr-2" /> Upload Template
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 border-b border-navy-700">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'jobs' ? 'text-gold-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              Job Listings
              {activeTab === 'jobs' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'templates' ? 'text-gold-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              Resume Templates
              {activeTab === 'templates' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Jobs', value: jobs.length.toString(), icon: Briefcase },
            { label: 'Total Applicants', value: jobs.reduce((acc, job) => acc + job.applicant_count, 0).toString(), icon: Users },
            { label: 'Templates Available', value: resumeTemplates.length.toString(), icon: FileText },
            { label: 'Views', value: '1.2k', icon: TrendingUp }, // Mock
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-navy-900 mt-2">{stat.value}</h3>
                </div>
                <stat.icon className="h-6 w-6 text-gold-500" />
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'jobs' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Jobs List */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-navy-900">Your Job Postings</h2>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search jobs..." 
                      value={jobSearch}
                      onChange={(e) => setJobSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500"
                    />
                  </div>
                  <select 
                    value={jobStatusFilter}
                    onChange={(e) => setJobStatusFilter(e.target.value)}
                    className="p-2 text-sm border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-6 text-center text-gray-500">Loading jobs...</div>
                ) : filteredJobs.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No jobs found.</div>
                ) : (
                  filteredJobs.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-navy-900 text-lg">{job.title}</h3>
                        <button 
                          onClick={() => handleToggleStatus(job.id, job.status)}
                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors hover:opacity-80 flex items-center ${
                            job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}
                          title="Click to toggle status"
                        >
                          {job.status}
                          <span className="ml-1 text-[10px] opacity-60">
                            (Change)
                          </span>
                        </button>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                        <span className="flex items-center"><Users className="h-4 w-4 mr-1" /> {job.applicant_count} Applicants</span>
                        <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleViewApplicants(job.id)}
                          className="text-sm bg-navy-50 text-navy-900 px-3 py-1.5 rounded-md font-medium hover:bg-navy-100 flex items-center"
                        >
                          <Eye className="h-3 w-3 mr-1" /> Applicants
                        </button>
                        <button 
                          onClick={() => openEditModal(job)}
                          className="text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md font-medium hover:bg-gray-50 flex items-center"
                        >
                          <Edit className="h-3 w-3 mr-1" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-md font-medium hover:bg-red-100 flex items-center"
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar - Quick Actions / Search */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-navy-900 mb-4">Find Talent</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search by skills, title..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500"
                    />
                  </div>
                  <button className="w-full bg-navy-900 text-white font-bold py-2 rounded-lg hover:bg-navy-800 transition-colors">
                    Search Candidates
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Templates Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search templates..." 
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500"
                />
              </div>
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <Filter className="h-5 w-5 text-gray-500" />
                <select 
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500 flex-1 md:w-40"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select 
                  value={templateLevel}
                  onChange={(e) => setTemplateLevel(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500 flex-1 md:w-40"
                >
                  {levels.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg transition-colors ${
                        (template as any).isCustom 
                          ? 'bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white' 
                          : 'bg-navy-50 text-navy-900 group-hover:bg-gold-500 group-hover:text-white'
                      }`}>
                        {(template as any).isCustom ? <Edit className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                      </div>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                        {template.level}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-navy-900 mb-1">{template.title}</h3>
                    <p className="text-sm text-gold-600 font-medium mb-3">{template.department}</p>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-4">{template.summary}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.skills.split(',').slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200">
                          {skill.trim()}
                        </span>
                      ))}
                      {template.skills.split(',').length > 3 && (
                        <span className="text-xs text-gray-400 px-1 py-1">+more</span>
                      )}
                    </div>

                    <button 
                      onClick={() => setViewingTemplate(template)}
                      className="w-full py-2 border border-navy-900 text-navy-900 rounded-lg font-medium hover:bg-navy-900 hover:text-white transition-colors"
                    >
                      View Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Post/Edit Job Modal */}
      <Modal isOpen={showPostJob} onClose={() => setShowPostJob(false)} title={editingJob ? "Edit Job" : "Post a New Job"}>
        <form onSubmit={handlePostJob} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input 
              type="text" 
              required
              className="w-full p-2 border rounded-md"
              value={jobForm.title}
              onChange={e => setJobForm({...jobForm, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input 
              type="text" 
              required
              className="w-full p-2 border rounded-md"
              value={jobForm.location}
              onChange={e => setJobForm({...jobForm, location: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              value={jobForm.salary}
              onChange={e => setJobForm({...jobForm, salary: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              required
              rows={4}
              className="w-full p-2 border rounded-md"
              value={jobForm.description}
              onChange={e => setJobForm({...jobForm, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
            <textarea 
              rows={3}
              className="w-full p-2 border rounded-md"
              value={jobForm.requirements}
              onChange={e => setJobForm({...jobForm, requirements: e.target.value})}
            />
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-gold-500 text-navy-900 font-bold py-3 rounded-lg hover:bg-gold-400">
              {editingJob ? "Update Job" : "Publish Job"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Applicants Modal */}
      <Modal isOpen={!!viewingApplicants} onClose={() => setViewingApplicants(null)} title="Job Applicants">
        <div className="space-y-4">
          {applicants.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No applicants yet.</p>
          ) : (
            applicants.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-navy-100 rounded-full flex items-center justify-center text-navy-900 font-bold">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900">{app.name}</h4>
                    <p className="text-xs text-gray-500">{app.email}</p>
                    <p className="text-xs text-gray-400">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-xs bg-navy-900 text-white px-3 py-1 rounded hover:bg-navy-800">View Profile</button>
                  <button className="text-xs border border-gray-300 px-3 py-1 rounded hover:bg-gray-100">Message</button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Upload Template Modal */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Create Custom Resume Template">
        <form onSubmit={handleUploadTemplate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Title</label>
            <input 
              type="text" 
              required 
              className="w-full p-2 border rounded-md" 
              placeholder="e.g. Senior Sous Chef"
              value={uploadForm.title}
              onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={uploadForm.department}
                onChange={e => setUploadForm({...uploadForm, department: e.target.value})}
              >
                {departments.filter(d => d !== 'All').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={uploadForm.level}
                onChange={e => setUploadForm({...uploadForm, level: e.target.value})}
              >
                {levels.filter(l => l !== 'All').map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary (Placeholder)</label>
            <textarea 
              rows={3} 
              className="w-full p-2 border rounded-md" 
              placeholder="Enter a default summary..."
              value={uploadForm.summary}
              onChange={e => setUploadForm({...uploadForm, summary: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills (Comma separated)</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md" 
              placeholder="Cooking, Leadership, Inventory..."
              value={uploadForm.skills}
              onChange={e => setUploadForm({...uploadForm, skills: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience Structure</label>
            <textarea 
              rows={3} 
              className="w-full p-2 border rounded-md" 
              placeholder="Describe the typical experience structure..."
              value={uploadForm.experience}
              onChange={e => setUploadForm({...uploadForm, experience: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Education Requirements</label>
            <textarea 
              rows={2} 
              className="w-full p-2 border rounded-md" 
              placeholder="Required degrees or certifications..."
              value={uploadForm.education}
              onChange={e => setUploadForm({...uploadForm, education: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-navy-900 text-white font-bold py-3 rounded-lg hover:bg-navy-800">
              Save Custom Template
            </button>
          </div>
        </form>
      </Modal>

      {/* Template Preview Modal */}
      <Modal isOpen={!!viewingTemplate} onClose={() => setViewingTemplate(null)} title="Template Preview">
        {viewingTemplate && (
          <div className="flex flex-col h-[80vh]">
            {/* Layout Selector */}
            <div className="flex justify-center space-x-4 mb-4">
              <button 
                onClick={() => setPreviewLayout('classic')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  previewLayout === 'classic' 
                    ? 'bg-navy-900 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Classic Layout
              </button>
              <button 
                onClick={() => setPreviewLayout('modern')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  previewLayout === 'modern' 
                    ? 'bg-navy-900 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Modern Layout
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-100 p-4 rounded-lg border border-gray-200">
              {/* Resume Document Representation */}
              <div className={`bg-white shadow-lg mx-auto max-w-[210mm] min-h-[297mm] transition-all duration-300 ${
                previewLayout === 'modern' ? 'flex' : 'p-8'
              }`}>
                
                {previewLayout === 'classic' ? (
                  // CLASSIC LAYOUT
                  <>
                    {/* Header */}
                    <div className="text-center border-b-2 border-navy-900 pb-6 mb-6">
                      <h1 className="text-3xl font-serif font-bold text-navy-900 uppercase tracking-widest">[Candidate Name]</h1>
                      <div className="flex justify-center space-x-4 text-sm text-gray-600 mt-3 font-medium">
                        <span>email@example.com</span>
                        <span>•</span>
                        <span>+250 788 000 000</span>
                        <span>•</span>
                        <span>Kigali, Rwanda</span>
                      </div>
                      <p className="text-gold-600 font-bold mt-2 uppercase text-sm tracking-wide">{viewingTemplate.title}</p>
                    </div>

                    {/* Summary */}
                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-navy-900 uppercase border-b border-gold-500 mb-3 inline-block tracking-wider">Professional Summary</h3>
                      <p className="text-gray-700 text-sm leading-relaxed text-justify">
                        {viewingTemplate.summary}
                      </p>
                    </div>

                    {/* Experience */}
                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-navy-900 uppercase border-b border-gold-500 mb-3 inline-block tracking-wider">Experience</h3>
                      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {viewingTemplate.experience}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-navy-900 uppercase border-b border-gold-500 mb-3 inline-block tracking-wider">Key Skills</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {viewingTemplate.skills.split(',').map((skill: string, i: number) => (
                          <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-navy-900 uppercase border-b border-gold-500 mb-3 inline-block tracking-wider">Education</h3>
                      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {viewingTemplate.education}
                      </div>
                    </div>
                  </>
                ) : (
                  // MODERN LAYOUT
                  <>
                    {/* Sidebar (Left) */}
                    <div className="w-1/3 bg-navy-900 text-white p-8 flex flex-col">
                      <div className="mb-8">
                        <div className="w-24 h-24 bg-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center text-navy-900 font-bold text-3xl">
                          CN
                        </div>
                        <h1 className="text-xl font-bold text-center uppercase tracking-wider">[Candidate Name]</h1>
                        <p className="text-gold-500 text-center text-xs mt-1 uppercase tracking-wide">{viewingTemplate.title}</p>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-4 border-b border-navy-700 pb-1">Contact</h3>
                        <div className="space-y-3 text-xs text-gray-300">
                          <div className="flex items-center"><span className="w-4 mr-2">📧</span> email@example.com</div>
                          <div className="flex items-center"><span className="w-4 mr-2">📱</span> +250 788 000 000</div>
                          <div className="flex items-center"><span className="w-4 mr-2">📍</span> Kigali, Rwanda</div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-4 border-b border-navy-700 pb-1">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {viewingTemplate.skills.split(',').map((skill: string, i: number) => (
                            <span key={i} className="bg-navy-800 text-white px-2 py-1 rounded text-[10px] font-medium border border-navy-700">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-4 border-b border-navy-700 pb-1">Education</h3>
                        <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {viewingTemplate.education}
                        </div>
                      </div>
                    </div>

                    {/* Main Content (Right) */}
                    <div className="w-2/3 p-8 bg-white">
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-navy-900 uppercase tracking-widest mb-4 flex items-center">
                          <span className="w-2 h-8 bg-gold-500 mr-3"></span>
                          Profile
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed text-justify">
                          {viewingTemplate.summary}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-navy-900 uppercase tracking-widest mb-4 flex items-center">
                          <span className="w-2 h-8 bg-gold-500 mr-3"></span>
                          Experience
                        </h3>
                        <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                          {viewingTemplate.experience}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t mt-2">
              <button 
                onClick={() => setViewingTemplate(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 bg-white font-medium"
              >
                Close Preview
              </button>
              <button 
                onClick={() => alert('Downloading PDF... (Mock)')}
                className="px-4 py-2 border border-navy-900 text-navy-900 rounded-lg hover:bg-navy-50 bg-white font-medium flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" /> Download PDF
              </button>
              <button 
                onClick={handleUseTemplate}
                className="px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 flex items-center shadow-sm font-medium transition-transform active:scale-95"
              >
                <Edit className="h-4 w-4 mr-2" /> Use This Template
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

// Helper Icons
const CheckCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default EmployerDashboard;
