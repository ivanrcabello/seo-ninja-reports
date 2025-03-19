
import React from 'react';
import { Check } from 'lucide-react';

interface PricingItemProps {
  children: React.ReactNode;
}

const PricingItem: React.FC<PricingItemProps> = ({ children }) => (
  <li className="flex items-start">
    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
    <span className="text-sm">{children}</span>
  </li>
);

export default PricingItem;
