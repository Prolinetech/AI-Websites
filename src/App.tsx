/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import ResumeBuilder from './pages/candidate/ResumeBuilder';

import CandidateDashboard from './pages/candidate/Dashboard';
import EmployerDashboard from './pages/employer/Dashboard';

import AdminDashboard from './pages/admin/Dashboard';

import Consultancy from './pages/solutions/Consultancy';
import Recruitment from './pages/solutions/Recruitment';
import Training from './pages/solutions/Training';
import Revenue from './pages/solutions/Revenue';

import Jobs from './pages/Jobs';
import TrainingEvents from './pages/TrainingEvents';
import Contact from './pages/Contact';
import About from './pages/About';

// Placeholder components for routes not yet implemented
const Placeholder = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-navy-900 mb-4">{title}</h1>
      <p className="text-gray-600">Coming Soon</p>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Solutions */}
          <Route path="/solutions/consultancy" element={<Consultancy />} />
          <Route path="/solutions/recruitment" element={<Recruitment />} />
          <Route path="/solutions/training" element={<Training />} />
          <Route path="/solutions/revenue" element={<Revenue />} />
          
          {/* Portals */}
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/resume-builder" element={<ResumeBuilder />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Other */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/training-events" element={<TrainingEvents />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
