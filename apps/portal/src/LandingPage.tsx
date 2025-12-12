import { useNavigate } from 'react-router-dom';
import {
    BarChart3,
    ShieldCheck,
    FlaskConical,
    Settings,
    ArrowRight,
    LogOut,
    Construction
} from 'lucide-react';
import { useApp } from '@repo/ui';

function LandingPage() {
    const { currentUser, logout } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const apps = [
        {
            id: 'gtm',
            name: 'GTM Strategy',
            description: 'Goal & Task Management',
            icon: BarChart3,
            color: 'from-blue-500 to-indigo-600',
            shadow: 'shadow-blue-500/30',
            url: 'http://localhost:5173', // GTM Web
            status: 'active'
        },
        {
            id: 'qms',
            name: 'QMS Quality',
            description: 'Quality Management System',
            icon: ShieldCheck,
            color: 'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-500/30',
            url: '#',
            status: 'coming_soon'
        },
        {
            id: 'rnd',
            name: 'R&D Innovation',
            description: 'Research & Development',
            icon: FlaskConical,
            color: 'from-violet-500 to-purple-600',
            shadow: 'shadow-violet-500/30',
            url: '#',
            status: 'coming_soon'
        }
    ];

    const handleAppClick = (app: typeof apps[0]) => {
        if (app.status === 'active') {
            window.location.assign(app.url);
        } else {
            alert('This module is currently under development.');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] overflow-x-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-100 rounded-full blur-[120px] opacity-40"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-100 rounded-full blur-[120px] opacity-40"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-xl">
                        P
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-neutral-900 leading-none">PMCM</h1>
                        <p className="text-xs text-neutral-500 font-medium tracking-wider">ENTERPRISE PORTAL</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-sm font-semibold text-neutral-800">{currentUser?.name}</span>
                        <span className="text-xs text-neutral-500">{currentUser?.department} / {currentUser?.position}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all duration-200 shadow-sm"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-8 py-12 md:py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
                        Select Your Workspace
                    </h2>
                    <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                        Access your department's tools and dashboards from a single integrated platform.
                    </p>
                </div>

                {/* App Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4 md:px-0">
                    {apps.map((app) => (
                        <div
                            key={app.id}
                            onClick={() => handleAppClick(app)}
                            className={`group relative bg-white rounded-3xl p-8 border border-neutral-100 shadow-xl shadow-neutral-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden ${app.status !== 'active' ? 'opacity-90' : ''}`}
                        >
                            {/* Card Gradient Overlay (Hover) */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                            <div className="relative z-10 flex flex-col items-center text-center h-full">
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg ${app.shadow} mb-8 transform group-hover:scale-110 transition-transform duration-300`}>
                                    <app.icon className="w-10 h-10" />
                                </div>

                                <h3 className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                                    {app.name}
                                </h3>
                                <p className="text-neutral-500 mb-8 flex-grow">
                                    {app.description}
                                </p>

                                {app.status === 'active' ? (
                                    <div className="w-full py-3 rounded-xl bg-neutral-50 text-neutral-600 font-semibold group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors flex items-center justify-center gap-2">
                                        Open Workspace <ArrowRight className="w-4 h-4" />
                                    </div>
                                ) : (
                                    <div className="w-full py-3 rounded-xl bg-neutral-50 text-neutral-400 font-medium flex items-center justify-center gap-2 border border-dashed border-neutral-200">
                                        <Construction className="w-4 h-4" /> Under Construction
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Admin Link (Corner or Bottom) */}
                {currentUser?.role === 'ADMIN' && (
                    <div className="flex justify-center">
                        <button
                            onClick={() => window.location.assign('http://localhost:5175')} // Admin Web
                            className="flex items-center gap-3 px-6 py-3 rounded-full bg-neutral-800 text-white font-medium hover:bg-neutral-900 hover:shadow-lg hover:shadow-neutral-800/20 transition-all duration-200 group"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                                <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                            </div>
                            <span>Access System Admin</span>
                            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default LandingPage;
