import React from 'react';
import Layout from '../components/Layout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <Layout>
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Have questions? We're here to help you elevate your hospitality business.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Whether you're looking for consultancy, recruitment solutions, or training programs, our team is ready to assist you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-navy-50 rounded-full flex items-center justify-center text-navy-900 mr-4 flex-shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-900">Visit Us</h3>
                  <p className="text-gray-600">123 KG Avenue, Kigali, Rwanda</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-navy-50 rounded-full flex items-center justify-center text-navy-900 mr-4 flex-shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-900">Call Us</h3>
                  <p className="text-gray-600">+250 788 000 000</p>
                  <p className="text-gray-600">+250 788 111 111</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-navy-50 rounded-full flex items-center justify-center text-navy-900 mr-4 flex-shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-900">Email Us</h3>
                  <p className="text-gray-600">info@prolinehospitality.com</p>
                  <p className="text-gray-600">support@prolinehospitality.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Send a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500">
                  <option>General Inquiry</option>
                  <option>Consultancy Services</option>
                  <option>Recruitment</option>
                  <option>Training</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-gold-500 focus:border-gold-500"></textarea>
              </div>
              <button type="submit" className="w-full bg-gold-500 text-navy-900 font-bold py-3 rounded-lg hover:bg-gold-400 transition-colors flex items-center justify-center">
                <Send className="h-5 w-5 mr-2" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
