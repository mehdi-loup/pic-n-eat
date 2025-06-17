import { Text } from '@radix-ui/themes';
import type { LucideIcon } from 'lucide-react';
import type React from 'react';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-gray-100 p-4 mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <Text size="6" weight="bold">
        {title}
      </Text>
      <Text as="p" color="gray">
        {subtitle}
      </Text>
    </div>
  );
};

export default EmptyState;
