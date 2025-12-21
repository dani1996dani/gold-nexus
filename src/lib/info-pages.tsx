import React from 'react';

interface PageContent {
  title: string;
  content: React.ReactNode;
}

const PlaceholderContent = ({ title }: { title: string }) => (
  <div className="space-y-4">
    <p className="text-lg text-neutral-600">Thank you for your interest in our {title}.</p>
    <p className="text-neutral-500">
      We are currently updating this section with the latest information to better serve our global
      clients. Please check back shortly for full details.
    </p>
  </div>
);

export const pages: Record<string, PageContent> = {
  // Support Slugs
  'ai-support': {
    title: 'AI Customer Service',
    content: <PlaceholderContent title="AI Customer Service" />,
  },
  'support-ticket': {
    title: 'Open Support Ticket',
    content: <PlaceholderContent title="Support Ticket System" />,
  },
  faq: {
    title: 'FAQ & Knowledge Base',
    content: <PlaceholderContent title="FAQ" />,
  },

  // Company Slugs
  'about-us': {
    title: 'About Gold Nexus',
    content: <PlaceholderContent title="Company Profile" />,
  },
  vision: {
    title: 'Vision & Mission',
    content: <PlaceholderContent title="Vision & Mission" />,
  },
  'how-it-works': {
    title: 'How It Works',
    content: <PlaceholderContent title="Platform Guide" />,
  },
  terms: {
    title: 'Terms & Conditions',
    content: <PlaceholderContent title="Terms & Conditions" />,
  },
  privacy: {
    title: 'Privacy Policy',
    content: <PlaceholderContent title="Privacy Policy" />,
  },
  compliance: {
    title: 'Compliance & Regulation',
    content: <PlaceholderContent title="Compliance Standards" />,
  },
  'aml-kyc': {
    title: 'AML / KYC Policy',
    content: <PlaceholderContent title="AML / KYC Policies" />,
  },

  // Services Slugs
  'verified-sellers': {
    title: 'Verified Sellers Network',
    content: <PlaceholderContent title="Verified Sellers Network" />,
  },
  shipping: {
    title: 'Secure Global Shipping',
    content: <PlaceholderContent title="Shipping & Logistics" />,
  },
  insurance: {
    title: 'Insurance & Buyer Protection',
    content: <PlaceholderContent title="Insurance Program" />,
  },
  'live-price': {
    title: 'Live Gold Price Data',
    content: <PlaceholderContent title="Market Data Feed" />,
  },
  institutional: {
    title: 'Institutional & Hedging Solutions',
    content: <PlaceholderContent title="Institutional Services" />,
  },

  // Legacy/Other
  'secure-trading': {
    title: 'Secure Trading Environment',
    content: <PlaceholderContent title="Security Protocols" />,
  },
  verification: {
    title: 'Certified Jewelry Verification',
    content: <PlaceholderContent title="Verification Process" />,
  },
  'buyer-protection': {
    title: 'Insurance & Buyer Protection',
    content: <PlaceholderContent title="Buyer Protection" />,
  },
  'global-checkout': {
    title: 'Seamless Global Checkout',
    content: <PlaceholderContent title="Global Checkout" />,
  },
};

export const getPageContent = (slug: string): PageContent | null => {
  return pages[slug] || null;
};
