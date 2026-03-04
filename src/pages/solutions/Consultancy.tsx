import React from 'react';
import SolutionTemplate from '../../components/SolutionTemplate';

const Consultancy = () => {
  return (
    <SolutionTemplate
      title="Hospitality Consultancy"
      subtitle="Strategic guidance to elevate your brand, optimize operations, and maximize profitability."
      heroImage="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      challenge="In a competitive hospitality landscape, businesses often struggle with operational inefficiencies, inconsistent service quality, and undefined brand identities, leading to lost revenue and customer churn."
      solution="Proline offers end-to-end consultancy services, from concept development and feasibility studies to operational restructuring and guest experience optimization. We align your business strategy with market demands."
      process={[
        { title: "Assessment", description: "We conduct a deep-dive audit of your current operations, financials, and market position." },
        { title: "Strategy", description: "Developing tailored SOPs, brand standards, and growth roadmaps aligned with your goals." },
        { title: "Implementation", description: "Hands-on guidance to execute changes, train staff, and deploy new systems." }
      ]}
      results={[
        "Increased RevPAR by up to 25%",
        "Streamlined Operational Costs",
        "Enhanced Guest Satisfaction Scores",
        "Stronger Brand Positioning"
      ]}
      ctaText="Book a Consultation"
    />
  );
};

export default Consultancy;
