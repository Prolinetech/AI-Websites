import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, DollarSign, Briefcase, FileText, Settings, Trash2, Eye, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import Modal from '../../components/Modal';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
];

const userGrowth = [
  { name: 'Jan', users: 100 },
  { name: 'Feb', users: 120 },
  { name: 'Mar', users: 150 },
  { name: 'Apr', users: 200 },
  { name: 'May', users: 280 },
  { name: 'Jun', users: 350 },
];

// Mock Data
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'candidate', status: 'Active', joined: '2023-10-24' },
  { id: 2, name: 'Proline Hotel', email: 'hr@proline.com', role: 'employer', status: 'Active', joined: '2023-10-23' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'candidate', status: 'Pending', joined: '2023-10-22' },
];

const mockJobs = [
  { id: 101, title: 'Housekeeping Supervisor', employer: 'Proline Hotel', status: 'Active', posted: '2023-10-25' },
  { id: 102, title: 'Front Desk Manager', employer: 'Proline Hotel', status: 'Active', posted: '2023-10-24' },
  { id: 103, title: 'Executive Chef', employer: 'Grand Hotel', status: 'Closed', posted: '2023-10-20' },
];

const mockApplications = [
  { id: 201, job: 'Housekeeping Supervisor', candidate: 'John Doe', status: 'Pending', date: '2023-10-26' },
  { id: 202, job: 'Front Desk Manager', candidate: 'Jane Smith', status: 'Interview', date: '2023-10-25' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'applications' | 'settings'>('overview');
  const [users, setUsers] = useState(mockUsers);
  const [jobs, setJobs] = useState(mockJobs);
  const [applications, setApplications] = useState(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteUser = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleDeleteJob = (id: number) => {
    if (confirm('Are you sure you want to delete this job?')) {
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  const renderOverview = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Revenue', value: '2.4M RWF', icon: DollarSign, color: 'text-green-500' },
          { label: 'Total Users', value: users.length.toString(), icon: Users, color: 'text-blue-500' },
          { label: 'Active Jobs', value: jobs.filter(j => j.status === 'Active').length.toString(), icon: Briefcase, color: 'text-purple-500' },
          { label: 'Applications', value: applications.length.toString(), icon: FileText, color: 'text-gold-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase">{stat.label}</p>
                <h3 className="text-3xl font-bold text-navy-900 mt-2">{stat.value}</h3>
              </div>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-navy-900 mb-6">Revenue Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#d4af37" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-navy-900 mb-6">User Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#0a192f" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-navy-900">User Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="pl-9 pr-4 py-2 border rounded-lg focus:ring-gold-500 focus:border-gold-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-900 font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.joined}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 ml-4">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-navy-900">Job Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="pl-9 pr-4 py-2 border rounded-lg focus:ring-gold-500 focus:border-gold-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase())).map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {job.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.employer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.posted}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 hover:text-red-900 ml-4">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="bg-navy-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Platform overview and comprehensive control.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Briefcase },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'jobs', label: 'Jobs', icon: FileText },
            { id: 'applications', label: 'Applications', icon: CheckCircle },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'jobs' && renderJobs()}
        {activeTab === 'applications' && (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-navy-900">Application Management</h3>
            <p className="text-gray-500">Detailed application tracking coming soon.</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-navy-900">Platform Settings</h3>
            <p className="text-gray-500">Global configuration options coming soon.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
