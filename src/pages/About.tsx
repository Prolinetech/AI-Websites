import React from 'react';
import Layout from '../components/Layout';
import { CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="bg-navy-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About Proline</h1>
          <p className="text-xl text-gold-100 max-w-3xl mx-auto">
            We are the architects of hospitality excellence, dedicated to transforming businesses and empowering professionals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-serif font-bold text-navy-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              To elevate the standards of the hospitality industry in Rwanda and East Africa by providing world-class consultancy, innovative recruitment solutions, and comprehensive training programs.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We believe that true hospitality is an art form, perfected through rigorous standards, continuous learning, and a passion for service.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Team working" 
              className="rounded-2xl shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-gold-500 p-8 rounded-xl shadow-lg hidden md:block">
              <p className="text-navy-900 font-bold text-4xl">100+</p>
              <p className="text-navy-900 font-medium uppercase tracking-wide">Partner Hotels</p>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-serif font-bold text-navy-900 mb-10 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Excellence", desc: "We set the highest standards in everything we do, from training to recruitment." },
              { title: "Integrity", desc: "We build trust through transparency, honesty, and ethical business practices." },
              { title: "Innovation", desc: "We embrace technology and new methodologies to stay ahead of industry trends." }
            ].map((value, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-navy-900" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
