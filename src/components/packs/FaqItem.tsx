
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => (
  <AnimatedContainer animation="slide-up">
    <BlurredCard>
      <div className="p-6">
        <h4 className="text-lg font-medium mb-2">{question}</h4>
        <p className="text-muted-foreground">{answer}</p>
      </div>
    </BlurredCard>
  </AnimatedContainer>
);

export default FaqItem;
