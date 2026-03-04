import React from 'react';
import SolutionTemplate from '../../components/SolutionTemplate';

const Training = () => {
  return (
    <SolutionTemplate
      title="Professional Training"
      subtitle="Empowering your workforce with world-class skills in service, leadership, and operations."
      heroImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      challenge="Service inconsistency is the number one killer of hospitality brands. Without proper training, staff lack the confidence and skills to deliver the exceptional experiences guests expect."
      solution="We provide comprehensive training programs covering Front Office, Housekeeping, F&B, and Leadership. Our curriculum is practical, industry-aligned, and designed to instill a culture of excellence."
      process={[
        { title: "Needs Analysis", description: "Identifying skill gaps and training requirements specific to your team." },
        { title: "Custom Workshops", description: "Interactive, hands-on sessions delivered by certified industry experts." },
        { title: "Certification", description: "Assessment and certification to validate skills and motivate staff." }
      ]}
      results={[
        "Improved Service Consistency",
        "Higher Employee Morale",
        "Increased Upselling Revenue",
        "Better Guest Reviews"
      ]}
      ctaText="View Course Calendar"
      ctaLink="/training-events"
    />
  );
};

export default Training;
