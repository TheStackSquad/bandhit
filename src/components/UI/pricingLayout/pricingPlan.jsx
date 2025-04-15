//src/componnts/UI/pricingPlan.jsx
'use client';

import React, { useState } from 'react';
import PricingCard from '@/components/UI/pricingLayout/pricingCard';

const PricingPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 1,
      title: 'Basic Listing',
      price: '0',
      description: 'forever',
      features: [
        { icon: '✓', text: 'Basic profile listing' },
        { icon: '✓', text: '1 service category' },
        { icon: '✓', text: 'Community support' },
        { icon: '✕', text: 'Verified badge', disabled: true },
        { icon: '✕', text: 'Priority placement', disabled: true },
        { icon: '✕', text: 'Booking tools', disabled: true },
      ],
      ctaText: 'Create Free Listing',
    },
    {
      id: 2,
      title: 'Verified Pro',
      price: '29, 500',
      description: 'per month',
      features: [
        { icon: '✓', text: 'Official verified badge' },
        { icon: '✓', text: 'Premium placement in search' },
        { icon: '✓', text: 'Featured on homepage rotation' },
        { icon: '✓', text: 'Detailed analytics dashboard' },
        { icon: '✓', text: 'Direct booking capabilities' },
        { icon: '✓', text: 'Priority support' },
      ],
      isPopular: true,
      ctaText: 'Get Verified & Start Booking',
    },
    {
      id: 3,
      title: 'Premium Partner',
      price: '89, 900',
      description: 'per month',
      features: [
        { icon: '✓', text: 'Everything in Verified Pro' },
        { icon: '✓', text: 'Top-of-search guaranteed' },
        { icon: '✓', text: 'Lower commission (5%)' },
        { icon: '✓', text: 'Custom branded profile' },
        { icon: '✓', text: 'Direct email marketing' },
        { icon: '✓', text: 'Dedicated account manager' },
      ],
      ctaText: 'Become a Premium Partner',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
      {plans.map((plan) => (
        <PricingCard
          key={plan.id}
          {...plan}
          isSelected={selectedPlan === plan.id}
          onSelect={() => setSelectedPlan(plan.id)}
        />
      ))}
    </div>
  );
};

export default PricingPlan;