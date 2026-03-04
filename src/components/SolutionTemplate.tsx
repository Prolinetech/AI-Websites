import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface SolutionTemplateProps {
  title: string;
  subtitle: string;
  heroImage: string;
  challenge: string;
  solution: string;
  process: { title: string; description: string }[];
  results: string[];
  ctaText?: string;
  ctaLink?: string;
}

const SolutionTemplate: React.FC<SolutionTemplateProps> = ({
  title,
  subtitle,
  heroImage,
  challenge,
  solution,
  process,
  results,
  ctaText = "Get Started",
  ctaLink = "/contact"
}) => {
  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-900/80 mix-blend-multiply" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-white mb-4"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gold-100 max-w-3xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>

      {/* Challenge & Solution */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-serif font-bold text-navy-900 mb-6">The Challenge</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{challenge}</p>
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-navy-900 mb-6">Our Solution</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-navy-900 mb-4">Our Process</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-navy-50 rounded-full group-hover:bg-gold-50 transition-colors" />
                <span className="relative text-5xl font-bold text-gray-100 group-hover:text-gold-200 transition-colors">0{index + 1}</span>
                <h3 className="relative text-xl font-bold text-navy-900 mt-4 mb-2">{step.title}</h3>
                <p className="relative text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">Tangible Results</h2>
              <p className="text-gray-300 mb-8 text-lg">
                We don't just advise; we deliver measurable impact that drives your business forward.
              </p>
              <Link to={ctaLink} className="inline-flex items-center bg-gold-500 text-navy-900 font-bold px-8 py-4 rounded-full hover:bg-gold-400 transition-colors">
                {ctaText} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {results.map((result, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-gold-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-lg font-medium">{result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SolutionTemplate;
