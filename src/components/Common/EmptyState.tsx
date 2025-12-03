import React, { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

function EmptyState({
  icon,
  title,
  message,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`card text-center py-12 ${className}`}>
      <div className="flex flex-col items-center">
        {icon || (
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-neutral-400" />
          </div>
        )}
        {title && (
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
        )}
        <p className="text-neutral-500 mb-4">{message}</p>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

export default EmptyState;

