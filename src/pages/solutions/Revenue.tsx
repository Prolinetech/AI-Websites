import React from 'react';
import SolutionTemplate from '../../components/SolutionTemplate';

const Revenue = () => {
  return (
    <SolutionTemplate
      title="Revenue Optimization"
      subtitle="Data-driven strategies to maximize yield and profitability across all revenue streams."
      heroImage="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      challenge="Many hotels leave money on the table due to static pricing, poor inventory management, and lack of data utilization. Optimizing revenue requires a dynamic, analytical approach."
      solution="Our revenue management experts utilize advanced analytics and market intelligence to optimize pricing, distribution channels, and inventory. We turn data into actionable strategies for growth."
      process={[
        { title: "Audit", description: "Analyzing historical data, comp set performance, and current pricing strategies." },
        { title: "Strategy", description: "Implementing dynamic pricing, channel management, and segmentation strategies." },
        { title: "Monitoring", description: "Continuous performance tracking and adjustment to market changes." }
      ]}
      results={[
        "Maximized RevPAR and ADR",
        "Optimized Distribution Mix",
        "Increased Direct Bookings",
        "Better Forecasting Accuracy"
      ]}
      ctaText="Optimize Your Revenue"
    />
  );
};

export default Revenue;
