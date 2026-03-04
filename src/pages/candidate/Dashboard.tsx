import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { FileText, Briefcase, Clock, CheckCircle, Plus } from 'lucide-react';

const CandidateDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="bg-navy-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Welcome back, {user?.name}</h1>
          <p className="text-gray-300">Manage your career profile and applications.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium uppercase">Total Applications</h3>
              <Briefcase className="h-6 w-6 text-gold-500" />
            </div>
            <p className="text-3xl font-bold text-navy-900">12</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium uppercase">Interviews</h3>
              <Clock className="h-6 w-6 text-gold-500" />
            </div>
            <p className="text-3xl font-bold text-navy-900">3</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium uppercase">Profile Views</h3>
              <UsersIcon className="h-6 w-6 text-gold-500" />
            </div>
            <p className="text-3xl font-bold text-navy-900">45</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Resume Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-navy-900">My Resume</h2>
                <Link to="/candidate/resume-builder" className="text-sm text-gold-600 font-medium hover:text-gold-700 flex items-center">
                  <Plus className="h-4 w-4 mr-1" /> Create New
                </Link>
              </div>
              <div className="p-6">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="h-12 w-12 bg-navy-100 rounded-full flex items-center justify-center text-navy-900 mr-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-navy-900">Hospitality Manager Resume</h4>
                    <p className="text-xs text-gray-500">Last updated: 2 days ago</p>
                  </div>
                  <button className="text-sm text-navy-600 hover:text-navy-800 font-medium">Edit</button>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-navy-900">Recent Applications</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { role: 'Front Office Manager', company: 'Grand Hotel Kigali', date: 'Oct 24, 2023', status: 'Interview' },
                  { role: 'Head Chef', company: 'Serena Hotel', date: 'Oct 20, 2023', status: 'Pending' },
                  { role: 'Concierge', company: 'Marriott', date: 'Oct 15, 2023', status: 'Rejected' },
                ].map((app, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-navy-900">{app.role}</h4>
                      <p className="text-sm text-gray-600">{app.company}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'Interview' ? 'bg-green-100 text-green-800' :
                        app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{app.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-navy-900 rounded-xl shadow-md p-6 text-white">
              <h3 className="font-bold text-lg mb-4 text-gold-500">Upgrade to Premium</h3>
              <p className="text-sm text-gray-300 mb-6">Get featured placement, unlimited resume downloads, and priority support.</p>
              <button className="w-full bg-gold-500 text-navy-900 font-bold py-2 rounded-lg hover:bg-gold-400 transition-colors">
                Upgrade Now
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-4 text-navy-900">Recommended Jobs</h3>
              <div className="space-y-4">
                {[
                  { title: 'Restaurant Manager', company: 'Fusion Bistro', loc: 'Kigali' },
                  { title: 'Housekeeping Supervisor', company: 'The Retreat', loc: 'Kigali' },
                ].map((job, i) => (
                  <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <h4 className="font-bold text-navy-900 text-sm">{job.title}</h4>
                    <p className="text-xs text-gray-600">{job.company} • {job.loc}</p>
                    <button className="text-xs text-gold-600 font-medium mt-2 hover:text-gold-700">View Details</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default CandidateDashboard;
