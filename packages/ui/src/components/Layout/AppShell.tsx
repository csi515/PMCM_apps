import React from 'react';
import { cn } from '../../utils';

interface AppShellProps {
    sidebar?: React.ReactNode;
    header?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function AppShell({ sidebar, header, children, className }: AppShellProps) {
    return (
        <div className={cn("flex min-h-screen bg-neutral-50", className)}>
            {sidebar && (
                <aside className="fixed inset-y-0 left-0 z-20 w-64 border-r border-neutral-200 bg-white">
                    {sidebar}
                </aside>
            )}
            <div className={cn("flex-1 flex flex-col min-w-0 transition-all", sidebar && "ml-64")}>
                {header && (
                    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
                        {header}
                    </header>
                )}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AppShell;
