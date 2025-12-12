import { Settings } from 'lucide-react';

export default function SystemSettings() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="w-8 h-8 text-gray-600" />
                        Global System Settings
                    </h1>
                    <p className="text-gray-500 mt-1">Configure global application parameters.</p>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
                Settings module under construction.
            </div>
        </div>
    )
}
