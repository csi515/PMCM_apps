import { Outlet } from 'react-router-dom';
import { Sidebar, Header } from '@repo/ui';

export default function Layout() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar appName="RND" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header appName="RND Management System" />
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
