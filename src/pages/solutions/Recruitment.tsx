import React from 'react';
import SolutionTemplate from '../../components/SolutionTemplate';

const Recruitment = () => {
  return (
    <SolutionTemplate
      title="AI-Powered Recruitment"
      subtitle="Connecting premier hospitality brands with top-tier talent using advanced AI matching."
      heroImage="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      challenge="Finding qualified, reliable staff in the hospitality industry is time-consuming and costly. High turnover rates and mismatched skills often disrupt operations and service quality."
      solution="Our AI-driven platform analyzes candidate profiles against your specific requirements, ensuring a perfect cultural and technical fit. We verify skills, certifications, and experience to deliver ready-to-work professionals."
      process={[
        { title: "Profile Matching", description: "AI algorithms scan thousands of profiles to find the best matches for your job description." },
        { title: "Verification", description: " rigorous background checks and skill verification to ensure candidate quality." },
        { title: "Placement", description: "Seamless interview scheduling and onboarding support for successful hires." }
      ]}
      results={[
        "50% Reduction in Time-to-Hire",
        "Higher Retention Rates",
        "Access to Vetted Talent Pool",
        "Reduced Recruitment Costs"
      ]}
      ctaText="Find Talent Now"
      ctaLink="/register"
    />
  );
};

export default Recruitment;
