import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { MapPin, DollarSign, Briefcase, Search, Filter } from 'lucide-react';
import axios from 'axios';

interface Job {
  id: number;
  title: string;
  employer_name: string;
  location: string;
  salary: string;
  description: string;
  created_at: string;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <Layout>
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Browse hundreds of hospitality opportunities from top employers in Rwanda.
          </p>
          
          <div className="mt-8 max-w-3xl mx-auto bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Job title, keywords..." 
                className="w-full pl-10 pr-4 py-2 text-gray-900 focus:outline-none rounded-md"
              />
            </div>
            <div className="flex-1 relative border-t md:border-t-0 md:border-l border-gray-200">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Location" 
                className="w-full pl-10 pr-4 py-2 text-gray-900 focus:outline-none rounded-md"
              />
            </div>
            <button className="bg-gold-500 text-navy-900 font-bold px-8 py-2 rounded-md hover:bg-gold-400 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-navy-900">Filters</h3>
                <Filter className="h-4 w-4 text-gray-500" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Job Type</h4>
                  <div className="space-y-2">
                    {['Full Time', 'Part Time', 'Contract', 'Internship'].map((type, i) => (
                      <label key={i} className="flex items-center">
                        <input type="checkbox" className="rounded text-gold-500 focus:ring-gold-500" />
                        <span className="ml-2 text-sm text-gray-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Category</h4>
                  <div className="space-y-2">
                    {['Management', 'F&B', 'Front Office', 'Housekeeping', 'Culinary'].map((cat, i) => (
                      <label key={i} className="flex items-center">
                        <input type="checkbox" className="rounded text-gold-500 focus:ring-gold-500" />
                        <span className="ml-2 text-sm text-gray-600">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job List */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="text-center py-12">Loading jobs...</div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-navy-900">{job.title}</h3>
                      <p className="text-gold-600 font-medium mb-2">{job.employer_name}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {job.location}</span>
                        <span className="flex items-center"><DollarSign className="h-4 w-4 mr-1" /> {job.salary}</span>
                        <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1" /> Full Time</span>
                      </div>
                      
                      <p className="text-gray-600 line-clamp-2">{job.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <button className="w-full md:w-auto bg-navy-50 text-navy-900 font-bold px-6 py-2 rounded-lg hover:bg-navy-100 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="text-gray-500">Check back later or adjust your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;
