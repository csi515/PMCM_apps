import React from 'react';
import { cn } from '../../utils';

interface ActionPanelProps {
    children: React.ReactNode;
    className?: string;
}

export function ActionPanel({ children, className }: ActionPanelProps) {
    return (
        <div
            className={cn(
                "sticky bottom-0 left-0 right-0 border-t border-neutral-200 bg-white p-4 shadow-sm z-10",
                "flex items-center justify-end gap-2",
                className
            )}
        >
            {children}
        </div>
    );
}

export default ActionPanel;
