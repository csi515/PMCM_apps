import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: string;
    title?: string;
    action?: ReactNode;
}

export default function Card({ children, className = '', padding = 'p-6', title, action }: CardProps) {
    return (
        <div className={`bg-white rounded-2xl shadow-soft border border-neutral-100 transition-shadow duration-300 hover:shadow-medium ${padding} ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between mb-6">
                    {title && <h3 className="text-lg font-bold text-neutral-900">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
