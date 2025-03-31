
export { useContractData } from './hooks/useContractData';

// Re-export existing components
export { default as ContractHeader } from './ContractHeader';
export { default as ContractContent } from './ContractContent';
export { default as ContactInfo } from './ContactInfo';
export { default as SignatureSection } from './SignatureSection';
export { default as ContractActions } from './ContractActions';

// Re-export types
export type { SharedContract } from '@/types/shared-content';
export type { PublicContract } from './types';
