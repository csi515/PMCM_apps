import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppShell, Sidebar, Header, useAuth } from '@repo/ui';
import { LayoutDashboard, FileText, AlertTriangle, CheckSquare, Settings, Book } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RootLayout() {
    const { t } = useTranslation();
    const location = useLocation();
    const { currentUser, logout } = useAuth();

    const menuItems = [
        { label: t('voc'), icon: FileText, href: '/voc', active: location.pathname.startsWith('/voc') },
        { label: 'FMEA', icon: AlertTriangle, href: '/fmea', active: location.pathname.startsWith('/fmea') },
        { label: 'Standard Library', icon: Book, href: '/standard-library', active: location.pathname.startsWith('/standard-library') },
        { label: 'PPAP', icon: CheckSquare, href: '/ppap', active: location.pathname.startsWith('/ppap') },
        { label: 'Issues (8D)', icon: AlertTriangle, href: '/issues', active: location.pathname.startsWith('/issues') },
        { label: 'SPC Charts', icon: LayoutDashboard, href: '/spc', active: location.pathname.startsWith('/spc') },
        { label: 'Settings', icon: Settings, href: '/settings', active: location.pathname.startsWith('/settings') },
    ];

    return (
        <AppShell
            sidebar={
                <Sidebar
                    appName="QMS System"
                    menuItems={menuItems.map(item => ({
                        title: item.label,
                        path: item.href,
                        icon: item.icon,
                    }))}
                // user prop might not be needed if Sidebar uses useApp internally, but if it accepts it, fine.
                // Checking Sidebar definition: export function Sidebar({ appName, menuItems }: SidebarProps)
                // It uses useApp() internally to get currentUser if not passed? No, line 186: const { currentUser } = useApp();
                // So user prop is NOT in SidebarProps interface! Remove it.
                />
            }
            header={<Header appName="Quality Management System" />}
        >
            <Outlet />
        </AppShell>
    );
}
