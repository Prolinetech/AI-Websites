import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Users, TrendingUp, Award } from 'lucide-react';
import Layout from '../components/Layout';

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Luxury Hotel Lobby" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy-900/80 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight"
          >
            Redefining <span className="text-gold-500">Hospitality Excellence</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light"
          >
            Your premier partner for expert consultancy, AI-powered recruitment, and world-class training solutions in Rwanda and beyond.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/solutions/consultancy" className="bg-gold-500 text-navy-900 hover:bg-gold-400 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center">
              Explore Our Solutions <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-navy-900 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-4">Our Core Solutions</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mb-6" />
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Comprehensive strategies tailored to elevate your business performance and guest satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Consultancy */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-gold-500/30 transition-all"
            >
              <div className="w-14 h-14 bg-navy-100 rounded-full flex items-center justify-center mb-6 text-navy-900">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Consultancy</h3>
              <p className="text-gray-600 mb-6">
                Strategic business feasibility, brand development, and operational management to maximize ROI and efficiency.
              </p>
              <Link to="/solutions/consultancy" className="text-gold-600 font-semibold hover:text-gold-700 flex items-center">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            {/* Recruitment */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-gold-500/30 transition-all"
            >
              <div className="w-14 h-14 bg-navy-100 rounded-full flex items-center justify-center mb-6 text-navy-900">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Recruitment</h3>
              <p className="text-gray-600 mb-6">
                AI-powered talent acquisition connecting top-tier hospitality professionals with leading employers.
              </p>
              <Link to="/solutions/recruitment" className="text-gold-600 font-semibold hover:text-gold-700 flex items-center">
                Find Talent <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            {/* Training */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-gold-500/30 transition-all"
            >
              <div className="w-14 h-14 bg-navy-100 rounded-full flex items-center justify-center mb-6 text-navy-900">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Training</h3>
              <p className="text-gray-600 mb-6">
                World-class workshops and certifications to upskill your workforce in service excellence and leadership.
              </p>
              <Link to="/solutions/training" className="text-gold-600 font-semibold hover:text-gold-700 flex items-center">
                View Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Why Partner With Proline?</h2>
              <p className="text-gray-300 text-lg mb-8">
                We combine deep industry expertise with cutting-edge technology to deliver measurable results.
              </p>
              
              <div className="space-y-6">
                {[
                  "AI-Enhanced Recruitment Process",
                  "Certified Industry Experts",
                  "Data-Driven Revenue Strategies",
                  "Tailored Training Programs"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center mr-4">
                      <CheckCircle className="h-5 w-5 text-navy-900" />
                    </div>
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Team Meeting" 
                className="rounded-2xl shadow-2xl border-4 border-white/10"
              />
              <div className="absolute -bottom-6 -left-6 bg-gold-500 p-6 rounded-xl shadow-xl hidden md:block">
                <p className="text-navy-900 font-bold text-3xl">10+</p>
                <p className="text-navy-900 font-medium text-sm uppercase tracking-wide">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
