import { LayoutDashboard, FlaskConical, Microscope, ClipboardList, Database, FileText } from 'lucide-react';
// We import the MenuItem type from @repo/ui, but we need to ensure @repo/ui exports it.
// I updated Sidebar.tsx to export interface MenuItem, but did I export it from index.ts?
// Wait, I exported { Sidebar } from index.ts. Does that export the interface?
// Usually explicit export type { MenuItem } is needed or explicit re-export.
// I will assume I can import it from specific path or just define it structurally if needed for now.
// Actually, let's try importing from @repo/ui properly.

import { MenuItem } from '@repo/ui';
// Wait, imports from 'src' inside package might fail if not exposed in package.json exports map (if using modern resolution)
// But tsconfig paths map @repo/ui/* to packages/ui/src/*. So it should work.

export const rndMenuItems: MenuItem[] = [
    {
        title: '대시보드',
        path: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: '연구 과제',
        children: [
            {
                title: '과제 목록',
                path: '/projects',
                icon: FlaskConical,
            },
            {
                title: '과제 등록',
                path: '/projects/new',
                icon: FileText,
            },
        ]
    },
    {
        title: '장비 관리',
        children: [
            {
                title: '장비 목록',
                path: '/equipment',
                icon: Microscope,
            },
            {
                title: '예약 현황',
                path: '/equipment/schedule',
                icon: ClipboardList,
            }
        ]
    },
    {
        title: '자재 관리',
        children: [
            {
                title: '재고 목록',
                path: '/inventory',
                icon: Database,
            },
            {
                title: '입출고 기록',
                path: '/inventory/logs',
                icon: ClipboardList,
            }
        ]
    }
];
